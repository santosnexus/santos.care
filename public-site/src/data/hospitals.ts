export interface Hospital {
  name: string;
  slug: string;
  location: string;
  accreditation: string;
  specialties: string[];
  beds: number;
  description: string;
}

export const hospitals: Hospital[] = [
  {
    name: "Aster Medcity",
    slug: "aster-medcity",
    location: "Kochi, Kerala",
    accreditation: "JCI, NABH",
    specialties: ["cardiac", "oncology", "neurology", "orthopedics"],
    beds: 670,
    description:
      "A quaternary care hospital and one of the largest in Kerala, with JCI accreditation and advanced centres for cardiac sciences, oncology, neurosciences, and organ transplantation.",
  },
  {
    name: "Amrita Institute of Medical Sciences",
    slug: "amrita",
    location: "Kochi, Kerala",
    accreditation: "JCI, NABH",
    specialties: ["cardiac", "oncology", "neurology", "orthopedics", "ivf"],
    beds: 1350,
    description:
      "A multi-super-specialty hospital ranked among India's top medical institutions, with JCI accreditation and comprehensive care across all major specialties.",
  },
  {
    name: "Sunrise Hospital",
    slug: "sunrise-hospital",
    location: "Kochi, Kerala",
    accreditation: "NABH",
    specialties: ["cardiac", "orthopedics", "neurology"],
    beds: 350,
    description:
      "A leading cardiac care centre in Kerala, known for advanced cardiology and cardiothoracic surgery with high-volume procedures and excellent outcomes.",
  },
  {
    name: "Medical Trust Hospital",
    slug: "medical-trust",
    location: "Kochi, Kerala",
    accreditation: "NABH",
    specialties: ["cardiac", "orthopedics", "neurology"],
    beds: 400,
    description:
      "A well-established multi-specialty hospital with strong cardiac and orthopaedic programmes and a dedicated international patient department.",
  },
  {
    name: "Ayush Prana Ayurveda",
    slug: "ayush-prana",
    location: "Kumarakom, Kerala",
    accreditation: "ISO, Kerala Tourism",
    specialties: ["ayurveda"],
    beds: 50,
    description:
      "Premium Ayurveda wellness and recovery retreat on the banks of Vembanad Lake, specialising in post-surgical recovery, chronic disease management, and holistic wellness.",
  },
];
