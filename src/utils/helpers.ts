import { GrowthRecord } from "../types";
import { WHO_MEDIANS_BOY, WHO_MEDIANS_GIRL } from "../data/constants";

export const generateDefaultGrowthLogs = (birthdateStr: string, gender: "boy" | "girl"): GrowthRecord[] => {
  const birthdate = new Date(birthdateStr);
  const diffTime = Math.abs(new Date().getTime() - birthdate.getTime());
  const currentAgeMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));

  const milestones = [
    { m: 0, wBoy: 3.3, hBoy: 50, wGirl: 3.2, hGirl: 49 },
    { m: 1, wBoy: 4.5, hBoy: 54, wGirl: 4.2, hGirl: 53 },
    { m: 2, wBoy: 5.6, hBoy: 58, wGirl: 5.1, hGirl: 57 },
    { m: 3, wBoy: 6.4, hBoy: 61, wGirl: 5.8, hGirl: 60 },
    { m: 4, wBoy: 7.0, hBoy: 64, wGirl: 6.4, hGirl: 62 },
    { m: 6, wBoy: 7.9, hBoy: 67, wGirl: 7.3, hGirl: 66 },
    { m: 9, wBoy: 8.9, hBoy: 72, wGirl: 8.2, hGirl: 70 },
    { m: 12, wBoy: 9.6, hBoy: 76, wGirl: 8.9, hGirl: 74 },
    { m: 18, wBoy: 11.5, hBoy: 82, wGirl: 10.8, hGirl: 80 },
    { m: 24, wBoy: 12.2, hBoy: 87, wGirl: 11.5, hGirl: 86 },
    { m: 36, wBoy: 14.3, hBoy: 96, wGirl: 13.9, hGirl: 95 },
  ];

  const logs: GrowthRecord[] = [];
  milestones.forEach((milestone) => {
    if (milestone.m <= currentAgeMonths) {
      const milestoneDate = new Date(birthdate);
      milestoneDate.setMonth(birthdate.getMonth() + milestone.m);

      if (milestoneDate.getTime() <= new Date().getTime()) {
        logs.push({
          id: `g_default_${milestone.m}`,
          date: milestoneDate.toISOString().split("T")[0],
          ageInMonths: milestone.m,
          weight: gender === "boy" ? milestone.wBoy : milestone.wGirl,
          height: gender === "boy" ? milestone.hBoy : milestone.hGirl,
        });
      }
    }
  });

  return logs;
};

export const getWhoMedianForAge = (age: number, gender: "boy" | "girl", metric: "weight" | "height"): number => {
  const dataset = gender === "boy" ? WHO_MEDIANS_BOY : WHO_MEDIANS_GIRL;
  const exact = dataset.find(d => d.age === age);
  if (exact) return metric === "weight" ? exact.weight : exact.height;

  let lower = dataset[0];
  let upper = dataset[dataset.length - 1];

  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i].age <= age) {
      lower = dataset[i];
    }
    if (dataset[i].age >= age) {
      upper = dataset[i];
      break;
    }
  }

  if (lower.age === upper.age) {
    return metric === "weight" ? lower.weight : lower.height;
  }

  const ratio = (age - lower.age) / (upper.age - lower.age);
  const valLower = metric === "weight" ? lower.weight : lower.height;
  const valUpper = metric === "weight" ? upper.weight : upper.height;

  return parseFloat((valLower + ratio * (valUpper - valLower)).toFixed(1));
};

export const readStoredJson = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};
