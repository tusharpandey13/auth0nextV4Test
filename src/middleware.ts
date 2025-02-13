import { NextResponse, type NextRequest } from "next/server";

import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const authResponse = await auth0.middleware(request);
  const session = await auth0.getSession();
  if (session) {
    console.log(await auth0.getFederatedConnectionAccessToken({connection: 'google-oauth2'})  && 'google-oauth2 done');
    console.log(await auth0.getFederatedConnectionAccessToken({connection: 'github'}) && 'github done');
  }
  return authResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
