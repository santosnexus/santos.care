import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WHATSAPP_NUMBER = "+919995768668";
export const WHATSAPP_MESSAGE = "Hi! I'm interested in medical treatment in India.";
export const EMAIL = "contact@santos.care";
export const PHONE = "+91 999 576 8668";
export const ADDRESS = "Aluva, Kochi, Kerala, India";
export const COMPANY = "Santos King Tours & Travels Pvt. Ltd.";
export const OPS_HUB_URL = "https://ops.santos.care";

export function getWhatsAppUrl(message?: string) {
  const text = encodeURIComponent(message || WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
