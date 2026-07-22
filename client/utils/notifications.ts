// Local (on-device) notification helpers (US-026, and used to back the
// "remind me later" feature from US-030). This intentionally uses
// expo-notifications' local scheduling only — no push server/backend is
// needed for a UX prototype demonstrating the feature end-to-end.
//
// Requires the package to be installed:
//   npx expo install expo-notifications
//
// The import is done lazily/defensively so the rest of the app doesn't
// crash if the package hasn't been installed yet in a given checkout.

import { Platform } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-var-requires
let Notifications: typeof import("expo-notifications") | null = null;
try {
  Notifications = require("expo-notifications");
  Notifications?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  // expo-notifications isn't installed yet — every function below becomes
  // a safe no-op instead of throwing.
  Notifications = null;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  date: Date,
  data?: Record<string, any>,
): Promise<string | null> {
  if (!Notifications) return null;
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: Platform.OS === "web" ? null : ({ type: "date", date } as any),
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelScheduledNotification(id: string): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // no-op
  }
}

/** True once the person has been asked (either answer counts). */
export function isNotificationsAvailable(): boolean {
  return !!Notifications;
}
