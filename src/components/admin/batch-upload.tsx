"use client";

import { useRef, useState } from "react";
import { File, LoaderCircle, Trash2, UploadCloud } from "lucide-react";

type BatchContext = "logos" | "grafismos";
type UploadStatus = "selected" | "uploading" | "uploaded" | "error";

type BatchItem = {
  id: string;
  file: globalThis.File;
  name: string;
  variation: string;
  format: string;
  colorMode: string;
  colorProfile: string;
  permission: string;
  downloadUrl: string;
  previewUrl: string | null;
  progress: number;
  status: UploadStatus;
  error: string | null;
};

const VARIATIONS = ["Horizontal", "Vertical", "Símbolo isolado", "Monocromático", "Negativo", "Outro"];
const FORMATS = ["AI", "SVG", "PNG", "PDF", "EPS"];
const COLOR_MODES = ["Colorido", "Monocromático", "Negativo"];
const COLOR_PROFILES = ["RGB", "CMYK"];

function fileFormat(name: string) {
  const extension = name.split(".").pop()?.toUpperCase() || "OUTRO";
  return FORMATS.includes(extension) ? extension : extension;
}

function fileNameWithoutExtension(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uploadFile(item: BatchItem, onProgress: (progress: number) => void) {
  return new Promise<{ url: string }>((resolve, reject) => {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", item.file);

    request.open("POST", "/api/upload");
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      let data: { url?: string; error?: string } = {};
      try {
        data = JSON.parse(request.responseText);
      } catch {
        reject(new Error("Resposta inválida do servidor."));
        return;
      }
      if (request.status >= 200 && request.status < 300 && data.url) {
        resolve({ url: data.url });
      } else {
        reject(new Error(data.error || "Falha ao enviar."));
      }
    });
    request.addEventListener("error", () => reject(new Error("Falha de conexão.")));
    request.send(formData);
  });
}

export function BatchUpload({ context, onSuccess }: { context: BatchContext; onSuccess: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const permissionOptions = context === "logos"
    ? [{ value: "logo_basic", label: "Básico" }, { value: "logo_advanced", label: "Avançado" }]
    : [{ value: "elements_basic", label: "Básico" }, { value: "elements_advanced", label: "Avançado" }];

  function addFiles(files: FileList | globalThis.File[]) {
    const selected = Array.from(files);
    setItems((current) => [
      ...current,
      ...selected.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: fileNameWithoutExtension(file.name),
        variation: "Outro",
        format: fileFormat(file.name),
        colorMode: "Colorido",
        colorProfile: "RGB",
        permission: permissionOptions[0].value,
        downloadUrl: "",
        previewUrl: null,
        progress: 0,
        status: "selected" as const,
        error: null,
      })),
    ]);
    setMessage(null);
  }

  function updateItem(id: string, patch: Partial<BatchItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  async function uploadAll() {
    const pending = items.filter((item) => item.status === "selected" || item.status === "error");
    if (pending.length === 0) return;
    setUploading(true);
    setMessage(null);

    await Promise.all(pending.map(async (item) => {
      updateItem(item.id, { status: "uploading", progress: 0, error: null });
      try {
        const { url } = await uploadFile(item, (progress) => updateItem(item.id, { progress }));
        const imagePreview = item.format === "PNG" || item.format === "SVG" ? url : null;
        updateItem(item.id, {
          status: "uploaded",
          progress: 100,
          downloadUrl: url,
          previewUrl: imagePreview,
        });
      } catch (error) {
        updateItem(item.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Falha ao enviar.",
        });
      }
    }));

    setUploading(false);
  }

  async function saveAll() {
    const uploaded = items.filter((item) => item.status === "uploaded");
    if (uploaded.length === 0 || uploaded.length !== items.length) {
      setMessage("Conclua todos os uploads antes de cadastrar.");
      return;
    }
    if (uploaded.some((item) => !item.name.trim())) {
      setMessage("Preencha o nome de todos os arquivos.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const endpoint = context === "logos" ? "/api/admin/logos/batch" : "/api/admin/elements/batch";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: uploaded.map(({ name, variation, format, colorMode, colorProfile, permission, downloadUrl, previewUrl }) => ({
            name,
            variation,
            format,
            colorMode: colorMode.toLowerCase(),
            colorProfile,
            permission,
            downloadUrl,
            previewUrl,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Não foi possível cadastrar os arquivos.");
        return;
      }
      setItems([]);
      setMessage(`${data.count} arquivo(s) cadastrado(s).`);
      onSuccess();
    } catch {
      setMessage("Não foi possível cadastrar os arquivos.");
    } finally {
      setSaving(false);
    }
  }

  const selectClass = "min-w-32 rounded-lg border border-bruma-light/10 bg-petroleo px-2 py-2 text-xs text-bruma-light outline-none";

  return (
    <section className="mb-8 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-bruma-light">Upload em lote</h2>
        <p className="mt-1 text-xs text-bruma-light/45">Selecione, envie e revise vários arquivos antes do cadastro.</p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-8 text-center transition ${dragging ? "border-brasa bg-brasa/10" : "border-bruma-light/20 hover:border-bruma-light/40"}`}
      >
        <UploadCloud className="mb-2 text-brasa" size={24} />
        <span className="text-sm font-medium text-bruma-light">Arraste os arquivos ou clique para selecionar</span>
        <span className="mt-1 text-xs text-bruma-light/40">AI, SVG, PNG, PDF, EPS e outros formatos</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {items.length > 0 && (
        <>
          <div className="mt-5 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs text-bruma-light/60">
                {item.status === "uploading" ? <LoaderCircle className="animate-spin" size={15} /> : <File size={15} />}
                <span className="min-w-0 flex-1 truncate">{item.file.name} · {formatBytes(item.file.size)}</span>
                <span>{item.progress}%</span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bruma-light/10">
                  <div className="h-full rounded-full bg-brasa transition-[width]" style={{ width: `${item.progress}%` }} />
                </div>
                {item.error && <span className="max-w-52 text-brasa">{item.error}</span>}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={uploadAll}
            disabled={uploading || items.every((item) => item.status === "uploaded")}
            className="mt-4 rounded-xl border border-bruma-light/15 px-4 py-2 text-sm font-medium text-bruma-light transition hover:bg-bruma-light/5 disabled:opacity-40"
          >
            {uploading ? "Enviando..." : "Subir todos"}
          </button>

          {items.some((item) => item.status === "uploaded") && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead className="text-[11px] uppercase tracking-wide text-bruma-light/35">
                  <tr>{["Preview", "Nome", "Variação", "Formato", "Modo de cor", "Perfil", "Permissão", ""].map((title) => <th key={title} className="border-b border-bruma-light/10 px-2 py-2 font-medium">{title}</th>)}</tr>
                </thead>
                <tbody>
                  {items.filter((item) => item.status === "uploaded").map((item) => (
                    <tr key={item.id} className="border-b border-bruma-light/10">
                      <td className="px-2 py-3">
                        {item.previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.previewUrl} alt="" className="size-12 rounded-lg bg-white/90 object-contain p-1" />
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-lg bg-bruma-light/5 text-[10px] font-semibold text-bruma-light/50">{item.format}</div>
                        )}
                      </td>
                      <td className="px-2 py-3"><input value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} className="w-44 rounded-lg border border-bruma-light/10 bg-bruma-light/5 px-2 py-2 text-xs text-bruma-light outline-none" /></td>
                      <td className="px-2 py-3"><select value={item.variation} onChange={(event) => updateItem(item.id, { variation: event.target.value })} className={selectClass}>{VARIATIONS.map((option) => <option key={option}>{option}</option>)}</select></td>
                      <td className="px-2 py-3"><select value={item.format} onChange={(event) => updateItem(item.id, { format: event.target.value })} className={selectClass}>{Array.from(new Set([...FORMATS, item.format])).map((option) => <option key={option}>{option}</option>)}</select></td>
                      <td className="px-2 py-3"><select value={item.colorMode} onChange={(event) => updateItem(item.id, { colorMode: event.target.value })} className={selectClass}>{COLOR_MODES.map((option) => <option key={option}>{option}</option>)}</select></td>
                      <td className="px-2 py-3"><select value={item.colorProfile} onChange={(event) => updateItem(item.id, { colorProfile: event.target.value })} className={selectClass}>{COLOR_PROFILES.map((option) => <option key={option}>{option}</option>)}</select></td>
                      <td className="px-2 py-3"><select value={item.permission} onChange={(event) => updateItem(item.id, { permission: event.target.value })} className={selectClass}>{permissionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></td>
                      <td className="px-2 py-3"><button type="button" aria-label={`Excluir ${item.name}`} onClick={() => setItems((current) => current.filter((currentItem) => currentItem.id !== item.id))} className="rounded-lg p-2 text-bruma-light/40 hover:bg-bruma-light/5 hover:text-brasa"><Trash2 size={15} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-bruma-light/45">Revise todos os campos antes de confirmar.</p>
                <button type="button" onClick={saveAll} disabled={saving || uploading} className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50">{saving ? "Cadastrando..." : "Cadastrar todos"}</button>
              </div>
            </div>
          )}
        </>
      )}

      {message && <p className="mt-3 text-xs font-medium text-brasa">{message}</p>}
    </section>
  );
}
