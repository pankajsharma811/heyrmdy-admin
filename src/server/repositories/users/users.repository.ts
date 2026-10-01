import { prisma } from "@/lib/prisma";
import type { ListUserDto } from "@/server/validators/users/list-users.validator";

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

export class UserRepository {
  async findUsers(params: ListUserDto): Promise<{ rows: UserListRow[]; total: number }> {
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
}

export const userRepository = new UserRepository();