import { API, ApiErrorCodes } from "./api";
import { Logger } from "./logger";

type ContestState = "pending" | "disputed" | "ongoing" | "completed";
export interface IContestCategory {
  id: number;
  name: string;
  description: string;
  hasChildren: boolean;
  parentId?: number | null;
}

export interface ITrendingCategory {
  id: number;
  name: string;
  description: string;
  contests: number;
  users: number;
}

export interface IContest {
  id: number;
  description: string;
  timeStamp: string;
  ownerId: number;
  isOpen: boolean;
  isOffline: boolean;
  stake: number;
  state: ContestState;
  winnerId: number | null;
  fee: number | null;
  category: {
    id: number;
    name: string;
    description: string;
    parentCategoryId: number;
  };
  owner: {
    id: number;
    fullName: string;
    country: string;
    tag: string;
    bio: string | null;
    isOnline: boolean;
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
  };
  opponent: {
    id: number;
    fullName: string;
    country: string;
    tag: string;
    bio: string | null;
    isOnline: boolean;
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
  } | null;
}

export interface ICreateContestPayload {
  stake: number;
  description: string;
  categoryId: number;
  opponentId: number | null;
  isOpen: boolean;
  isOffline: boolean;
}

export class Contest {
  static getCategories = (parentId?: number | null) => {
    const url = parentId
      ? `/contests/categories?parentId=${parentId}`
      : `/contests/categories`;

    return API.GET(url)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as IContestCategory[];
        }
        return [] as IContestCategory[];
      })
      .catch((err) => {
        Logger.error(err);
        return [] as IContestCategory[];
      });
  };

  static getTrendingCategories = () => {
    return API.GET(`/contests/trending-categories`)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as ITrendingCategory[];
        }
        return [] as ITrendingCategory[];
      })
      .catch((err) => {
        Logger.error(err);
        return [] as ITrendingCategory[];
      });
  };

  static getMyContests = (page?: number | null) => {
    const url = page ? `/contests/me?page=${page}` : `/contests/me`;

    return API.GET(url)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as IContest[];
        }
        return [] as IContest[];
      })
      .catch((err) => {
        Logger.error(err);
        return [] as IContest[];
      });
  };

  static getOpenContests = (
    page?: number | null,
    categoryId?: number | null
  ) => {
    const query = `?${page && `&page=${page}`}${
      categoryId ? `&categoryId=${categoryId}` : ""
    }`;
    const url = `/contests/open${query}`;

    return API.GET(url)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as IContest[];
        }
        return [] as IContest[];
      })
      .catch((err) => {
        Logger.error(err);
        return [] as IContest[];
      });
  };

  static getHighestStakeContests = (categoryId?: number | null) => {
    const query = categoryId ? `&categoryId=${categoryId}` : "";
    const url = `/contests/highest-stakes${query}`;

    return API.GET(url)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as IContest[];
        }
        return [] as IContest[];
      })
      .catch((err) => {
        Logger.error(err);
        return [] as IContest[];
      });
  };

  static createContest = (payload: ICreateContestPayload) => {
    try {
      return API.POST("/contests/create", payload)
        .then(async (response) => {
          let reply: {
            success: boolean;
            error: string;
            data: IContest | null;
          } = {
            success: false,
            error: "",
            data: null,
          };

          if (response.success && response.data) {
            reply.success = true;
            reply.data = response.data as IContest;
            return reply;
          }

          // handle different codes
          const errorCode = response.errorCode;
          if (errorCode === ApiErrorCodes.NotAllowed) {
            reply.error =
              "Failed to charge wallet, check balance then try again";
          } else {
            reply.error = "Something went wrong, please try again";
          }
        })
        .catch((err) => {
          Logger.error(err);
          return {
            success: false,
            error: "Something went wrong, please try again.",
            data: null,
          };
        });
    } catch (e) {
      Logger.error(e);
      return {
        success: false,
        error: "Something went wrong, please try again.",
        data: null,
      };
    }
  };

  static getContest = (contestId: number) => {
    const url = `/contests/single/${contestId}`;
    return API.GET(url)
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as IContest;
        }

        return null;
      })
      .catch((err) => {
        Logger.error(err);
        return null;
      });
  };

  static deleteContest = (contestId: number) => {
    const url = `/contests/delete/${contestId}`;
    return API.DELETE(url)
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as boolean;
        }
        return false;
      })
      .catch((err) => {
        Logger.error(err);
        return false;
      });
  };

  static joinContest = (contestId: number) => {
    const url = `/contests/join/${contestId}`;
    return API.POST(url, {})
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as boolean;
        }
        return false;
      })
      .catch((err) => {
        Logger.error(err);
        return false;
      });
  };

  static disputeContest = (contestId: number) => {
    const url = `/contests/dispute/${contestId}`;
    return API.POST(url, {})
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as boolean;
        }
        return false;
      })
      .catch((err) => {
        Logger.error(err);
        return false;
      });
  };

  static selectContestWinner = (contestId: number, winnerId: number) => {
    const url = `/contests/resolve/${contestId}/${winnerId}`;
    return API.POST(url, {})
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data
        }
        return null;
      })
      .catch((err) => {
        Logger.error(err);
        return null;
      });
  };
}
