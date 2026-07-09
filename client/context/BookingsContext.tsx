import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Frontend-only booking record for an Experience. There's no backend model
// for bookings yet, so these are persisted locally to AsyncStorage. Swap
// `persist`/load for a real API call once `POST /experiences/:id/bookings`
// exists — the shape here is deliberately close to what that endpoint would
// return so the migration is mostly a find-and-replace.
export interface Booking {
  id: string; // booking reference, e.g. "LP-2025-A8C4"
  experienceId: string;
  experienceTitle: string;
  artisanName: string;
  date: string; // "Monday, June 14, 2025"
  time: string; // "9:00 AM – 12:00 PM"
  location: string;
  totalPaid: number;
  createdAt: string;
}

interface BookingsContextValue {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: Booking) => Promise<void>;
  removeBooking: (id: string) => Promise<void>;
}

const STORAGE_KEY = "localpasa_bookings";

const BookingsContext = createContext<BookingsContextValue | null>(null);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setBookings(JSON.parse(raw));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (updated: Booking[]) => {
    setBookings(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const addBooking = useCallback(
    async (booking: Booking) => {
      await persist([booking, ...bookings]);
    },
    [bookings, persist],
  );

  const removeBooking = useCallback(
    async (id: string) => {
      await persist(bookings.filter((b) => b.id !== id));
    },
    [bookings, persist],
  );

  return (
    <BookingsContext.Provider
      value={{ bookings, loading, addBooking, removeBooking }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings(): BookingsContextValue {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingsProvider>");
  return ctx;
}

export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LP-${year}-${rand}`;
}
