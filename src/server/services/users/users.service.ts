import { UserListItemDTO } from "@/server/dto/users/user-list-item.dto";
import {
  UserListRow,
  userRepository,
} from "@/server/repositories/users/users.repository";
import { ListUserDto } from "@/server/validators/users/list-users.validator";

export class UserService {
  private toListItemDto(row: UserListRow): UserListItemDTO {
    const profile = row.users_profile;
    const name = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : null;

    return {
      id: row.id.toString(),
      email: row.email_id,
      name,
      profileImage: profile?.profile_image ?? null,
      status: row.is_active,
      joinedAt: row.created_at,
    };
  }
  async listUsers(params: ListUserDto) {
    const { rows, total } = await userRepository.findUsers(params);

    return {
      items: rows.map((row) => this.toListItemDto(row)),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
      },
    };
  }
}

export const userService = new UserService();
