export interface IAuthResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  not_before: number;
  expires_in: number;
  expires_on: number;
  resource: string;
  id_token_expires_in: string;
  profile_info: string;
  scope: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  timer: number | null;
}

export interface IUserDetail {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  darkMode: boolean;
}

export interface IPIn {
  pin: string;
}
