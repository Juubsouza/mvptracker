export const transformMVPName = (name: string) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const ragnarokAPITimeToHours = (time: string) => {
  const parts = time.split("_");
  const hours = parts[1];
  return `${hours} hour${hours === "1" ? "" : "s"}`;
};

export const ragnarokAPITimeToHourNumber = (time: string) => {
  const parts = time.split("_");
  return Number(parts[1]);
};

export const fromISOStringToHHMM = (date: string) => {
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};
