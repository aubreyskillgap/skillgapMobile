import { CountryCode } from "react-native-country-picker-modal";

export interface UserResponse {
  success: boolean;
  data: UserData;
}

export interface UserData {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  country: CountryCode;
  imageUri: string | null;
  backgroundUri: string | null;
  tag: string;
  bio: string | null;
  hasTxnPin: boolean;
  canChangeTag: boolean;
  socials: Socials;
  stats: Stats;
  preferences: Preferences;
}

interface Socials {
  twitter: string | null;
  facebook: string | null;
  tikTok: string | null;
  youtube: string | null;
}

interface Stats {
  contests: number;
  wins: number;
  losses: number;
  disputes: number;
}

interface Preferences {
  openToContest: boolean;
  darkMode: boolean;
}

export interface IProfile {
  firstName: string;
  lastName: string;
  bio: string;
  tag: string;
  twitter: string;
  facebook: string;
  youtube: string;
  tikTok: string;
  profileImageUrl: string;
  coverImageUrl: string;
}

export interface IUploadToken {
  accountUrl: string;
  mediaContainerName: string;
  mediaContainerToken: string;
}
