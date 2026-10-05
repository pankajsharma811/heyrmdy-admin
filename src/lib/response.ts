import { NextResponse } from "next/server";

function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

export function sendResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data: serialize(data),
    },
    { status },
  );
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function sendPaginated<T>(
  data: T[],
  meta: { page: number; limit: number; total: number },
  status = 200,
) {
  return NextResponse.json(
    {
      success: true,
      data: serialize(data),
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      } satisfies PaginationMeta,
    },
    { status },
  );
}
