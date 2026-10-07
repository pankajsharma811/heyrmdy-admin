import { AppointmentItem, CheckinItem, FlareItem, PaginatedResponse, SingleResponse, SymptomLogItem, UserChannelItem, UserDetail, UserListItem } from "./types";

const BASE = "/api/v1/users";

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "all";
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchUsers(params: ListParams): Promise<PaginatedResponse<UserListItem>> {
  const res = await fetch(`${BASE}${buildQuery(params)}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchUserDetail(id: string): Promise<UserDetail> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user detail");
  const json: SingleResponse<UserDetail> = await res.json();
  return json.data;
}

export async function fetchUserAppointments(id: string,params: { page?: number; limit?: number }): Promise<PaginatedResponse<AppointmentItem>> {
  const res = await fetch(`${BASE}/${id}/appointments${buildQuery(params)}`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function fetchUserCheckins(id: string,params: { page?: number; limit?: number }): Promise<PaginatedResponse<CheckinItem>> {
  const res = await fetch(`${BASE}/${id}/checkins${buildQuery(params)}`);
  if (!res.ok) throw new Error("Failed to fetch checkins");
  return res.json();
}

export async function fetchUserFlares(id: string,params: { page?: number; limit?: number }): Promise<PaginatedResponse<FlareItem>> {
  const res = await fetch(`${BASE}/${id}/flares${buildQuery(params)}`);
  if (!res.ok) throw new Error("Failed to fetch flares");
  return res.json();
}

export async function fetchUserSymptoms(id: string,params: { page?: number; limit?: number }): Promise<PaginatedResponse<SymptomLogItem>> {
  const res = await fetch(`${BASE}/${id}/symptoms${buildQuery(params)}`);
  if (!res.ok) throw new Error("Failed to fetch symptoms");
  return res.json();
}

export async function fetchUserChannels(id: string,params: { page?: number; limit?: number }): Promise<PaginatedResponse<UserChannelItem>> {
  const res = await fetch(`${BASE}/${id}/channels${buildQuery(params)}`);
  if (!res.ok) throw new Error("Failed to fetch channels");
  return res.json();
}

export async function updateUserStatus(id: string, status: boolean): Promise<{ id: string; status: boolean }> {
  const res = await fetch(`${BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  const json: SingleResponse<{ id: string; status: boolean }> = await res.json();
  return json.data;
}