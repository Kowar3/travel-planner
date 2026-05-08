export interface Destination {
  _id: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  isFinal: boolean;
}

export interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  startCity: string;
  endCity: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  totalBudget?: number;
  description?: string;
}

export interface AddressObject {
  city?: string;
  town?: string;
  village?: string;
  country?: string;
  [key: string]: any;
}

export interface Activity {
  _id: string;
  destinationId: string;
  title: string;
  description?: string;
  date: string;
  location: string;
}

export interface Expense {
  _id: string;
  destinationId: string;
  title: string;
  category: string;
  amount: number;
  startDate: string;
  endDate: string;
}
