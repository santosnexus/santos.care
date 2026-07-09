export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "Heal India Medi Tourism",
    description:
      "Medical tourism facilitator connecting international patients with JCI-accredited hospitals in India for cardiac, orthopedic, IVF, oncology, cosmetic, and dental treatments.",
    url: "https://santos.care",
    telephone: "+91-8089084080",
    email: "contact@santos.care",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Aluva",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    medicalSpecialty: [
      "Cardiac Surgery",
      "Orthopedics",
      "Fertility",
      "Oncology",
      "Cosmetic Surgery",
      "Dental",
    ],
    areaServed: ["Africa", "Europe", "Middle East", "United Kingdom", "United States"],
  };
}

export function articleSchema(post: {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.metaTitle,
    description: post.metaDescription,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
    image: post.image,
    articleSection: post.category,
    publisher: {
      "@type": "MedicalOrganization",
      name: "Heal India Medi Tourism",
      url: "https://santos.care",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://santos.care/blog/${post.slug}`,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function productSchema(product: {
  name: string;
  description: string;
  url: string;
  minPrice: number;
  maxPrice: number;
  currency?: string;
}) {
  const currency = product.currency || "USD";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: product.url,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: product.minPrice,
      highPrice: product.maxPrice,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "MedicalOrganization",
        name: "Heal India Medi Tourism",
        url: "https://santos.care",
      },
    },
  };
}

export function reviewSchema(reviews: {
  author: string;
  rating: number;
  body: string;
  treatment: string;
}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: reviews.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
        },
        author: { "@type": "Person", name: r.author },
        itemReviewed: { "@type": "MedicalProcedure", name: r.treatment },
        reviewBody: r.body,
        publisher: { "@type": "Organization", name: "Heal India Medi Tourism" },
      },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Heal India Medi Tourism",
    url: "https://santos.care",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://santos.care/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}
