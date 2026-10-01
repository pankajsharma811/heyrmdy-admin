import { withErrorHandling } from "@/lib/error";
import { sendPaginated } from "@/lib/response";
import { requireAdmin } from "@/server/permissions/require-admin";
import { userService } from "@/server/services/users/users.service";
import { listUserQuerySchema } from "@/server/validators/users/list-users.validator";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    await requireAdmin();

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const params = listUserQuerySchema.parse(searchParams);

    const { items, meta } = await userService.listUsers(params);

    return sendPaginated(items, meta);
  });
}
