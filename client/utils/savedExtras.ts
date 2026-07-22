import AsyncStorage from "@react-native-async-storage/async-storage";

// Per-saved-item "extras" — a personal note (US-031) and an optional
// "remind me later" date (US-030) — kept entirely on-device via
// AsyncStorage. This is intentionally backend-independent: it's a UX
// prototype feature, and wiring it to the server can come later once the
// backend has a saved-item-notes endpoint.

const STORAGE_KEY = "localpasa_saved_extras";

export interface SavedExtra {
  itemId: string;
  itemType: "site" | "artisan" | "event";
  note?: string;
  reminderDate?: string; // ISO date string
  reminderLabel?: string;
}

type ExtrasMap = Record<string, SavedExtra>;

function keyFor(itemId: string, itemType: SavedExtra["itemType"]) {
  return `${itemType}:${itemId}`;
}

async function readAll(): Promise<ExtrasMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function writeAll(map: ExtrasMap): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Best-effort local persistence — safe to ignore write failures here,
    // the UI simply won't remember the note/reminder next launch.
  }
}

/** Returns every saved-item extra, keyed by `${itemType}:${itemId}`. */
export async function getAllSavedExtras(): Promise<ExtrasMap> {
  return readAll();
}

export async function getSavedExtra(
  itemId: string,
  itemType: SavedExtra["itemType"],
): Promise<SavedExtra | null> {
  const all = await readAll();
  return all[keyFor(itemId, itemType)] ?? null;
}

export async function setSavedNote(
  itemId: string,
  itemType: SavedExtra["itemType"],
  note: string,
): Promise<void> {
  const all = await readAll();
  const key = keyFor(itemId, itemType);
  all[key] = { ...(all[key] ?? { itemId, itemType }), itemId, itemType, note };
  await writeAll(all);
}

export async function setSavedReminder(
  itemId: string,
  itemType: SavedExtra["itemType"],
  reminderDate: string,
  reminderLabel?: string,
): Promise<void> {
  const all = await readAll();
  const key = keyFor(itemId, itemType);
  all[key] = {
    ...(all[key] ?? { itemId, itemType }),
    itemId,
    itemType,
    reminderDate,
    reminderLabel,
  };
  await writeAll(all);
}

export async function clearSavedReminder(
  itemId: string,
  itemType: SavedExtra["itemType"],
): Promise<void> {
  const all = await readAll();
  const key = keyFor(itemId, itemType);
  if (all[key]) {
    delete all[key].reminderDate;
    delete all[key].reminderLabel;
    await writeAll(all);
  }
}

export async function clearSavedExtra(
  itemId: string,
  itemType: SavedExtra["itemType"],
): Promise<void> {
  const all = await readAll();
  delete all[keyFor(itemId, itemType)];
  await writeAll(all);
}
