export interface UserListItem {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    status: boolean;
    joinedAt: string;
}

export interface UserDetail {
    id: string;
    name: string |null;
    email: string;
    profileImage: string | null;
    status: boolean;
    joinedAt: string;
    counts: {
        appointments: number;
        checkings: number;
        symptoms: number;
        flares: number;
        channels: number;
    }
}

export interface AppointmentItem {
  id: string;
  providerName: string;
  location: string | null;
  status: "UPCOMING" | "COMPLETED";
  visitType: string;
  date: string;
  time: string;
  feel: string | null;
}

export interface CheckinItem {
  id: string;
  weekStart: string;
  weekEnd: string;
  overallMood: string;
  remedy: string[];
  notes: string | null;
  insight: string | null;
  symptoms: string[];
}

export interface FlareItem {
  id: string;
  date: string;
  time: string;
  intensity: "MILD" | "MODERATE" | "INTENSE" | "OVERWHELMING" | "SEVERE";
  symptoms: string[];
  notes: string | null;
  createdAt: string;
}

export interface SymptomLogItem {
  id: string;
  logDate: string;
  symptoms: string[];
  createdAt: string;
}

export interface UserChannelItem {
  id: string;
  name: string;
  image: string | null;
  channelType: "POPULAR" | "RECOMMENDED" | "STANDARD";
  totalMembers: number;
  joinedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}