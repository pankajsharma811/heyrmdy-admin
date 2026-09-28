import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      success: true,
      message: "Database connected successfully",
      result,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}