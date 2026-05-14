import type { Response as ExpressResponse } from "express";

/** Copy Set-Cookie from a Fetch API `Response` onto an Express response. */
export function applyWebResponseCookies(expressRes: ExpressResponse, webResponse: globalThis.Response): void {
  const hdrs = webResponse.headers as unknown as { getSetCookie?: () => string[] };
  const cookies = typeof hdrs.getSetCookie === "function" ? hdrs.getSetCookie() : [];
  if (cookies.length > 0) {
    for (const c of cookies) expressRes.append("Set-Cookie", c);
  } else {
    const single = webResponse.headers.get("set-cookie");
    if (single) expressRes.setHeader("Set-Cookie", single);
  }
}
