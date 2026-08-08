import { PageTitle } from "@/components/page-title";
import { DocumentForm } from "@/components/admin/document-form";

export default function NovoDocumentoPage() {
  return (
    <div>
      <PageTitle title="Novo documento" />
      <DocumentForm />
    </div>
  );
}
