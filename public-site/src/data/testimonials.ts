export interface Testimonial {
  name: string;
  country: string;
  treatment: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Grace Mwangi",
    country: "Kenya",
    treatment: "Cardiac Bypass Surgery",
    content:
      "I was scared about heart surgery, but the team at Aster Medcity made me feel completely at home. From airport pickup to post-op recovery at Ayush Prana, every detail was handled. I saved over 70% compared to Nairobi private hospitals.",
    rating: 5,
  },
  {
    name: "Ahmed Al-Rashidi",
    country: "UAE",
    treatment: "Knee Replacement",
    content:
      "My knee replacement at Amrita Hospital was seamless. The robotic surgery meant I was walking within 24 hours. The cost including flights and 2 weeks at a resort was less than the surgery alone in Dubai.",
    rating: 5,
  },
  {
    name: "Sarah Thompson",
    country: "United Kingdom",
    treatment: "Dental Implants",
    content:
      "Full-mouth dental implants in the UK would have cost £25,000. I paid £6,500 in Kochi including my stay at a beautiful heritage hotel. The quality exceeded my expectations. I'm already planning to return for veneers.",
    rating: 5,
  },
  {
    name: "John Okafor",
    country: "Nigeria",
    treatment: "IVF Treatment",
    content:
      "After three failed IVF cycles in Lagos, we came to Kochi. The success rate and expertise here is remarkable. We're now proud parents of twins. The team supported us through every step, including legal documentation.",
    rating: 5,
  },
  {
    name: "Fatima Al-Busaidi",
    country: "Oman",
    treatment: "Weight Loss Surgery",
    content:
      "My gastric sleeve surgery changed my life. I've lost 45kg in 8 months. The pre-op counselling and post-op Ayurveda recovery programme made all the difference. Muscat to Kochi is just a 3-hour flight — incredibly convenient.",
    rating: 5,
  },
  {
    name: "David Kimani",
    country: "Tanzania",
    treatment: "Spine Surgery",
    content:
      "I had a herniated disc that left me unable to walk. The microdiscectomy in Kochi was expertly performed, and within 2 weeks I was walking again. The cost including everything was less than a quote I got from South Africa.",
    rating: 5,
  },
];
