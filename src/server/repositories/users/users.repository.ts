import { prisma } from "@/lib/prisma";
import { ListUserDto } from "@/server/dto/users/user.dto";
import { UserDetailRow, UserListRow } from "./users.types";

export class UserRepository {
  async findUsers(
    params: ListUserDto,
  ): Promise<{ rows: UserListRow[]; total: number }> {
    const { page, limit, search, status } = params;

    const where = {
      ...(search
        ? {
            OR: [
              {
                email_id: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                users_profile: {
                  is: {
                    OR: [
                      {
                        user_name: {
                          contains: search,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        first_name: {
                          contains: search,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        last_name: {
                          contains: search,
                          mode: "insensitive" as const,
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }
        : {}),

      ...(status !== "all"
        ? {
            is_active: status === "active",
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: {
          id: true,
          uuid: true,
          email_id: true,
          is_active: true,
          created_at: true,
          users_profile: {
            select: {
              user_name: true,
              first_name: true,
              last_name: true,
              profile_image: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.users.count({ where }),
    ]);

    return { rows, total };
  }

  async findUserDetail(uuid: string): Promise<UserDetailRow | null> {
    return prisma.users.findUnique({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        email_id: true,
        is_active: true,
        created_at: true,
        users_profile: {
          select: {
            first_name: true,
            last_name: true,
            profile_image: true,
          },
        },
        _count: {
          select: {
            appointments: true,
            checkins: true,
            log_symptoms: true,
            flares: true,
            channel_members: true,
          },
        },
      },
    });
  }

  
}

export const userRepository = new UserRepository();
