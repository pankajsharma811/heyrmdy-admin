export function formatEnum(value: string) {
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const startText = start.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
  const endText = end.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startText} – ${endText}`;
}

const POSITIVE_MOODS = ["GOOD", "GREAT", "EASY"];
const NEGATIVE_MOODS = ["ROUGH", "BAD", "LOW", "HARD", "DIFFICULT"];

export function moodTone(mood: string) {
  if (POSITIVE_MOODS.includes(mood)) return "bg-[#2F5D56]/10 text-[#2F5D56]";
  if (NEGATIVE_MOODS.includes(mood)) return "bg-[#FBEAE6] text-[#A23B2A]";
  return "bg-[#EFEBE2] text-[#7A756A]";
}

export function intensityTone(intensity: string) {
  switch (intensity) {
    case "MILD":
      return "bg-[#2F5D56]/10 text-[#2F5D56]";
    case "MODERATE":
      return "bg-[#F3E6C8] text-[#8A6A1F]";
    case "INTENSE":
      return "bg-[#F6DCC4] text-[#9A5418]";
    case "OVERWHELMING":
    case "SEVERE":
      return "bg-[#FBEAE6] text-[#A23B2A]";
    default:
      return "bg-[#EFEBE2] text-[#7A756A]";
  }
}

export function channelTypeTone(type: string) {
  switch (type) {
    case "POPULAR":
      return "bg-[#F6DCC4] text-[#9A5418]";
    case "RECOMMENDED":
      return "bg-[#2F5D56]/10 text-[#2F5D56]";
    default:
      return "bg-[#EFEBE2] text-[#7A756A]";
  }
}