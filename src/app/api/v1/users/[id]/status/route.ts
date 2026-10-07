import { NextRequest } from "next/server";

import { withErrorHandling } from "@/lib/error";
import { sendResponse } from "@/lib/response";
import { updateUserStatusSchema, userIdParamSchema } from "@/server/dto/users/user.dto";
import { requireAdmin } from "@/server/permissions/require-admin";
import { userService } from "@/server/services/users/users.service";

export async function PATCH( req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandling(async () => {
    await requireAdmin();

    const { id } = await params;
    const { id: userUuid } = userIdParamSchema.parse({ id });

    const body = await req.json();
    const data = updateUserStatusSchema.parse(body);

    const result = await userService.updateUserStatus(userUuid, data);

    return sendResponse(result);
  });
}