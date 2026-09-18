import { Link } from "next-view-transitions";

export default function DesignIndexPage() {
  const ready = [
    {
      href: "/design/a",
      label: "A · Bancada",
      note: "Bone canvas, ink, electric orange. Graphic, work-first, hard shadows.",
    },
  ];

  const upcoming = [
    { label: "B · Estúdio à noite", note: "Dark, warm, cinematic. Next up." },
    { label: "C · Planta", note: "Technical paper, node map. After B." },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        internal · noindex
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Design explorations
      </h1>
      <p className="mt-2 text-muted-foreground">
        Same content, different skins. Pick the direction — or steal ideas from
        all three.
      </p>

      <ul className="mt-10 space-y-4">
        {ready.map((variant) => (
          <li key={variant.href}>
            <Link
              href={variant.href}
              className="block rounded-md border border-border p-5 transition-colors hover:border-foreground"
            >
              <span className="font-medium">{variant.label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {variant.note}
              </span>
            </Link>
          </li>
        ))}
        {upcoming.map((variant) => (
          <li
            key={variant.label}
            className="block rounded-md border border-dashed border-border p-5 opacity-60"
          >
            <span className="font-medium">{variant.label}</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {variant.note}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
