import { prisma } from "@/lib/prisma";
import type { ListPostDto } from "@/server/dto/community/post.dto";
import type { PostDetailRow, PostListRow } from "./posts.types";

export class PostRepository {
  async findPosts( params: ListPostDto ): Promise<{ rows: PostListRow[]; total: number }> {
    const { page, limit, search, status, postType, channelId } = params;

    const where = {
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(status !== "all" ? { is_active: status === "active" } : {}),

      ...(postType ? { post_type: postType } : {}),

      ...(channelId ? { channel_id: channelId } : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.posts.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          post_type: true,
          is_anonymous: true,
          is_active: true,
          total_likes: true,
          total_comments: true,
          created_at: true,
          users: {
            select: {
              uuid: true,
              users_profile: {
                select: {
                  first_name: true,
                  last_name: true,
                  profile_image: true,
                },
              },
            },
          },
          channels: {
            select: {
              id: true,
              name: true,
            },
          },
          post_media: {
            select: {
              media_url: true,
              media_type: true,
            },
            orderBy: { id: "asc" },
            take: 1,
          },
          _count: {
            select: {
              post_media: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.posts.count({ where }),
    ]);

    return { rows, total };
  }

  async findPostDetail(id: bigint): Promise<PostDetailRow | null> {
    return prisma.posts.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        post_type: true,
        is_anonymous: true,
        is_active: true,
        is_edited: true,
        remove_reason: true,
        total_likes: true,
        total_dislikes: true,
        total_comments: true,
        created_at: true,
        updated_at: true,
        users: {
          select: {
            uuid: true,
            email_id: true,
            users_profile: {
              select: {
                first_name: true,
                last_name: true,
                profile_image: true,
              },
            },
          },
        },
        channels: {
          select: {
            id: true,
            name: true,
          },
        },
        post_media: {
          select: {
            id: true,
            media_url: true,
            media_type: true,
          },
          orderBy: { id: "asc" },
        },
        comments: {
          select: {
            id: true,
            comment: true,
            created_at: true,
            users: {
              select: {
                uuid: true,
                users_profile: {
                  select: {
                    first_name: true,
                    last_name: true,
                    profile_image: true,
                  },
                },
              },
            },
          },
          orderBy: { created_at: "desc" },
          take: 10,
        },
      },
    });
  }

  async findPostStatus( id: bigint): Promise<{ id: bigint; is_active: boolean } | null> {
    return prisma.posts.findUnique({
      where: { id },
      select: { id: true, is_active: true },
    });
  }

  async removePost( id: bigint, reason: string ): Promise<{ id: bigint; is_active: boolean; remove_reason: string | null }> {
    return prisma.posts.update({
      where: { id },
      data: {
        is_active: false,
        remove_reason: reason,
        updated_at: new Date(),
      },
      select: { id: true, is_active: true, remove_reason: true },
    });
  }
}

export const postRepository = new PostRepository();
