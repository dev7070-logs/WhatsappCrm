import { describe, expect, it } from "vitest";

import { isMetaMediaUrl } from "./meta-api";

describe("isMetaMediaUrl (the WABA token is only sent to Meta hosts)", () => {
  it("accepts Meta's media CDN over https", () => {
    expect(isMetaMediaUrl("https://lookaside.fbsbx.com/whatsapp/abc")).toBe(true);
  });
  it("rejects other hosts, look-alikes and plain http", () => {
    expect(isMetaMediaUrl("https://evil.example/whatsapp/abc")).toBe(false);
    expect(isMetaMediaUrl("https://fbsbx.com.evil.example/x")).toBe(false);
    expect(isMetaMediaUrl("http://lookaside.fbsbx.com/whatsapp/abc")).toBe(false);
    expect(isMetaMediaUrl("not a url")).toBe(false);
  });
});
