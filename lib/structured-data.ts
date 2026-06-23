export function generatePersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pedro Santos",
    jobTitle: "Software Engineer",
    url: "https://pedrosantos.dev",
    sameAs: [
      "https://github.com/pedrocarlos-ti",
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
      name: "Aubay Portugal",
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Unibratec",
      },
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Web Development",
      "Software Engineering",
      "Developer Tooling",
    ],
  };
}

export function generateWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pedro Santos",
    url: "https://pedrosantos.dev",
    description:
      "Software engineer building web products with React, Next.js, and modern tooling.",
    author: {
      "@type": "Person",
      name: "Pedro Santos",
    },
  };
}