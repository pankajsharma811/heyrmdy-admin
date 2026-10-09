import type { post_media_type, post_type } from "@/generated/prisma/enums";
import { z } from "zod";

export const listPostQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["active", "removed", "all"]).default("all"),
  postType: z.enum(["INDIVIDUAL", "CHANNEL"]).optional(),
  channelId: z.coerce.bigint().positive().optional(),
});

export type ListPostDto = z.infer<typeof listPostQuerySchema>;

export interface PostListItemResponse {
  id: string;
  title: string;
  excerpt: string;
  postType: post_type;
  author: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  isAnonymous: boolean;
  channel: {
    id: string;
    name: string;
  } | null;
  thumbnail: {
    url: string;
    type: post_media_type;
  } | null;
  mediaCount: number;
  totalLikes: number;
  totalComments: number;
  status: boolean;
  createdAt: Date;
}


export const postIdParamSchema = z.object({
  id: z.coerce.bigint().positive(),
});

export type PostIdDto = z.infer<typeof postIdParamSchema>;

export interface PostDetailResponse {
  id: string;
  title: string;
  description: string;
  postType: post_type;
  author: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  isAnonymous: boolean;
  channel: {
    id: string;
    name: string;
  } | null;
  media: {
    id: string;
    url: string;
    type: post_media_type;
  }[];
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  isEdited: boolean;
  status: boolean;
  removeReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  recentComments: {
    id: string;
    comment: string;
    author: {
      id: string;
      name: string | null;
      profileImage: string | null;
    };
    createdAt: Date;
  }[];
}


export const removePostSchema = z.object({
  reason: z.string().trim().min(3).max(500),
});

export type RemovePostDto = z.infer<typeof removePostSchema>;

export interface RemovePostResponse {
  id: string;
  status: boolean;
  removeReason: string;
}