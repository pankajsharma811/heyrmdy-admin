import { NextRequest } from "next/server";

import { withErrorHandling } from "@/lib/error";
import { sendResponse } from "@/lib/response";
import {
  postIdParamSchema,
  removePostSchema,
} from "@/server/dto/community/post.dto";
import { requireAdmin } from "@/server/permissions/require-admin";
import { postService } from "@/server/services/community/posts.service";

export async function GET( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  return withErrorHandling(async () => {
    await requireAdmin();

    const { id } = await params;
    const { id: postId } = postIdParamSchema.parse({ id });

    const post = await postService.getPostDetail(postId);

    return sendResponse(post);
  });
}

export async function DELETE( req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandling(async () => {
    await requireAdmin();

    const { id } = await params;
    const { id: postId } = postIdParamSchema.parse({ id });

    const body = await req.json();
    const data = removePostSchema.parse(body);

    const result = await postService.removePost(postId, data);

    return sendResponse(result);
  });
}