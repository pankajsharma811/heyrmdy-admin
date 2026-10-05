import { appointment_status, overall_mood, visit_type } from "@/generated/prisma/enums";

export type UserListRow = {
  id: bigint;
  uuid: string;
  email_id: string;
  is_active: boolean;
  created_at: Date;
  users_profile: {
    user_name: string | null;
    first_name: string;
    last_name: string;
    profile_image: string | null;
  } | null;
};

export type UserDetailRow = {
  id: bigint;
  uuid: string;
  email_id: string;
  is_active: boolean;
  created_at: Date;
  users_profile: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
  } | null;
  _count: {
    appointments: number;
    checkins: number;
    log_symptoms: number;
    flares: number;
    channel_members: number;
  };
};

export type AppointmentListRow = {
  id: bigint;
  provider_name: string;
  location: string | null;
  status: appointment_status;
  visit_type: visit_type;
  date: Date;
  time: string;
  feel: overall_mood | null;
};
