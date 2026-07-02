export interface CountryPage {
  slug: string;
  name: string;
  region: string;
  flag: string;
  overview: string;
  challenges: string[];
  whyIndia: string[];
  treatments: string[];
  language: string;
  currency: string;
  healthcareRank: string;
}

export const countries: Record<string, CountryPage> = {
  kenya: {
    slug: "kenya",
    name: "Kenya",
    region: "East Africa",
    flag: "🇰🇪",
    overview:
      "Kenya has a growing middle class with increasing demand for quality healthcare. While Nairobi has good private hospitals, complex procedures remain expensive and limited in availability. Indian medical care offers Kenyan patients access to JCI-accredited hospitals at 60-70% less cost than private care in Kenya.",
    challenges: [
      "Limited availability of specialised cardiac and oncology services",
      "High cost of private healthcare — a bypass surgery costs $15,000-25,000 in Kenya",
      "Long waiting times for complex procedures in public hospitals",
      "Lack of advanced radiation therapy and transplant services",
      "Medical insurance often excludes pre-existing conditions",
    ],
    whyIndia: [
      "60-70% cost savings compared to private Kenyan hospitals",
      "Direct flights from Nairobi to Kochi (via Mumbai/Dubai)",
      "Large Kenyan diaspora community in India",
      "English-speaking medical staff eliminate language barriers",
      "Indian medical degrees are recognised by the Kenya Medical Practitioners Board",
      "Kerala's tropical climate is similar to Kenya, making recovery comfortable",
    ],
    treatments: ["cardiac", "orthopedics", "oncology", "ivf"],
    language: "English, Swahili",
    currency: "Kenyan Shilling (KES)",
    healthcareRank: "Quality healthcare available in Nairobi at premium cost",
  },
  uae: {
    slug: "uae",
    name: "United Arab Emirates",
    region: "GCC",
    flag: "🇦🇪",
    overview:
      "The UAE has excellent healthcare infrastructure, but costs are among the highest in the region. Many UAE residents (both Emiratis and expats) choose India for complex procedures and surgeries, attracted by 70-85% cost savings combined with internationally accredited hospitals and English-speaking doctors.",
    challenges: [
      "Extremely high healthcare costs — comparable to Western countries",
      "Limited insurance coverage for complex or pre-existing conditions",
      "Limited options for organ transplantation",
      "Long recovery periods in high-cost hotel/hospital environments",
      "Limited access to specialised paediatric cardiac surgery",
    ],
    whyIndia: [
      "70-85% cost savings including travel and accommodation",
      "2-3 hour flight from Dubai to Kochi",
      "Multiple daily flights between UAE and Kochi",
      "No visa required for UAE residents (visa on arrival in many cases)",
      "Internationally trained doctors with Western certifications",
      "Ayurveda recovery packages combining treatment with wellness tourism",
    ],
    treatments: ["cardiac", "cosmetic", "dental", "ivf", "weight-loss"],
    language: "Arabic, English, Hindi",
    currency: "UAE Dirham (AED)",
    healthcareRank: "World-class but among the most expensive globally",
  },
  uk: {
    slug: "uk",
    name: "United Kingdom",
    region: "Europe",
    flag: "🇬🇧",
    overview:
      "The NHS provides free healthcare but faces long waiting times for non-emergency procedures. Private healthcare in the UK is expensive. Indian medical tourism offers UK patients a compelling alternative: immediate access to treatment at 70-85% less cost than UK private care, with the added benefit of a recuperative holiday in Kerala.",
    challenges: [
      "NHS waiting lists of 6-12 months for hip/knee replacements",
      "UK private healthcare costs are among the highest globally",
      "Limited NHS coverage for dental and cosmetic procedures",
      "NHS restrictions on IVF funding in many regions",
      "Expensive postoperative care and rehabilitation",
    ],
    whyIndia: [
      "70-85% cost savings vs UK private healthcare",
      "No waiting lists — treatment scheduled within 2-3 weeks",
      "Direct flights from London to Kochi via Gulf hubs",
      "JCI-accredited hospitals meeting UK standards",
      "Comprehensive packages including surgery, recovery, and travel",
      "Combine treatment with a Kerala holiday — the 'medical vacation'",
    ],
    treatments: ["orthopedics", "dental", "cosmetic", "ivf", "cardiac"],
    language: "English",
    currency: "Pound Sterling (GBP)",
    healthcareRank: "Excellent NHS system but burdened by long waiting times",
  },
  tanzania: {
    slug: "tanzania",
    name: "Tanzania",
    region: "East Africa",
    flag: "🇹🇿",
    overview:
      "Tanzania's healthcare system faces significant infrastructure challenges, with most advanced treatments unavailable locally. Patients seeking cardiac surgery, oncology care, or orthopaedic procedures must travel abroad. India offers the most accessible and cost-effective destination, with a well-established medical tourism corridor from East Africa.",
    challenges: [
      "Very limited specialised medical services within Tanzania",
      "No cardiac surgery or advanced oncology centres in most regions",
      "High cost of medical evacuation to South Africa or Europe",
      "Limited health insurance coverage for overseas treatment",
      "Lack of advanced diagnostic imaging and laboratory services",
    ],
    whyIndia: [
      "Most affordable destination with JCI-accredited quality",
      "Significant Tanzanian student and business community in India",
      "English and Swahili-speaking staff available",
      "Direct flights from Dar es Salaam to Kochi (via Gulf hubs)",
      "Comprehensive care from diagnosis to rehabilitation",
      "Indian treatments are recognised by Tanzanian health authorities",
    ],
    treatments: ["cardiac", "orthopedics", "oncology", "neurology"],
    language: "English, Swahili",
    currency: "Tanzanian Shilling (TZS)",
    healthcareRank: "Limited specialised care; most complex cases travel abroad",
  },
  nigeria: {
    slug: "nigeria",
    name: "Nigeria",
    region: "West Africa",
    flag: "🇳🇬",
    overview:
      "Nigeria has Africa's largest population but its healthcare system struggles with infrastructure gaps, frequent strikes, and limited specialised services. Wealthy Nigerians and the growing middle class routinely travel abroad for medical care. India has become the preferred destination, with well-established medical tourism routes from Lagos and Abuja.",
    challenges: [
      "Frequent strikes by resident doctors disrupt healthcare delivery",
      "Limited availability of radiotherapy, transplant, and advanced cardiac services",
      "High cost of private healthcare relative to quality",
      "Medical infrastructure concentrated in Lagos and Abuja",
      "Concerns about medical equipment maintenance and reliability",
    ],
    whyIndia: [
      "Well-established Nigeria-India medical tourism corridor",
      "Large Nigerian diaspora community in India",
      "Direct flights from Lagos to Kochi (via Gulf hubs)",
      "Significant cost advantage — 70-80% less than UK/US alternatives",
      "Indian hospitals experienced in treating Nigerian patients",
      "Streamlined medical visa process for Nigerian citizens",
    ],
    treatments: ["cardiac", "orthopedics", "ivf", "cosmetic", "dental"],
    language: "English",
    currency: "Nigerian Naira (NGN)",
    healthcareRank: "Challenged by infrastructure gaps; many seek care abroad",
  },
  oman: {
    slug: "oman",
    name: "Oman",
    region: "GCC",
    flag: "🇴🇲",
    overview:
      "Oman offers free healthcare to its citizens, but specialised treatments often have waiting periods and limited availability. For complex procedures, many Omanis choose India, attracted by cultural familiarity, proximity, and cost savings of 70-80% compared to private care alternatives in the GCC.",
    challenges: [
      "Limited availability of super-specialty care within Oman",
      "Growing population puts pressure on healthcare system",
      "Local private healthcare is expensive",
      "Limited options for organ transplantation",
      "Specialised paediatric and cardiac services have waiting periods",
    ],
    whyIndia: [
      "3-hour direct flight from Muscat to Kochi",
      "Strong cultural and business ties between Oman and Kerala",
      "Visa-on-arrival for Omani citizens",
      "Arabic and Malayalam-speaking staff available",
      "Kerala's familiar cuisine and culture ease the transition",
      "Comprehensive packages including family accommodation",
    ],
    treatments: ["cardiac", "orthopedics", "ivf", "weight-loss"],
    language: "Arabic, English",
    currency: "Omani Rial (OMR)",
    healthcareRank: "Good basic care; specialised cases referred abroad",
  },
};

export const countryList = Object.values(countries);
