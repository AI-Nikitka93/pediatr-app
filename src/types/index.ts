export interface AppUser {
  id: string;
  type: "private" | "company";
  email: string;
  name: string;
  phone: string;
  childName?: string;
  childGender?: "boy" | "girl";
  childBirthdate?: string;
  inn?: string;
  address?: string;
  contactPerson?: string;
  role?: "partner_clinic" | "corporate_customer";
}

export interface CorporateChild {
  id: string;
  name: string;
  gender: "boy" | "girl";
  birthdate: string;
  ageInMonths: number;
  clinicId: string;
  corporatePlan: "Базовый Детский" | "Бизнес Премиум" | "VIP Развитие";
  lastCheckupDate?: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  exp: string;
  active: boolean;
  slots: string[];
  detail?: string;
  avatar?: string;
  isImage?: boolean;
}

export interface ChildProfile {
  name: string;
  gender: "boy" | "girl";
  birthdate: string;
}

export interface GrowthRecord {
  id: string;
  date: string;
  ageInMonths: number;
  weight: number;
  height: number;
}

export interface SicknessRecord {
  id: string;
  date: string;
  symptoms: string;
  doctorNotes: string;
  status: "Вылечен" | "Активно" | "Наблюдение";
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorRole: string;
  date: string;
  time: string;
  symptom: string;
  childName: string;
  type: "online" | "offline";
  status: "Ожидает" | "Завершен";
}

export interface Message {
  role: "user" | "assistant";
  text: string;
  emergencyTriage?: {
    level: "emergency";
    matchedSignals: string[];
  };
  careRoute?: {
    level: "emergency" | "urgent_same_day";
    matchedSignals: string[];
    ageMonths?: number;
  };
}

export interface VaccineGuide {
  id: string;
  ageInMonths: number;
  ageLabel: string;
  name: string;
  diseases: string;
  description: string;
  isCustomMandatory?: boolean;
  dosage: string;
  contraindications: string;
}
