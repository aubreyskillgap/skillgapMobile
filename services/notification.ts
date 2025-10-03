import { API } from "./api";
import { IContest } from "./contest";
import { Logger } from "./logger";
import { ITransaction } from "./transaction";
export type NotificationType =
  | "contestrequest"
  | "contestwon"
  | "contestlost"
  | "conteststarted"
  | "contestdispute"
  | "transactiondeposit"
  | "transactionwithdraw"
  | "transactionwithdrawfailed";
export interface INotification {
  id: 1;
  type: NotificationType;

  contestId: number;
  transactionId: number;
  contest: IContest | null;
  disputeHandlerId: number;
  disputeHandler: string;
  transaction: ITransaction | null;
}

export class NotificationService {
  static getNotification = (page: number) => {
    return API.GET(`/notifications?page=${page}`)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as INotification[];
        }
        return [] as INotification[];
      })
      .catch((e) => {
        Logger.error(e);
        return [] as INotification[];
      });
  };

  static deleteNotification = (id: number) => {
    return API.DELETE(`/notifications/${id}`)
      .then(async (response) => {
        if (response.success) {
          Logger.info("Notification deleted");
          return;
        }
        return;
      })
      .catch((e) => {
        Logger.error(e);
        return;
      });
  };
}
