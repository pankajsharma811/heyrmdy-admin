import type { post_media_type, post_type } from "@/generated/prisma/enums";

export type PostListRow = {
  id: bigint;
  title: string;
  description: string;
  post_type: post_type;
  is_anonymous: boolean;
  is_active: boolean;
  total_likes: bigint;
  total_comments: bigint;
  created_at: Date;
  users: {
    uuid: string;
    users_profile: {
      first_name: string;
      last_name: string;
      profile_image: string | null;
    } | null;
  };
  channels: {
    id: bigint;
    name: string;
  } | null;
  post_media: {
    media_url: string;
    media_type: post_media_type;
  }[];
  _count: {
    post_media: number;
  };
};

export type PostDetailRow = {
  id: bigint;
  title: string;
  description: string;
  post_type: post_type;
  is_anonymous: boolean;
  is_active: boolean;
  is_edited: boolean;
  remove_reason: string | null;
  total_likes: bigint;
  total_dislikes: bigint;
  total_comments: bigint;
  created_at: Date;
  updated_at: Date;
  users: {
    uuid: string;
    email_id: string;
    users_profile: {
      first_name: string;
      last_name: string;
      profile_image: string | null;
    } | null;
  };
  channels: {
    id: bigint;
    name: string;
  } | null;
  post_media: {
    id: bigint;
    media_url: string;
    media_type: post_media_type;
  }[];
  comments: {
    id: bigint;
    comment: string;
    created_at: Date;
    users: {
      uuid: string;
      users_profile: {
        first_name: string;
        last_name: string;
        profile_image: string | null;
      } | null;
    };
  }[];
};