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
    <div className="rounded-2xl bg-white p-7 shadow-sm">
      {eyebrow && (
        <p className="mb-1 text-xs font-medium tracking-wide text-brasa">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mb-3 text-lg font-medium text-petroleo">{title}</h2>
      )}
      <div className="space-y-3 text-sm font-light leading-relaxed text-petroleo/80">
        {children}
      </div>
    </div>
  );
}
