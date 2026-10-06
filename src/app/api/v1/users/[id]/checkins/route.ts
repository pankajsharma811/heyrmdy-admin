import { NextRequest } from "next/server";

import { withErrorHandling } from "@/lib/error";
import { sendPaginated } from "@/lib/response";
import { listCheckinsQuerySchema, userIdParamSchema } from "@/server/dto/users/user.dto";
import { requireAdmin } from "@/server/permissions/require-admin";
import { userService } from "@/server/services/users/users.service";

export async function GET( req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandling(async () => {
    await requireAdmin();

    const { id } = await params;
    const { id: userUuid } = userIdParamSchema.parse({ id });

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const query = listCheckinsQuerySchema.parse(searchParams);

    const { items, meta } = await userService.listUserCheckins(userUuid, query);

    return sendPaginated(items, meta);
  });
}