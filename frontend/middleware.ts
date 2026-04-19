import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Pass-through middleware so request pipeline remains valid in Next.js.
export function middleware(_request: NextRequest) {
	return NextResponse.next();
}
