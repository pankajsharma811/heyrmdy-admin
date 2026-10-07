import { NotFoundError } from "@/lib/error";
import type { AppointmentItemResponse, CheckinItemResponse, FlareItemResponse, ListAppointmentsDto, ListCheckinsDto, ListFlaresDto, ListSymptomsDto, ListUserChannelsDto, ListUserDto, SymptomLogItemResponse, UpdateUserStatusDto, UpdateUserStatusResponse, UserChannelItemResponse, UserDetailResponse, UserListItemResponse } from "@/server/dto/users/user.dto";
import { userRepository } from "@/server/repositories/users/users.repository";

export class UserService {
  async listUsers(params: ListUserDto) {
    const { rows, total } = await userRepository.findUsers(params);

    const items: UserListItemResponse[] = rows.map((row) => {
      const profile = row.users_profile;
      const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : null;

      return {
        id: row.uuid,
        name,
        email: row.email_id,
        profileImage: profile?.profile_image ?? null,
        status: row.is_active,
        joinedAt: row.created_at,
      };
    });

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
      },
    };
  }

  async getUserDetail(uuid: string): Promise<UserDetailResponse> {
    const row = await userRepository.findUserDetail(uuid);

    if (!row) {
      throw new NotFoundError("User not found");
    }

    const profile = row.users_profile;
    const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : null;

    return {
      id: row.uuid,
      name,
      email: row.email_id,
      profileImage: profile?.profile_image ?? null,
      status: row.is_active,
      joinedAt: row.created_at,
      counts: {
        appointments: row._count.appointments,
        checkins: row._count.checkins,
        symptoms: row._count.log_symptoms,
        flares: row._count.flares,
        channels: row._count.channel_members,
      },
    };
  }

  async listUserAppointments(uuid: string, params: ListAppointmentsDto) {
    const exists = await userRepository.userExists(uuid);

    if (!exists) {
      throw new NotFoundError("User not found");
    }

    const { rows, total } = await userRepository.findUserAppointments(uuid, params);

    const items: AppointmentItemResponse[] = rows.map((row) => ({
      id: row.id.toString(),
      providerName: row.provider_name,
      location: row.location,
      status: row.status,
      visitType: row.visit_type,
      date: row.date,
      time: row.time,
      feel: row.feel,
    }));

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
      },
    };
  }

  async listUserCheckins(uuid: string, params: ListCheckinsDto) {
    const exists = await userRepository.userExists(uuid);

    if (!exists) {
      throw new NotFoundError("User not found");
    }

    const { rows, total } = await userRepository.findUserCheckins(uuid, params);

    const items: CheckinItemResponse[] = rows.map((row) => ({
      id: row.id.toString(),
      weekStart: row.week_start,
      weekEnd: row.week_end,
      overallMood: row.overall_mood,
      remedy: row.remedy,
      notes: row.notes,
      insight: row.insight,
      symptoms: row.checkin_symptoms.map((cs) => cs.symptoms.name),
    }));

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
      },
    };
  }

  async listUserFlares(uuid: string, params: ListFlaresDto) {
    const exists = await userRepository.userExists(uuid);

    if (!exists) {
      throw new NotFoundError("User not found");
    }

    const { rows, total } = await userRepository.findUserFlares(uuid, params);

    const items: FlareItemResponse[] = rows.map((row) => {
      const predefinedSymptoms = row.flare_symptoms.map((fs) => fs.symptoms.name);

      return {
        id: row.id.toString(),
        date: row.date,
        time: row.time,
        intensity: row.intensity,
        symptoms: [...predefinedSymptoms, ...row.custom_symptoms],
        notes: row.notes,
        createdAt: row.created_at,
      };
    });

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
      },
    };
  }

  async listUserSymptomLogs(uuid: string, params: ListSymptomsDto) {
    const exists = await userRepository.userExists(uuid);

    if (!exists) {
      throw new NotFoundError("User not found");
    }

    const { rows, total } = await userRepository.findUserSymptomLogs(uuid, params);

    const items: SymptomLogItemResponse[] = rows.map((row) => ({
      id: row.id.toString(),
      logDate: row.log_date,
      symptoms: row.log_symptom_items.map((item) => item.symptoms.name),
      createdAt: row.created_at,
    }));

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
      },
    };
  }

  async listUserChannels(uuid: string, params: ListUserChannelsDto){
    const exists = await userRepository.userExists(uuid);

    if(!exists) {
      throw new NotFoundError("User not found");
    }

    const { rows, total } = await userRepository.findUserChannels(uuid,params);

    const items: UserChannelItemResponse[] = rows.map((row) => ({
      id: row.channels.id.toString(),
      name: row.channels.name,
      image: row.channels.image,
      channelType: row.channels.channel_type,
      totalMembers: Number (row.channels.total_members),
      joinedAt: row.created_at
    }));

    return {
      items,
      meta:{
        page: params.page,
        limit: params.limit,
        total,
      }
    }
  }

  async updateUserStatus(uuid: string, data: UpdateUserStatusDto): Promise<UpdateUserStatusResponse>{

    const user = await userRepository.updateUserStatus(uuid, data.status);

    if(!user){
      throw new NotFoundError("User not found")
    }

    return {
      id: uuid,
      status: user.is_active
    }
  };

}

export const userService = new UserService();
