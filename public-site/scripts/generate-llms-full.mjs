// Generates public/llms-full.txt — a full, plain-text dump of the site for AI crawlers.
// Run: node scripts/generate-llms-full.mjs
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const OUT = path.join(process.cwd(), "public/llms-full.txt");

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

fs.writeFileSync(OUT, out);
console.log(`Wrote ${OUT} (${out.length} bytes, ${posts.length} posts)`);
