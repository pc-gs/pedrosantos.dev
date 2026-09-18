export function generatePersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pedro Santos",
    jobTitle: "Software Engineer",
    description:
      "Software engineer shipping production React and Next.js by day, building Melro.io on the side. Open to full-time and contract work.",
    url: "https://pedrosantos.dev",
    sameAs: [
      "https://github.com/pc-gs",
      "https://linkedin.com/in/pedro-santos",
      "https://x.com/pcgs_tsx",
    ],
    email: "pedrocarlos.ti@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Belmonte",
      addressCountry: "PT",
    },
    worksFor: {
      "@type": "Organization",
      name: "Melro.io",
      url: "https://melro.io",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Web Development",
      "Frontend Development",
      "Developer Experience",
      "Software Engineering",
      "React Native",
      "Tauri",
      "Cross-platform Development",
      "Desktop Applications",
    ],
  };
}

export function generateWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "pedrosantos.dev",
    url: "https://pedrosantos.dev",
    description:
      "Software engineer shipping production React and Next.js by day, building Melro.io on the side. Open to full-time and contract work.",
    author: {
      "@type": "Person",
      name: "Pedro Santos",
    },
  };
}

/* ── Article-ish payloads (blog posts + log entries) ───────────────────── */

export function generateArticleStructuredData({
  type = "BlogPosting",
  title,
  description,
  url,
  datePublished,
  tags,
  section,
}: {
  /** `BlogPosting` for essays, `TechArticle` for short log entries. */
  type?: "BlogPosting" | "TechArticle";
  title: string;
  description: string;
  url: string;
  datePublished: string;
  tags?: string[];
  /** Human label for the collection it belongs to, e.g. "The log". */
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Person",
      name: "Pedro Santos",
      url: "https://pedrosantos.dev/about",
    },
    publisher: {
      "@type": "Person",
      name: "Pedro Santos",
      url: "https://pedrosantos.dev",
    },
    ...(tags && tags.length > 0 ? { keywords: tags.join(", ") } : {}),
    ...(section ? { isPartOf: { "@type": "CollectionPage", name: section } } : {}),
  };
}

export function generateBreadcrumbStructuredData(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateCollectionStructuredData({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { title: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: "pedrosantos.dev", url: "https://pedrosantos.dev" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: item.url,
      })),
    },
  };
}
