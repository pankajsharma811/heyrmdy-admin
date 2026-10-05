import { z } from "zod";

export const listUserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["active", "inactive", "all"]).default("all"),
});

export type ListUserDto = z.infer<typeof listUserQuerySchema>;

export interface UserListItemResponse {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  status: boolean;
  joinedAt: Date;
}

export const userIdParamSchema = z.object({
  id: z.uuid("Invalid user id"),
});

export type UserIdDto = z.infer<typeof userIdParamSchema>;

export interface UserDetailResponse {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  status: boolean;
  joinedAt: Date;
  counts: {
    appointments: number;
    checkins: number;
    symptoms: number;
    flares: number;
    channels: number;
  };
}

export const listAppointmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListAppointmentsDto = z.infer<typeof listAppointmentsQuerySchema>

export interface ListAppointmentResponse {
  id: string;
  providerName: string;
  location: string | null;
  status: string;
  visitType: string;
  date: Date;
  time: string;
  feel: string | null;
}
