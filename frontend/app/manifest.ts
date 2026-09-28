import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HostelFix — UG Legon Maintenance Portal",
    short_name: "HostelFix",
    description: "Report and track maintenance issues in University of Ghana Legon halls.",
    start_url: "/login",
    display: "browser",
    theme_color: "#2F4A75",
    background_color: "#F7F7F7",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
