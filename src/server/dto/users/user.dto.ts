import type { appointment_status, log_flare_intensity, overall_mood, visit_type } from "@/generated/prisma/enums";
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

export type ListAppointmentsDto = z.infer<typeof listAppointmentsQuerySchema>;

export interface ListAppointmentResponse {
  id: string;
  providerName: string;
  location: string | null;
  status: appointment_status;
  visitType: visit_type;
  date: Date;
  time: string;
  feel: overall_mood | null;
}

export const listCheckinsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListCheckinsDto = z.infer<typeof listCheckinsQuerySchema>;

export interface CheckinItemResponse {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  overallMood: overall_mood;
  remedy: string[];
  notes: string | null;
  insight: string | null;
  symptoms: string[];
}

export const listFlaresQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListFlaresDto = z.infer<typeof listFlaresQuerySchema>;

export interface FlaresItemResponse {
  id: string;
  date: Date;
  time: string;
  intensity: log_flare_intensity;
  symptoms: string[];
  notes: string | null;
  createdAt: Date;
}

export const listSymptomsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListSymptomsDto = z.infer<typeof listSymptomsQuerySchema>;

export interface SymptomLogItemResponse {
  id: string;
  logDate: Date;
  symptoms: string[];
  createdAt: Date;
}