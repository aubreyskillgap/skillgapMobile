export const emailValidation = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const normalizedEmail = email.trim().toLowerCase();
  return emailPattern.test(normalizedEmail);
};
export const validatePhoneNumber = (phoneNumber: string) => {
  const phoneNumberRegex = /^[\d+()]+$/;
  return phoneNumberRegex.test(phoneNumber);
};

export const passwordValidation = (password: string) => {
  return password.length >= 8;
};

export const passwordExactness = (
  newPassword: string,
  confirmNewPassword: string
) => {
  if (newPassword === confirmNewPassword) {
    return true;
  } else {
    return false;
  }
};
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const useDebounce = (callback: any, delay: any) => {
  let timeout: any;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
};

export const validTwitterUrl = (url: string) => {
  const regex =
    /^(?:\s*|https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\s*)$/;
  return regex.test(url);
};

export const validTiktokUrl = (url: string) => {
  const regex =
    /^(?:\s*|https?:\/\/(?:www\.)?tiktok\.com\/@?[A-Za-z0-9_.]{1,24}\s*)$/;
  return regex.test(url);
};
export const validInstagramUrl = (url: string) => {
  const regex =
    /^(?:\s*|https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\s*)$/;
  return regex.test(url);
};
export const validYoutubeUrl = (url: string) => {
  const regex =
    /^(?:\s*|https?:\/\/(?:www\.)?youtube\.com\/(?:c|channel|user)\/[A-Za-z0-9_-]{1,64}\s*)$/;
  return regex.test(url);
};

export function formatNumber(num: number): string {
  const format = (value: number, divisor: number, suffix: string) => {
    const floored = Math.floor((value / divisor) * 100) / 100; // floor to 2 decimal places
    return floored.toString().replace(/\.?0+$/, "") + suffix; // remove trailing .0 or .00
  };

  if (num >= 1_000_000_000) return format(num, 1_000_000_000, "B");
  if (num >= 1_000_000) return format(num, 1_000_000, "M");
  if (num >= 1_000) return format(num, 1_000, "k");

  return num.toString();
}

export function timeAgo(isoTimestamp: string): string {
  const now = new Date();
  const past = new Date(isoTimestamp); // keep it as Date, not string!
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years !== 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months !== 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
}

export const validateCreateContestForm = (
  categoryId: number | null,
  stake: number,
  description: string,
  isChallengeOpen: boolean,
  minStake: number,
  isTagValid: boolean,
  tag?: string
): string | null => {
  if (tag === "" && !isChallengeOpen) return "Please select an opponent.";
  if (!categoryId) return "Please select a category.";
  if (stake < minStake) return `Minimum stake amount must be ${minStake}`;
  if (description.trim() === "") return "Description cannot be empty.";
  if (isTagValid && !isChallengeOpen)
    return "Skilgap user with tag doesn't exit";

  return null;
};

type SignedAmount = {
  sign: "+" | "-";
  amount: string;
};

export function getSignedAmount(value: number): SignedAmount {
  const sign = value < 0 ? "-" : "+";
  const amount = Math.abs(value).toLocaleString();
  return { sign, amount };
}
