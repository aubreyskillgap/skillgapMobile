import AsyncStorage from "@react-native-async-storage/async-storage";
import { Logger } from "./logger";

const ONBOARDING_CHECK_KEY = "skill_gap_onboarding_key";

export class Device {
  static isRegistered = async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_CHECK_KEY);
      return value !== null;
    } catch (e) {
      Logger.error(e);
      return false;
    }
  };

  static register = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_CHECK_KEY, ONBOARDING_CHECK_KEY);
    } catch (e) {
      Logger.error(e);
      return false;
    }
  };
}