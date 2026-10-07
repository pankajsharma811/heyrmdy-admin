import { prisma } from "@/lib/prisma";
import type { ListAppointmentsDto, ListCheckinsDto, ListFlaresDto, ListSymptomsDto, ListUserChannelsDto, ListUserDto } from "@/server/dto/users/user.dto";
import type { AppointmentListRow, CheckinListRow, FlareListRow, SymptomLogListRow, UserChannelListRow, UserDetailRow, UserListRow } from "./users.types";

export class UserRepository {
  async findUsers( params: ListUserDto ): Promise<{ rows: UserListRow[]; total: number }> {
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

  async findUserAppointments( uuid: string, params: ListAppointmentsDto ): Promise<{ rows: AppointmentListRow[]; total: number }> {
    const { page, limit } = params;

    const where = {
      users: {
        uuid,
      },
    };

    const [rows, total] = await Promise.all([
      prisma.appointments.findMany({
        where,
        select: {
          id: true,
          provider_name: true,
          location: true,
          status: true,
          visit_type: true,
          date: true,
          time: true,
          feel: true,
        },
        orderBy:[
          {
            date: "desc",
          },
          {
            time: "desc"
          }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.appointments.count({
        where,
      })
    ]);

    return {
      rows,
      total
    }
  }

  async findUserCheckins( uuid: string, params: ListCheckinsDto): Promise<{ rows: CheckinListRow[]; total: number }> {
  const { page, limit } = params;

  const where = {
    users: {
      uuid,
    },
  };

  const [rows, total] = await Promise.all([
    prisma.checkins.findMany({
      where,
      select: {
        id: true,
        week_start: true,
        week_end: true,
        overall_mood: true,
        remedy: true,
        notes: true,
        insight: true,
        checkin_symptoms: {
          select: {
            symptoms: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        week_start: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.checkins.count({ where }),
  ]);

  return { rows, total };
  }

  async findUserFlares( uuid: string, params: ListFlaresDto ): Promise<{ rows: FlareListRow[]; total: number }> {
    const { page, limit } = params;

    const where = {
      users: {
        uuid,
      },
    };

    const [rows, total] = await Promise.all([
      prisma.flares.findMany({
        where,
        select: {
          id: true,
          date: true,
          time: true,
          intensity: true,
          notes: true,
          custom_symptoms: true,
          created_at: true,
          flare_symptoms: {
            select: {
              symptoms: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [{ date: "desc" }, { time: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.flares.count({ where }),
    ]);

    return { rows, total };
  }

  async findUserSymptomLogs( uuid: string, params: ListSymptomsDto): Promise<{ rows: SymptomLogListRow[]; total: number }> {
  const { page, limit } = params;

  const where = {
    users: {
      uuid,
    },
  };

  const [rows, total] = await Promise.all([
    prisma.log_symptoms.findMany({
      where,
      select: {
        id: true,
        log_date: true,
        created_at: true,
        log_symptom_items: {
          select: {
            symptoms: {
              select: {
                name: true,
              },
            },
          },
        },
      },
        orderBy: { log_date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.log_symptoms.count({ where }),
    ]);

    return { rows, total };
  }

  async findUserChannels( uuid: string, params: ListUserChannelsDto): Promise<{rows: UserChannelListRow[]; total: number }>{
    const { page, limit } = params;

    const where = {
      users: {
        uuid,
      }
    };

    const [rows, total] = await Promise.all([
      prisma.channel_members.findMany({
      where,
      select: {
        created_at: true,
        channels:{
          select: {
            id: true,
            name: true,
            image: true,
            channel_type: true,
            total_members: true,
            },
          },
        },
        orderBy: { created_at : "desc"},
        skip: (page-1) * limit,
        take: limit,
      }),
      prisma.channel_members.count({ where })
    ]);
    return {rows, total}
  }

  async userExists(uuid: string): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { uuid },
      select: { id: true },
    });
    return !!user;
  }

  async updateUserStatus(uuid: string, status: boolean): Promise<{ id: bigint; is_active: boolean } | null> {
    try {
      return await prisma.users.update({
        where: { uuid },
        data: { is_active: status },
        select: { id: true, is_active: true },
      });
    } catch {
      return null;  // user not found (Prisma throws P2025)
    }
  }
}

export const userRepository = new UserRepository();
