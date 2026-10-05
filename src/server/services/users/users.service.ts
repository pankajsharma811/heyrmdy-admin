import { NotFoundError } from "@/lib/error";
import type { ListUserDto, UserDetailResponse, UserListItemResponse } from "@/server/dto/users/user.dto";
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
}

export const userService = new UserService();
