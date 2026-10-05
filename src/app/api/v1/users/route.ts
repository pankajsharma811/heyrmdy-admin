import { withErrorHandling } from "@/lib/error";
import { sendPaginated } from "@/lib/response";
import { listUserQuerySchema } from "@/server/dto/users/user.dto";
import { requireAdmin } from "@/server/permissions/require-admin";
import { userService } from "@/server/services/users/users.service";
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
