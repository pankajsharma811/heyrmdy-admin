import { withAuth } from "next-auth/middleware";

export default withAuth ({
    pages: {
        signIn: "/login"
    }
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/community/:path*",
    "/library/:path*",
    "/categories/:path*",
  ],
};
