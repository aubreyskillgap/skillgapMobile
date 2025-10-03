import {
  Currency,
  PaymentChannels,
} from "react-native-paystack-webview/production/lib/types";
import { API } from "./api";
import { Logger } from "./logger";

export type TransactionType = "contest" | "deposit" | "withdrawal";
type TransactionState = "pending" | "successful" | "failed";
type TransactionInitiator = "user" | "system";

export interface ITransaction {
  id: number;
  amount: number;
  initiator: TransactionInitiator;
  failureReason?: string | null;
  timeStamp: string;
  state: TransactionState;
  type: TransactionType;
  paymentReference?: string | null;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface ITransactionInfo {
  minAmount: number;
  publicKey: string;
  currency: Currency;
  channels: PaymentChannels;
  minStake: number;
  minDepositAmount: number;
  maxWithdrawalAmount: number;
  minWithdrawalAmount: number;
}

export interface IBank {
  name: string;
  slug: string;
  code: string;
  id: number;
}

export interface IAccountResolve {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankId: number;
  amount: number;
}

export class Transaction {
  static resolveAccount = (
    amount: number,
    bankId: number,
    accountNumber: string
  ) => {
    const url = `/transactions/withdraw-resolve`;
    return API.POST(url, {
      amount: amount,
      bankId: bankId,
      accountNumber: accountNumber,
    })
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as IAccountResolve;
        }
        return null;
      })
      .catch((err) => {
        Logger.error(err);
        return null;
      });
  };

  static initiateWithdrawal = (
    amount: number,
    bankId: number,
    accountNumber: string
  ) => {
    const url = `/transactions/withdraw-initiate`;
    return API.POST(url, {
      amount: amount,
      bankId: bankId,
      accountNumber: accountNumber,
    })
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as ITransaction;
        }
        return null;
      })
      .catch((err) => {
        Logger.error(err);
        return null;
      });
  };

  static getTransactions = (page: number, type?: TransactionType | null) => {
    const url = type
      ? `/transactions?page=${page}&type=${type}`
      : `/transactions?page=${page}`;

    return API.GET(url)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as ITransaction[];
        }
        return [] as ITransaction[];
      })
      .catch((err) => {
        Logger.error(err);
        return [] as ITransaction[];
      });
  };

  static getTransactionInfo = () => {
    const url = `/transactions/info`;
    return API.GET(url)
      .then(async (response) => {
        if (response.success && response.data) {
          return response.data as ITransactionInfo;
        }

        return null;
      })
      .catch((err) => {
        Logger.error(err);
        return null;
      });
  };

  static getBanks = () => {
    const url = `/transactions/banks`;
    return API.GET(url)
      .then(async (response) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as IBank[];
        }
        return [] as IBank[];
      })
      .catch((err) => {
        Logger.error(err);
        return [] as IBank[];
      });
  };

  static getTransactionDetails = (id: any) => {
    const url = `/transactions/${id}`;
    return API.GET(url)
      .then(async (response) => {
        if (response.success) {
          return response.data as ITransaction;
        }
        return {} as ITransaction;
      })
      .catch((err) => {
        Logger.error(err);
        return {} as ITransaction;
      });
  };
}
