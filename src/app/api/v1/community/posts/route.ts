import { NextRequest } from "next/server";

import { withErrorHandling } from "@/lib/error";
import { sendPaginated } from "@/lib/response";
import { listPostQuerySchema } from "@/server/dto/community/post.dto";
import { requireAdmin } from "@/server/permissions/require-admin";
import { postService } from "@/server/services/community/posts.service";

export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    await requireAdmin();

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const params = listPostQuerySchema.parse(searchParams);

    const { items, meta } = await postService.listPosts(params);

    return sendPaginated(items, meta);
  });
}