/**
 * Renders a JSON-LD payload. Kept in one place so pages don't repeat the
 * `dangerouslySetInnerHTML` boilerplate (and stay consistent).
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}