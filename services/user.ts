import { getMimeType } from "@/utitlity/image";
import { create } from "zustand";
import { API, ApiErrorCodes } from "./api";
import { Logger } from "./logger";

export interface IUserRecord {
  id: number;
  email: string;
  fullName: string;
  country: string;
  tag: string;
  bio: string | null;
  balance: number;
  isVerified: boolean;
  isOnline: boolean;
  canChangeTag: boolean;
  notification: boolean;
  socials: {
    twitter: string | null;
    instagram: string | null;
    tikTok: string | null;
    youtube: string | null;
  };
  stats: {
    contests: number;
    wins: number;
    losses: number;
    disputes: number;
  };
  preferences: {
    openToContest: boolean;
    darkMode: boolean;
  };
}

export interface IOtherUserRecord {
  id: number;
  fullName: string;
  country: string;
  tag: string;
  bio: string;
  isOnline: true;
  socials: {
    twitter: string;
    instagram: string;
    tikTok: string;
    youtube: string;
  };
  stats: {
    contests: number;
    wins: number;
    losses: number;
    disputes: number;
  };
}

interface IPreferences {
  openToChallenge: boolean;
  darkMode: boolean;
}

export let SessionUser: IUserRecord | null;

let loadingUser = false;

export const useSessionStore = create((set) => ({
  user: null as IUserRecord | null,
  setUser: (u: IUserRecord | null) => set({ user: u }),
}));

export class User {
  static Load = (onLoaded?: () => void) => {
    if (loadingUser) return;

    try {
      loadingUser = true;
      return API.GET("/identity/me")
        .then(async (response) => {
          if (!response.success) {
            return false;
          }
          SessionUser = response.data;
          Logger.info(SessionUser);

          onLoaded?.();
        })
        .catch((err) => {
          Logger.error(err);
          return false;
        });
    } catch (err) {
      Logger.error(err);
      return false;
    } finally {
      loadingUser = false;
    }
  };

  static clear = () => {
    SessionUser = null;
  };

  static update = (user: any) => {
    try {
      return API.POST("/identity/me", {
        fullName: user.fullName,
        bio: user.bio,
        tag: user.tag,
        twitter: user.twitter,
        instagram: user.instagram,
        youtube: user.youtube,
        tikTok: user.tikTok,
      })
        .then(async (response) => {
          const reply = { success: false, error: "" };

          if (response.success && SessionUser) {
            SessionUser.fullName = user.fullName;
            SessionUser.bio = user.bio;
            SessionUser.tag = user.tag;
            SessionUser.socials.twitter = user.twitter;
            SessionUser.socials.instagram = user.instagram;
            SessionUser.socials.instagram = user.instagram;
            SessionUser.socials.youtube = user.youtube;

            reply.success = true;
            return reply;
          }

          // handle different codes
          reply.error = "Something went wrong, please try that again.";
          const errorCode = response.errorCode;

          if (errorCode === ApiErrorCodes.NotAllowed) {
            reply.error = "User tag already used.";
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

  static updatePreferences = (openToContest: boolean, darkMode: boolean) => {
    if (SessionUser) {
      SessionUser.preferences.openToContest = openToContest;
      SessionUser.preferences.darkMode = darkMode;
    }

    return API.POST("/identity/preferences", {
      openToContest: openToContest,
      darkMode: darkMode,
    })
      .then(async (response) => {
        return response.success;
      })
      .catch((e) => {
        Logger.error(e);
        return false;
      });
  };

  static getUserByTag = (tag: string) => {
    return API.GET(`/profile/tag/${tag}`)
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as IOtherUserRecord;
        }
        return null;
      })
      .catch((e) => {
        Logger.error(e);
        return null;
      });
  };

  static tagAvailable = (tag: string) => {
    return API.GET(`/identity/tag-available?tag=${tag}`)
      .then(async (response) => {
        return response.data;
      })
      .catch((e) => {
        Logger.error(e);
        return false;
      });
  };

  static blockUser = (userId: number) => {
    return API.POST(`/profile/block/${userId}`)
      .then(async (response) => {
        if (!response.success) {
          Logger.info("error from this end ");

          return false;
        }
        return response.errorCode;
      })
      .catch((e) => {
        Logger.error(e);
        return;
      });
  };

  static fireOnlineSignal = () => {
    return API.POST("/identity/online")
      .then(async (response) => {
        if (!response.success) {
          Logger.info("error from this this end");
          return false;
        }
        return response.data;
      })
      .catch((e) => {
        Logger.error(e);
        return;
      });
  };

  static uploadProfileImage = (file: any) => {
    const uri = file.uri;
    const name = uri.split("/").pop();
    const type = getMimeType(uri);

    const formData = new FormData();
    formData.append("file", {
      uri,
      name,
      type,
    } as any);

    return API.PostFormData("/identity/profileImage", formData)
      .then(async (response) => {
        return response?.success ?? false;
      })
      .catch((err) => {
        Logger.error(err);
        return false;
      });
  };

  static uploadCoverImage = (file: any) => {
    const uri = file.uri;
    const name = uri.split("/").pop();
    const type = getMimeType(uri);

    const formData = new FormData();
    formData.append("file", {
      uri,
      name,
      type,
    } as any);

    return API.PostFormData("/identity/coverImage", formData)
      .then(async (response) => {
        return response?.success ?? false;
      })
      .catch((err) => {
        Logger.error(err);
        return false;
      });
  };
}
