export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-semibold text-petroleo">
        {title}
        <span className="text-brasa">.</span>
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-base font-light text-petroleo/70">
          {subtitle}
        </p>
      )}
    </div>
  );
}
