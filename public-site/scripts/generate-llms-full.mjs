// Generates public/llms-full.txt — a full, plain-text dump of the site for AI crawlers.
// Run: node scripts/generate-llms-full.mjs
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const OUT_FULL = path.join(process.cwd(), "public/llms-full.txt");
const OUT_DISCOVERY = path.join(process.cwd(), "public/llms.txt");

const posts = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => fs.readFileSync(path.join(BLOG_DIR, f), "utf8"))
  .map((raw) => matter(raw))
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

const staticPages = [
  {
    title: "Heal India Medi Tourism — Home",
    url: "https://santos.care",
    body: `Heal India Medi Tourism connects international patients with JCI-accredited hospitals in Kerala, India for world-class medical treatment at 70-90% lower cost than the US, UK, or UAE. Treatments include cardiac surgery, orthopedic surgery, IVF and fertility, oncology, cosmetic and plastic surgery, dental treatment, weight loss (bariatric) surgery, and neurosurgery. Every plan includes holistic Ayurveda recovery in Kerala. Free, personalized treatment plans are delivered within 24 hours.`,
  },
  {
    title: "Treatments in India",
    url: "https://santos.care/treatments",
    body: `Browse all available treatments: cardiac surgery, orthopedics, IVF, oncology, cosmetic surgery, dental, weight loss, and neurology — each with transparent cost ranges and JCI-accredited partner hospitals in Kochi.`,
  },
  {
    title: "Partner Hospitals in Kerala",
    url: "https://santos.care/hospitals",
    body: `Heal India partners with JCI and NABH-accredited hospitals in Kochi and Kumarakom, Kerala including Aster Medcity, Amrita Institute of Medical Sciences, Sunrise Hospital, Medical Trust Hospital, and Ayush Prana Ayurveda recovery retreat.`,
  },
  {
    title: "Patient Stories",
    url: "https://santos.care/testimonials",
    body: `Verified patient stories from Kenya, UAE, UK, Nigeria, Oman, and Tanzania who saved 70-90% on cardiac, orthopedic, IVF, dental, weight loss, and spine surgery in India.`,
  },
  {
    title: "FAQ — Medical Treatment in India",
    url: "https://santos.care/faq",
    body: `Answers to common questions about medical tourism in India: costs, hospital accreditation, medical visas, travel and accommodation, recovery timelines, safety, and how the Heal India process works from first enquiry to return home.`,
  },
  {
    title: "India Medical Visa Guide",
    url: "https://santos.care/visa-guide",
    body: `Step-by-step guide to obtaining an India medical visa (e-Medical visa) for patients and companions from Kenya, Tanzania, Nigeria, UAE, Oman, UK, and other countries.`,
  },
];

let out = `# Heal India Medi Tourism — Full Content Index\n`;
out += `> Source: https://santos.care | Generated for AI assistants (llms-full.txt)\n\n`;
out += `Heal India Medi Tourism is a medical tourism facilitator based in Aluva, Kochi, Kerala, India. It connects international patients with JCI-accredited hospitals for affordable, world-class treatment with Ayurveda recovery. Contact: WhatsApp https://wa.me/919995768668, email contact@santos.care, phone +91 999 576 8668.\n\n`;

out += `## Static Pages\n\n`;
for (const p of staticPages) {
  out += `### ${p.title}\n${p.url}\n${p.body}\n\n`;
}

out += `## Blog Articles (${posts.length})\n\n`;
for (const post of posts) {
  const fm = post.data;
  out += `### ${fm.title}\n`;
  out += `${fm.metaDescription || ""}\n`;
  out += `URL: https://santos.care/blog/${fm.slug}\n`;
  out += `Category: ${fm.category} | Date: ${fm.date} | Read time: ${fm.readTime} | Author: ${fm.author}\n\n`;
  out += post.content.trim() + `\n\n`;
  out += `---\n\n`;
}

fs.writeFileSync(OUT_FULL, out);
console.log(`Wrote ${OUT_FULL} (${out.length} bytes, ${posts.length} posts)`);

// ───── Generate llms.txt (discovery index) ─────
let discovery = `# Heal India Medi Tourism — AI Discovery\n`;
discovery += `> https://santos.care\n\n`;
discovery += `Heal India Medi Tourism connects international patients with JCI-accredited hospitals in India for affordable, world-class medical treatments.\n\n`;
discovery += `## About\n`;
discovery += `Medical tourism facilitator based in Aluva, Kochi, Kerala. Specializes in cardiac surgery, orthopedics, IVF, oncology, cosmetic surgery, dental treatments, weight-loss surgery, neurology, and Ayurveda recovery options.\n\n`;
discovery += `## Key pages\n`;
discovery += `- Home: https://santos.care\n`;
discovery += `- Treatments: https://santos.care/treatments\n`;
discovery += `- Countries: https://santos.care/countries\n`;
discovery += `- Hospitals: https://santos.care/hospitals\n`;
discovery += `- Blog: https://santos.care/blog\n`;
discovery += `- FAQ: https://santos.care/faq\n`;
discovery += `- Visa Guide: https://santos.care/visa-guide\n`;
discovery += `- Contact: https://santos.care/contact\n`;
discovery += `- About: https://santos.care/about\n\n`;
discovery += `## Blog articles (${posts.length})\n`;
for (const post of posts) {
  const fm = post.data;
  discovery += `- ${fm.title}: https://santos.care/blog/${fm.slug}\n`;
}
discovery += `\n## Contact\n`;
discovery += `- WhatsApp: https://wa.me/919995768668\n`;
discovery += `- Email: contact@santos.care\n`;
discovery += `- Phone: +91 999 576 8668\n`;
discovery += `- Address: Aluva, Kochi, Kerala, India\n\n`;
discovery += `## Full content\n`;
discovery += `- Read the complete site content (all pages + blog articles) at: https://santos.care/llms-full.txt\n\n`;
discovery += `## Structured data\n`;
discovery += `- MedicalOrganization schema on all pages\n`;
discovery += `- Article schema on all blog posts\n`;
discovery += `- FAQ schema on pages with Q&A sections\n`;
discovery += `- BreadcrumbList on all pages\n`;

fs.writeFileSync(OUT_DISCOVERY, discovery);
console.log(`Wrote ${OUT_DISCOVERY} (${discovery.length} bytes, ${posts.length} posts)`);
