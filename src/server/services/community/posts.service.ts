import { ConflictError, NotFoundError } from "@/lib/error";
import type {
  ListPostDto,
  PostDetailResponse,
  PostListItemResponse,
  RemovePostDto,
  RemovePostResponse,
} from "@/server/dto/community/post.dto";
import { postRepository } from "@/server/repositories/community/posts.repository";

const EXCERPT_LENGTH = 140;

export class PostService {
  async listPosts(params: ListPostDto) {
    const { rows, total } = await postRepository.findPosts(params);

    const items: PostListItemResponse[] = rows.map((row) => {
      const profile = row.users.users_profile;
      const name = profile
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : null;

      const excerpt =
        row.description.length > EXCERPT_LENGTH
          ? `${row.description.slice(0, EXCERPT_LENGTH).trimEnd()}...`
          : row.description;

      const firstMedia = row.post_media[0];

      return {
        id: row.id.toString(),
        title: row.title,
        excerpt,
        postType: row.post_type,
        author: {
          id: row.users.uuid,
          name,
          profileImage: profile?.profile_image ?? null,
        },
        isAnonymous: row.is_anonymous,
        channel: row.channels
          ? { id: row.channels.id.toString(), name: row.channels.name }
          : null,
        thumbnail: firstMedia
          ? { url: firstMedia.media_url, type: firstMedia.media_type }
          : null,
        mediaCount: row._count.post_media,
        totalLikes: Number(row.total_likes),
        totalComments: Number(row.total_comments),
        status: row.is_active,
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

  async getPostDetail(id: bigint): Promise<PostDetailResponse> {
    const row = await postRepository.findPostDetail(id);

    if (!row) {
      throw new NotFoundError("Post not found");
    }

    const authorProfile = row.users.users_profile;
    const authorName = authorProfile
      ? `${authorProfile.first_name} ${authorProfile.last_name}`.trim()
      : null;

    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      postType: row.post_type,
      author: {
        id: row.users.uuid,
        name: authorName,
        email: row.users.email_id,
        profileImage: authorProfile?.profile_image ?? null,
      },
      isAnonymous: row.is_anonymous,
      channel: row.channels
        ? { id: row.channels.id.toString(), name: row.channels.name }
        : null,
      media: row.post_media.map((media) => ({
        id: media.id.toString(),
        url: media.media_url,
        type: media.media_type,
      })),
      totalLikes: Number(row.total_likes),
      totalDislikes: Number(row.total_dislikes),
      totalComments: Number(row.total_comments),
      isEdited: row.is_edited,
      status: row.is_active,
      removeReason: row.remove_reason,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      recentComments: row.comments.map((item) => {
        const profile = item.users.users_profile;

        return {
          id: item.id.toString(),
          comment: item.comment,
          author: {
            id: item.users.uuid,
            name: profile
              ? `${profile.first_name} ${profile.last_name}`.trim()
              : null,
            profileImage: profile?.profile_image ?? null,
          },
          createdAt: item.created_at,
        };
      }),
    };
  }

  async removePost(id: bigint, data: RemovePostDto ): Promise<RemovePostResponse> {
    const post = await postRepository.findPostStatus(id);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (!post.is_active) {
      throw new ConflictError("Post is already removed");
    }

    const removed = await postRepository.removePost(id, data.reason);

    return {
      id: removed.id.toString(),
      status: removed.is_active,
      removeReason: data.reason,
    };
  }
}

export const postService = new PostService();
