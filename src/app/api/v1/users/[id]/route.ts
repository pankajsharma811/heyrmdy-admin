import { withErrorHandling } from "@/lib/error";
import { sendResponse } from "@/lib/response";
import { userIdParamSchema } from "@/server/dto/users/user.dto";
import { requireAdmin } from "@/server/permissions/require-admin";
import { userService } from "@/server/services/users/users.service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandling(async () => {
    await requireAdmin();

    const { id } = await params;
    const { id: userId } = userIdParamSchema.parse({ id });

    const user = await userService.getUserDetail(userId);

    return sendResponse(user);
  });
}
