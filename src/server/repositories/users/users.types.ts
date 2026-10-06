import type { appointment_status, log_flare_intensity, overall_mood, visit_type } from "@/generated/prisma/enums";

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

export type CheckinListRow = {
  id: bigint;
  week_start: Date;
  week_end: Date;
  overall_mood: overall_mood;
  remedy: string[];
  notes: string | null;
  insight: string | null;
  checkin_symptoms: {
    symptoms: {
      name: string;
    };
  }[];
};

export type FlareListRow = {
  id: bigint;
  date: Date;
  time: string;
  intensity: log_flare_intensity;
  notes: string | null;
  custom_symptoms: string[];
  created_at: Date;
  flare_symptoms: {
    symptoms: {
      name: string;
    };
  }[];
};

export type SymptomLogListRow = {
  id: bigint;
  log_date: Date;
  created_at: Date;
  log_symptom_items: {
    symptoms: {
      name: string;
    };
  }[];
};
