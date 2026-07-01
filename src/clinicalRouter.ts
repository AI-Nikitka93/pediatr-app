export interface EmergencyTriageResult {
  level: "emergency";
  matchedSignals: Array<
    | "breathing_distress"
    | "blue_lips_or_skin"
    | "seizure"
    | "unresponsive"
    | "dehydration"
    | "chest_pain"
    | "severe_allergic_reaction"
    | "stiff_neck_light_sensitivity"
    | "purple_bruise_like_rash"
  >;
  reply: string;
}

export interface PediatricCareRouteResult {
  level: "emergency" | "urgent_same_day";
  matchedSignals: Array<
    | EmergencyTriageResult["matchedSignals"][number]
    | "infant_under_3_months_fever"
    | "fever_with_repeated_vomiting_or_diarrhea"
    | "fever_with_unexplained_rash"
  >;
  ageMonths?: number;
  reply: string;
}

export interface PediatricCareRouteRule {
  id: string;
  level: PediatricCareRouteResult["level"];
  sourceId: string;
}

export const PEDIATRIC_CARE_ROUTE_RULES: PediatricCareRouteRule[] = [
  {
    id: "emergency-red-flags",
    level: "emergency",
    sourceId: "aap-healthychildren-urgent-care-er-parent-guide",
  },
  {
    id: "infant-under-3-months-fever",
    level: "urgent_same_day",
    sourceId: "aap-healthychildren-fever-and-your-baby",
  },
  {
    id: "fever-with-repeated-vomiting-or-diarrhea",
    level: "urgent_same_day",
    sourceId: "aap-healthychildren-fever-when-to-call-pediatrician",
  },
  {
    id: "meningitis-like-fever-red-flags",
    level: "emergency",
    sourceId: "aap-healthychildren-urgent-care-er-parent-guide",
  },
  {
    id: "fever-with-unexplained-rash",
    level: "urgent_same_day",
    sourceId: "aap-healthychildren-fever-when-to-call-pediatrician",
  },
];

export function detectEmergencyTriage(text: string): EmergencyTriageResult | null {
  const normalizedText = text.toLocaleLowerCase("ru-RU");
  const matchedSignals = new Set<EmergencyTriageResult["matchedSignals"][number]>();

  if (/одыш|тяжело дыш|плохо дыш|не дыш|затрудненн\w* дых|часто дыш|втяжен\w* реб|ребра.*втяг|задых|shortness of breath|trouble breathing|difficulty breathing/i.test(normalizedText)) {
    matchedSignals.add("breathing_distress");
  }
  if (/син[а-яё]*\s+губ|губ[а-яё]*\s+син|сине[а-яё]*\s+лиц|посинел|blue lips|bluish|turning blue/i.test(normalizedText)) {
    matchedSignals.add("blue_lips_or_skin");
  }
  if (/судорог|seizure|convulsion/i.test(normalizedText)) {
    matchedSignals.add("seizure");
  }
  if (/не просып|невозможно разбуд|без созн|потерял созн|unresponsive|cannot wake|can't wake/i.test(normalizedText)) {
    matchedSignals.add("unresponsive");
  }
  if (/не мочил|не мочится|нет мочи|без мочи|8 час|восемь час|сух\w* рот|нет слез|no urine|dry mouth|no tears|dehydrat/i.test(normalizedText)) {
    matchedSignals.add("dehydration");
  }
  if (/боль\w* в груди|давлен\w* в груди|chest pain|chest pressure/i.test(normalizedText)) {
    matchedSignals.add("chest_pain");
  }
  if (/анафилак|отек квинке|от[её]к губ|от[её]к лица|крапивниц.*дыш|allergic reaction|hives.*breath/i.test(normalizedText)) {
    matchedSignals.add("severe_allergic_reaction");
  }
  if (
    /(ригидн[а-яё]* ше|ж[её]стк[а-яё]* ше|скованн[а-яё]* ше|stiff neck|neck stiffness)/i.test(normalizedText) &&
    /(светобоязн|больно смотреть на свет|чувствител[а-яё]* к свет|sensitivity to light|photophobia)/i.test(normalizedText)
  ) {
    matchedSignals.add("stiff_neck_light_sensitivity");
  }
  if (/(пурпурн[а-яё]* сып|фиолетов[а-яё]* сып|сып[а-яё\s-]*похож[а-яё]* на синяк|синяк[а-яё]* сып|non-?blanching rash|purple rash|bruise-like rash|petechiae)/i.test(normalizedText)) {
    matchedSignals.add("purple_bruise_like_rash");
  }

  if (matchedSignals.size === 0) return null;

  return {
    level: "emergency",
    matchedSignals: [...matchedSignals],
    reply:
      "Экстренная маршрутизация: по описанию есть признаки, при которых не ждите ответа ИИ и не ведите переписку. " +
      "Немедленно звоните 103 или 112 либо обращайтесь в ближайшее отделение неотложной помощи. " +
      "До приезда помощи: держите ребенка под наблюдением, не давайте еду/лекарства через силу, при нарушении дыхания или сознания следуйте указаниям диспетчера. " +
      "Этот ответ не заменяет очную экстренную медицинскую помощь.",
  };
}

function extractAgeMonths(text: string) {
  const normalizedText = text.toLocaleLowerCase("ru-RU").replace(",", ".");
  const weekMatch = normalizedText.match(/(\d+(?:\.\d+)?)\s*(?:недел|недель|недели|нед\.)/);
  if (weekMatch) {
    return Math.round(Number(weekMatch[1]) / 4.345);
  }

  const monthMatch = normalizedText.match(/(\d+(?:\.\d+)?)\s*(?:месяц|месяца|месяцев|мес\.)/);
  if (monthMatch) {
    return Math.floor(Number(monthMatch[1]));
  }

  const yearMatch = normalizedText.match(/(\d+(?:\.\d+)?)\s*(?:год|года|лет)/);
  if (yearMatch) {
    return Math.floor(Number(yearMatch[1]) * 12);
  }

  return undefined;
}

function hasFeverAtLeast38(text: string) {
  const normalizedText = text.toLocaleLowerCase("ru-RU").replace(",", ".");
  if (!/(температур|t\s*=|жар|лихорад|fever)/i.test(normalizedText)) return false;

  const temperatures = [...normalizedText.matchAll(/(?:^|[^\d])(\d{2,3}(?:\.\d)?)/gi)]
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));

  return temperatures.some((value) => (value >= 38 && value < 45) || value >= 100.4);
}

function hasRepeatedVomitingOrDiarrhea(text: string) {
  const normalizedText = text.toLocaleLowerCase("ru-RU");
  return /повторн\w* рвот|рвот\w*.*повтор|многократн\w* рвот|рвота.*диаре|диаре.*рвот|repeated vomiting|vomiting.*diarrhea|diarrhea.*vomiting/i.test(normalizedText);
}

function hasUnexplainedRash(text: string) {
  const normalizedText = text.toLocaleLowerCase("ru-RU");
  return /(непонятн\w* сып|необъясним\w* сып|сыпь|сып[а-яё]* на теле|rash|unexplained rash)/i.test(normalizedText);
}

export function detectPediatricCareRoute(text: string): PediatricCareRouteResult | null {
  const emergencyTriage = detectEmergencyTriage(text);
  if (emergencyTriage) {
    return emergencyTriage;
  }

  const ageMonths = extractAgeMonths(text);
  if (ageMonths !== undefined && ageMonths < 3 && hasFeverAtLeast38(text)) {
    return {
      level: "urgent_same_day",
      matchedSignals: ["infant_under_3_months_fever"],
      ageMonths,
      reply:
        "Срочная связь с педиатром: ребенку меньше 3 месяцев и указана температура 38.0°C или выше. " +
        "Свяжитесь с педиатром или дежурной медицинской службой сегодня, не откладывая. " +
        "До консультации не перегревайте ребенка, предлагайте кормление по возрасту и не давайте жаропонижающие без назначения врача. " +
        "Если появятся одышка, синие губы, вялость, судороги, отказ от питья или ухудшение состояния — переходите к экстренной помощи немедленно.",
    };
  }

  if (hasFeverAtLeast38(text) && hasRepeatedVomitingOrDiarrhea(text)) {
    return {
      level: "urgent_same_day",
      matchedSignals: ["fever_with_repeated_vomiting_or_diarrhea"],
      ageMonths,
      reply:
        "Срочная связь с педиатром: температура вместе с повторной рвотой или диареей требует связи с врачом сегодня. " +
        "Свяжитесь с педиатром или дежурной медицинской службой сегодня, не откладывая. " +
        "Пока ждете консультацию, предлагайте частое питье маленькими порциями и следите за мочеиспусканием, слезами, сухостью во рту и общей активностью. " +
        "Если ребенок становится вялым, не пьет, редко мочится, появляется кровь, сильная боль или ухудшение — переходите к неотложной помощи.",
    };
  }

  if (hasFeverAtLeast38(text) && hasUnexplainedRash(text)) {
    return {
      level: "urgent_same_day",
      matchedSignals: ["fever_with_unexplained_rash"],
      ageMonths,
      reply:
        "Срочная связь с педиатром: температура вместе с новой или непонятной сыпью требует связи с врачом сегодня. " +
        "Свяжитесь с педиатром или дежурной медицинской службой сегодня, особенно если сыпь быстро распространяется или ребенок выглядит больным. " +
        "Не наносите сильные препараты без назначения и, если возможно, подготовьте фото сыпи для врача. " +
        "Если сыпь становится фиолетовой, похожей на синяки, ребенок трудно дышит, не просыпается, жалуется на жесткую шею или светобоязнь — переходите к экстренной помощи немедленно.",
    };
  }

  return null;
}
