/** Copy Set-Cookie from a Fetch API `Response` onto an Express response. */
export function applyWebResponseCookies(expressRes, webResponse) {
    const hdrs = webResponse.headers;
    const cookies = typeof hdrs.getSetCookie === "function" ? hdrs.getSetCookie() : [];
    if (cookies.length > 0) {
        for (const c of cookies)
            expressRes.append("Set-Cookie", c);
    }
    else {
        const single = webResponse.headers.get("set-cookie");
        if (single)
            expressRes.setHeader("Set-Cookie", single);
    }
}
//# sourceMappingURL=forwardWebResponse.js.map