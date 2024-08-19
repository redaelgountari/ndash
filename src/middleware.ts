import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token");

  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin/dashboard", "/admin/orders"],
};
