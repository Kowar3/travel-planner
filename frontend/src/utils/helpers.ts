import { jwtDecode, type JwtPayload } from "jwt-decode";

export const validateName = (name: string): string => {
  if (name.length === 0) return "";
  if (name.length < 2) return "Too short (min 2)";
  if (name.length > 50) return "Too long (max 50)";
  const nameRegex = /^[A-ZŠĐČĆŽ][a-zšđčćž]*$/;
  if (!nameRegex.test(name)) return "Use Aa format";
  return "";
};

export const validateEmail = (email: string): string => {
  if (email.length === 0) return "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address";
  return "";
};

export const validatePassword = (password: string): string => {
  if (password.length === 0) return "";
  if (password.length < 8) return "Min 8 characters";
  if (password.length > 30) return "Max 30 characters";
  const passwordRegex = /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/;
  if (!passwordRegex.test(password)) return "Letter, number & symbol required";
  return "";
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("sr-RS");
};

export const cleanObject = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === "" || newObj[key] === null) delete newObj[key];
  });
  return newObj;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const formatDateYearMonth = (dateString?: string) => {
  if (!dateString) return "Unknown!";
  return new Date(dateString).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export const calculateDuration = (start: string, end: string) => {
  const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

export const toLatin = (text: string): string => {
  const cyrillic: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    ђ: "đ",
    е: "e",
    ж: "ž",
    з: "z",
    и: "i",
    ј: "j",
    к: "k",
    л: "l",
    љ: "lj",
    м: "m",
    н: "n",
    њ: "nj",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    ћ: "ć",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "č",
    џ: "dž",
    ш: "š",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Ђ: "Đ",
    Е: "E",
    Ж: "Ž",
    З: "Z",
    И: "I",
    Ј: "J",
    К: "K",
    Л: "L",
    Љ: "Lj",
    М: "M",
    Н: "N",
    Њ: "Nj",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    Ћ: "Ć",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "Č",
    Џ: "Dž",
    Ш: "Š",
  };
  return text
    .split("")
    .map((c) => cyrillic[c] || c)
    .join("");
};

export const calculateDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0;
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
};

export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getDistanceFromLine = (
  pLat: number,
  pLng: number,
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
) => {
  const distA = getDistance(pLat, pLng, aLat, aLng);
  const distB = getDistance(pLat, pLng, bLat, bLng);
  const d2 = (aLat - bLat) ** 2 + (aLng - bLng) ** 2;
  if (d2 === 0) return distA;
  const t =
    ((pLat - aLat) * (bLat - aLat) + (pLng - aLng) * (bLng - aLng)) / d2;
  if (t < 0) return distA;
  if (t > 1) return distB;
  return getDistance(
    pLat,
    pLng,
    aLat + t * (bLat - aLat),
    aLng + t * (bLng - aLng),
  );
};
