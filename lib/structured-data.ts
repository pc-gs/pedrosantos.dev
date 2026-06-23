export function generatePersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pedro Santos",
    jobTitle: "Builder & Software Engineer",
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
      name: "Melro.io",
      url: "https://melro.io",
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Rocketseat",
      },
      {
        "@type": "EducationalOrganization",
        name: "Coursera",
      },
      {
        "@type": "EducationalOrganization",
        name: "Unibratec",
      },
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "AI Integration",
      "Production Systems",
      "Builder Tooling",
      "Web Development",
      "Software Engineering",
    ],
  };
}

export function generateWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pedro Santos — Builder",
    url: "https://pedrosantos.dev",
    description:
      "Builder workspace and active builds. Melro.io founder shipping production systems and experiments.",
    author: {
      "@type": "Person",
      name: "Pedro Santos",
    },
  };
}
