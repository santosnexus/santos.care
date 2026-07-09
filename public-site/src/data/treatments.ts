export interface Treatment {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  body: string[];
  icon: string;
  procedures: string[];
  costRange: { from: number; to: number };
  costComparison: { country: string; flag: string; from: number; to: number }[];
  recoveryDays: number;
  hospitalStayDays: number;
  successRate: string;
}

export const treatments: Record<string, Treatment> = {
  cardiac: {
    slug: "cardiac",
    title: "Cardiac Surgery",
    tagline: "World-class heart care at a fraction of the cost",
    description:
      "India offers JCI-accredited cardiac care with success rates matching global benchmarks. From bypass surgery to valve replacements, our partner hospitals in Kochi deliver exceptional outcomes.",
    body: [
      "Cardiovascular disease is the leading cause of death globally. At Heal India, we connect you with India's top cardiac surgeons and JCI-accredited hospitals in Kochi, Kerala — a region renowned for its medical expertise and holistic healing environment.",
      "Our partner hospitals perform over 1,000 cardiac procedures annually with success rates exceeding 98%. The cost savings are substantial — typically 80-90% less than US or UK prices, with no compromise on quality.",
      "What sets us apart is our integrated approach: surgery at a world-class cardiac centre followed by Ayurveda-based cardiac recovery therapy at Ayush Prana retreat. This unique model accelerates healing and reduces complications.",
    ],
    icon: "Heart",
    procedures: [
      "Coronary Artery Bypass Grafting (CABG)",
      "Heart Valve Replacement & Repair",
      "Angioplasty & Stenting",
      "Aortic Aneurysm Surgery",
      "Congenital Heart Defect Correction",
      "Heart Transplant",
      "Peripheral Vascular Surgery",
      "Cardiac Electrophysiology",
    ],
    costRange: { from: 4500, to: 12000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 80000, to: 200000 },
      { country: "UK", flag: "🇬🇧", from: 50000, to: 120000 },
      { country: "UAE", flag: "🇦🇪", from: 30000, to: 70000 },
      { country: "India", flag: "🇮🇳", from: 4500, to: 12000 },
    ],
    recoveryDays: 30,
    hospitalStayDays: 7,
    successRate: "98.5%",
  },
  orthopedics: {
    slug: "orthopedics",
    title: "Orthopedic Surgery",
    tagline: "Regain mobility with advanced orthopaedic care",
    description:
      "Knee and hip replacements, spine surgery, and sports medicine at JCI-accredited hospitals — with significant cost advantages and high success rates.",
    body: [
      "Orthopaedic procedures are among the most sought-after treatments in India, with Kerala emerging as a preferred destination. Our network includes hospitals specialising in robotic-assisted joint replacements and minimally invasive spine surgery.",
      "Patients from Africa, the Middle East, and Europe regularly choose India for orthopaedic care, saving 70-85% compared to their home countries. Our partner surgeons have trained at leading international institutions and bring global expertise to every procedure.",
      "Post-surgery rehabilitation is integrated with Ayurveda therapies to accelerate recovery, reduce pain, and improve mobility outcomes.",
    ],
    icon: "Bone",
    procedures: [
      "Total Knee Replacement",
      "Total Hip Replacement",
      "Spinal Fusion & Disc Replacement",
      "Shoulder Replacement",
      "ACL Reconstruction",
      "Sports Injury Repair",
      "Arthroscopic Surgery",
      "Trauma & Fracture Management",
    ],
    costRange: { from: 5500, to: 10000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 40000, to: 100000 },
      { country: "UK", flag: "🇬🇧", from: 25000, to: 60000 },
      { country: "UAE", flag: "🇦🇪", from: 20000, to: 45000 },
      { country: "India", flag: "🇮🇳", from: 5500, to: 10000 },
    ],
    recoveryDays: 45,
    hospitalStayDays: 5,
    successRate: "97%",
  },
  ivf: {
    slug: "ivf",
    title: "IVF & Fertility Treatment",
    tagline: "Building families with advanced fertility care",
    description:
      "Comprehensive fertility treatments including IVF, ICSI, egg donation, and surrogacy at leading fertility centres in India.",
    body: [
      "India has become a global hub for fertility tourism, offering advanced reproductive treatments at accessible costs. Our partner fertility centres in Kochi combine state-of-the-art embryology labs with compassionate care.",
      "Success rates at our partner clinics compare favourably with global averages, while costs are 75-90% lower than in the US, UK, or Australia. We provide end-to-end support including legal assistance for surrogacy and egg donation arrangements where permitted.",
    ],
    icon: "Sparkles",
    procedures: [
      "In-Vitro Fertilisation (IVF)",
      "Intra-Cytoplasmic Sperm Injection (ICSI)",
      "Egg & Sperm Donation",
      "Surrogacy Arrangements",
      "Fertility Preservation",
      "Preimplantation Genetic Testing (PGT)",
      "IUI Treatment",
      "Male Infertility Treatments",
    ],
    costRange: { from: 3500, to: 8000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 12000, to: 25000 },
      { country: "UK", flag: "🇬🇧", from: 8000, to: 18000 },
      { country: "UAE", flag: "🇦🇪", from: 7000, to: 15000 },
      { country: "India", flag: "🇮🇳", from: 3500, to: 8000 },
    ],
    recoveryDays: 14,
    hospitalStayDays: 1,
    successRate: "65-75%",
  },
  oncology: {
    slug: "oncology",
    title: "Cancer Treatment",
    tagline: "Comprehensive oncology care with compassion",
    description:
      "Multidisciplinary cancer treatment including surgery, chemotherapy, radiation therapy, and immunotherapy at JCI-accredited oncology centres.",
    body: [
      "Cancer treatment in India has advanced significantly, with JCI-accredited cancer centres offering the full spectrum of oncology services. Our partner hospitals in Kochi provide multidisciplinary care coordinated by tumour boards comprising surgeons, medical oncologists, radiation oncologists, and pathologists.",
      "Treatment costs are typically 70-85% lower than in Western countries, with comparable outcomes. We also offer integrative support including nutritional counselling, psychological support, and Ayurveda-based recovery therapies.",
    ],
    icon: "Activity",
    procedures: [
      "Cancer Surgery",
      "Chemotherapy",
      "Radiation Therapy (IMRT/IGRT)",
      "Immunotherapy",
      "Targeted Therapy",
      "Bone Marrow Transplant",
      "Palliative Care",
      "Screening & Early Detection",
    ],
    costRange: { from: 6000, to: 25000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 60000, to: 300000 },
      { country: "UK", flag: "🇬🇧", from: 40000, to: 180000 },
      { country: "UAE", flag: "🇦🇪", from: 30000, to: 120000 },
      { country: "India", flag: "🇮🇳", from: 6000, to: 25000 },
    ],
    recoveryDays: 60,
    hospitalStayDays: 10,
    successRate: "Varies by type & stage",
  },
  cosmetic: {
    slug: "cosmetic",
    title: "Cosmetic & Plastic Surgery",
    tagline: "Enhance your appearance with expert aesthetic surgery",
    description:
      "Aesthetic and reconstructive procedures by board-certified plastic surgeons at accredited facilities in Kochi, India.",
    body: [
      "India's cosmetic surgery sector has grown exponentially, with Kerala attracting patients seeking natural-looking results combined with a peaceful recovery environment. Our partner surgeons are board-certified members of the Indian Association of Plastic Surgeons.",
      "From facial procedures to body contouring, costs are 70-85% lower than in Western countries. Our unique advantage: combine your procedure with a recuperative stay in Kerala's backwaters — healing for body and mind.",
    ],
    icon: "Smile",
    procedures: [
      "Facelift & Neck Lift",
      "Rhinoplasty",
      "Breast Augmentation & Reduction",
      "Tummy Tuck",
      "Liposuction",
      "Eyelid Surgery",
      "Hair Transplant",
      "Scar Revision",
    ],
    costRange: { from: 3000, to: 9000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 8000, to: 30000 },
      { country: "UK", flag: "🇬🇧", from: 6000, to: 22000 },
      { country: "UAE", flag: "🇦🇪", from: 5000, to: 18000 },
      { country: "India", flag: "🇮🇳", from: 3000, to: 9000 },
    ],
    recoveryDays: 21,
    hospitalStayDays: 3,
    successRate: "95%+",
  },
  dental: {
    slug: "dental",
    title: "Dental Treatment",
    tagline: "Complete dental care — from basics to full-mouth rehabilitation",
    description:
      "World-class dental treatments including implants, veneers, crowns, and full-mouth rehabilitation at modern dental clinics in Kochi.",
    body: [
      "Dental tourism to India has become hugely popular, with patients saving 70-85% on complex dental procedures while receiving care at clinics equipped with the latest technology. Our partner dental centres in Kochi use digital smile design, 3D imaging, and CAD/CAM technology.",
      "For full-mouth rehabilitation or dental implant procedures, the cost advantage is substantial. Combine your dental vacation with Kerala's renowned hospitality and natural beauty.",
    ],
    icon: "Snowflake",
    procedures: [
      "Dental Implants (Single & Full Mouth)",
      "Porcelain Veneers",
      "Crowns & Bridges",
      "Root Canal Treatment",
      "Teeth Whitening",
      "Orthodontics (Braces & Invisalign)",
      "Full Mouth Rehabilitation",
      "Gum Disease Treatment",
    ],
    costRange: { from: 500, to: 7000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 3000, to: 40000 },
      { country: "UK", flag: "🇬🇧", from: 2500, to: 30000 },
      { country: "UAE", flag: "🇦🇪", from: 2000, to: 25000 },
      { country: "India", flag: "🇮🇳", from: 500, to: 7000 },
    ],
    recoveryDays: 7,
    hospitalStayDays: 1,
    successRate: "98%",
  },
  "weight-loss": {
    slug: "weight-loss",
    title: "Weight Loss Surgery",
    tagline: "Transform your health with bariatric surgery",
    description:
      "Bariatric surgery including gastric bypass, sleeve gastrectomy, and gastric balloon at JCI-accredited bariatric centres of excellence.",
    body: [
      "Obesity is a global health crisis, and bariatric surgery offers the most effective long-term solution. Our partner hospitals in Kochi include centres of excellence with dedicated bariatric teams, specialised operating rooms, and comprehensive aftercare programmes.",
      "Patients achieve 60-80% of excess weight loss within 12-18 months, with significant improvement or resolution of obesity-related conditions like diabetes, hypertension, and sleep apnoea. All at 75-85% less cost than Western countries.",
    ],
    icon: "TrendingDown",
    procedures: [
      "Gastric Sleeve (Sleeve Gastrectomy)",
      "Gastric Bypass",
      "Gastric Balloon",
      "Mini Gastric Bypass",
      "Revision Bariatric Surgery",
      "Metabolic Surgery for Diabetes",
    ],
    costRange: { from: 4500, to: 8000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 15000, to: 35000 },
      { country: "UK", flag: "🇬🇧", from: 10000, to: 25000 },
      { country: "UAE", flag: "🇦🇪", from: 9000, to: 20000 },
      { country: "India", flag: "🇮🇳", from: 4500, to: 8000 },
    ],
    recoveryDays: 30,
    hospitalStayDays: 4,
    successRate: "90%+",
  },
  neurology: {
    slug: "neurology",
    title: "Neurology & Neurosurgery",
    tagline: "Expert neurological care for complex conditions",
    description:
      "Advanced diagnosis and treatment of neurological disorders including brain and spine surgery at JCI-accredited neuroscience centres.",
    body: [
      "India's neuroscience centres offer world-class care for complex neurological conditions. Our partner hospitals in Kochi feature dedicated neuroscience units with experienced neurosurgeons, interventional neuroradiologists, and rehabilitation teams.",
      "From brain tumour surgery to stroke treatment, costs are 70-85% lower than in Western countries. Post-surgical rehabilitation integrates physiotherapy and Ayurveda for optimal recovery outcomes.",
    ],
    icon: "Brain",
    procedures: [
      "Brain Tumour Surgery",
      "Spine Surgery",
      "Deep Brain Stimulation",
      "Stroke Treatment & Rehabilitation",
      "Epilepsy Surgery",
      "Peripheral Nerve Surgery",
      "Endovascular Neurosurgery",
      "Movement Disorder Treatment",
    ],
    costRange: { from: 5000, to: 15000 },
    costComparison: [
      { country: "USA", flag: "🇺🇸", from: 30000, to: 150000 },
      { country: "UK", flag: "🇬🇧", from: 20000, to: 90000 },
      { country: "UAE", flag: "🇦🇪", from: 18000, to: 70000 },
      { country: "India", flag: "🇮🇳", from: 5000, to: 15000 },
    ],
    recoveryDays: 45,
    hospitalStayDays: 8,
    successRate: "95%",
  },
};

export const treatmentList = Object.values(treatments);
