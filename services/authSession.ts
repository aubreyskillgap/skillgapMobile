import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, ApiErrorCodes } from "./api";
import { Logger } from "./logger";
import { Router } from "./router";

const TOKENS_KEY = "skill_gap_tokens_key";

interface ITokens {
  AccessToken: string | null;
  RefreshToken: string | null;
}

interface IAccountRecovery {
  email: string | null;
  code: string | null;
}

const tokens: ITokens = {
  AccessToken: null,
  RefreshToken: null,
};

export const recovery: IAccountRecovery = {
  email: null,
  code: null,
};

export class AuthSession {
  static isAuthenticated = async (): Promise<boolean> => {
    if (!tokens) return false;
    return tokens.AccessToken !== null;
  };

  static loadState = async () => {
    try {
      const value = await AsyncStorage.getItem(TOKENS_KEY);
      if (!value) {
        Logger.info(TOKENS_KEY, "not found");
        return;
      }

      const storedTokens = JSON.parse(value);
      if (
        !storedTokens ||
        !storedTokens.AccessToken ||
        !storedTokens.RefreshToken
      ) {
        Logger.info("failed to parse storedTokens", storedTokens);
        return;
      }

      tokens.AccessToken = storedTokens.AccessToken;
      tokens.RefreshToken = storedTokens.RefreshToken;
    } catch (e) {
      Logger.error(e);
    }
  };

  static login = (email: string, password: string) => {
    try {
      return API.POST("/identity/login", {
        email: email,
        password: password,
      })
        .then(async (response) => {
          if (response.success) {
            tokens.AccessToken = response.data.accessToken;
            tokens.RefreshToken = response.data.refreshToken;

            await AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

            return true;
          }
        })
        .catch((err) => {
          Logger.error(err);
          return false;
        });
    } catch (e) {
      Logger.error(e);
      return false;
    }
  };

  static signup = (
    email: string,
    name: string,
    password: string,
    darkMode: boolean
  ) => {
    try {
      return API.POST("/identity/register", {
        email: email,
        fullName: name,
        country: "NGN",
        password: password,
        darkMode: darkMode,
      })
        .then(async (response) => {
          const reply = { success: false, error: "" };

          if (response.success) {
            reply.success = true;
            return reply;
          }

          // handle different codes
          const errorCode = response.errorCode;
          if (errorCode === ApiErrorCodes.NotAllowed) {
            reply.error = "Email address already used, please login.";
          }

          return reply;
        })
        .catch((err) => {
          Logger.error(err);
          return {
            success: false,
            error: "Something went wrong, please try again.",
          };
        });
    } catch (err) {
      Logger.error(err);
      return {
        success: false,
        error: "Something went wrong, please try again.",
      };
    }
  };

  static verifyEmail = (code: string) => {
    try {
      return API.POST("/identity/verifyEmail", {
        code: code,
      }).then(async (response) => {
        return response.success;
      });
    } catch (err) {
      Logger.error(err);
      return false;
    }
  };

  static sendVerifyCode = () => {
    try {
      return API.GET("/identity/sendVerifyCode");
    } catch (err) {
      Logger.error(err);
    }
  };

  static sendPasswordResetCode = (email: string) => {
    try {
      recovery.email = email;

      return API.POST("/identity/passwordResetCode", {
        email: email,
      })
        .then(async (response) => {
          return response.success;
        })
        .catch((err) => {
          Logger.error(err);
          return false;
        });
    } catch (err) {
      Logger.error(err);
    }
  };

  static validatePasswordResetCode = (code: string) => {
    try {
      recovery.code = code;

      return API.POST("/identity/passwordResetValidate", {
        email: recovery.email,
        code: code,
      })
        .then(async (response) => {
          return response;
        })
        .catch((err) => {
          Logger.error(err);
          return false;
        });
    } catch (err) {
      Logger.error(err);
      return false;
    }
  };

  static resetPassword = (password: string) => {
    try {
      return API.POST("/identity/passwordReset", {
        email: recovery.email,
        code: recovery.code,
        password: password,
      })
        .then(async (response) => {
          return response.success;
        })
        .catch((err) => {
          Logger.error(err);
          return false;
        });
    } catch (err) {
      Logger.error(err);
      return false;
    }
  };

  static logout = async () => {
    tokens.AccessToken = null;
    tokens.RefreshToken = null;

    try {
      await AsyncStorage.removeItem(TOKENS_KEY);
    } catch (e) {
      Logger.error(e);
    }

    Router.push("/auth/auth-home");
  };

  static accessToken = () => tokens.AccessToken;
}
