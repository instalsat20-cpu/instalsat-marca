export function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-7">
      {eyebrow && (
        <p className="mb-1 text-xs font-medium tracking-wide text-brasa">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mb-3 text-lg font-medium text-bruma-light">{title}</h2>
      )}
      <div className="space-y-3 text-sm font-light leading-relaxed text-bruma-light/65">
        {children}
      </div>
    </div>
  );
}
