import api from "@/api/axios";
import type { Trip } from "@/types/types";
import {
  useState,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

interface TripParams {
  page: number;
  searchTerm: string;
  statusFilter: string;
  sortBy?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}

interface UseTripsReturn {
  trips: Trip[];
  loading: boolean;
  totalPages: number;
  params: TripParams;
  setParams: Dispatch<SetStateAction<TripParams>>;
  reload: () => void;
}

export const useTrips = (initialParams: TripParams): UseTripsReturn => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState(initialParams);

  const loadTrips = useCallback(async () => {
    try {
      const res = await api.get("/trips", {
        params: {
          search: params.searchTerm,
          status: params.statusFilter,
          sortBy: params.sortBy,
          order: params.order,
          page: params.page,
          limit: 6,
        },
      });

      setTrips(res.data.trips || res.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Loading error:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      loadTrips();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [loadTrips]);

  const reload = useCallback(() => {
    setLoading(true);
    loadTrips();
  }, [loadTrips]);

  return { trips, loading, totalPages, params, setParams, reload };
};
