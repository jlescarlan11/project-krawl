import { describe, it, expect, beforeEach } from "vitest";
import {
  storeGuestContext,
  retrieveGuestContext,
  buildUrlFromRouteSnapshot,
  queueGuestUpgradeSuccess,
  consumeGuestUpgradeSuccess,
  getUpgradeSuccessMessage,
} from "@/lib/guest-mode";

describe("guest-mode utilities", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores and retrieves sanitized guest context", () => {
    storeGuestContext({
      intent: "create",
      route: { pathname: "/map" },
      redirectOverride: "https://malicious.test/redirect",
    });

    const context = retrieveGuestContext({ keep: true });
    expect(context).not.toBeNull();
    expect(context?.route.pathname).toBe("/map");
    expect(context?.redirectOverride).toBeUndefined();
  });

  it("builds URLs from route snapshots", () => {
    const url = buildUrlFromRouteSnapshot({
      pathname: "/search",
      query: { q: "food", view: "map" },
      hash: "#near-you",
    });
    expect(url).toBe("/search?q=food&view=map#near-you");
  });

  it("queues and consumes upgrade success payloads", () => {
    queueGuestUpgradeSuccess("create");
    const payload = consumeGuestUpgradeSuccess();
    expect(payload).not.toBeNull();
    expect(payload?.intent).toBe("create");
    expect(consumeGuestUpgradeSuccess()).toBeNull();
  });

  it("returns friendly success messaging", () => {
    expect(getUpgradeSuccessMessage("vouch")).toContain("vouch");
    expect(getUpgradeSuccessMessage("profile")).toContain("experience");
  });
});






