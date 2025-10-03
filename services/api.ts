import { AuthSession } from "./authSession";
import { Logger } from "./logger";

const ApiBaseUrl = "https://api.skillgap.co/api";

export class ApiErrorCodes {
  static ServerError = "server_error";
  static UnAuthorized = "unauthorized";
  static BadPayload = "bad_payload";
  static ValidationError = "validation_error";
  static RecordNotFound = "record_not_found";
  static NotAllowed = "not_allowed";
  static RetryRequest = "retry_request";
}

export class API {
  static GET = async (path: string) => {
    const url = ApiBaseUrl + path;
    return fetchWithRetry(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + AuthSession.accessToken(),
      },
    })
      .then(async (response) => {
        return await response.json();
      })
      .catch((err) => {
        Logger.error(err);
        return null;
      });
  };

  static POST = async (path: string, body?: any) => {
    const url = ApiBaseUrl + path;
    return fetchWithRetry(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AuthSession.accessToken(),
        "content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    })
      .then(async (response) => {
        const json = await response.json();
        return json;
      })
      .catch((err) => {
        Logger.error(err);
        return new Promise<any>((resolve, reject) => reject(err));
      });
  };

  static PostFormData = async (path: string, form: FormData) => {
    const url = ApiBaseUrl + path;
    return fetchWithRetry(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AuthSession.accessToken(),
      },
      body: form,
    })
      .then(async (response) => {
        return await response.json();
      })
      .catch((err) => {
        Logger.error(err);
        return new Promise<any>((resolve, reject) => reject(err));
      });
  };

  static DELETE = async (path: string) => {
    const url = ApiBaseUrl + path;
    return fetchWithRetry(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + AuthSession.accessToken(),
      },
    })
      .then(async (response) => {
        return await response.json();
      })
      .catch((err) => {
        Logger.error(err);
        return null;
      });
  };
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  delayMs: number = 500
): Promise<Response> {
  let lastError: any;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      Logger.info(url, options);

      const response = await fetch(url, options);

      Logger.info(response);
      if (response.status === 401) {
        AuthSession.logout();
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      return response;
    } catch (err) {
      lastError = err;

      Logger.error(err);
      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw lastError;
      }
    }
  }

  throw lastError;
}
