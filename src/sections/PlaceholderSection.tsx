export default function PlaceholderSection({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-2xl border border-black/10 p-8">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle ? <p className="mt-2 text-black/60">{subtitle}</p> : null}
        <div className="mt-6 h-32 rounded-xl bg-black/5" />
      </div>
    </section>
  );
}
