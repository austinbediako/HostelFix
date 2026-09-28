import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("brand manifest", () => {
  it("identifies HostelFix without introducing standalone app behavior", () => {
    expect(manifest()).toMatchObject({
      name: "HostelFix — UG Legon Maintenance Portal",
      short_name: "HostelFix",
      start_url: "/login",
      display: "browser",
      theme_color: "#2F4A75",
      background_color: "#F7F7F7",
    });
  });

  it("declares the exported app icons with their actual dimensions", () => {
    expect(manifest().icons).toEqual([
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ]);
  });
});
