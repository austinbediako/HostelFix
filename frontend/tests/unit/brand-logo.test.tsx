import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandLogo } from "@/components/shared/brand-logo";

describe("BrandLogo", () => {
  it("renders a single accessible name and the light-surface wordmark", () => {
    render(<BrandLogo />);

    const logo = screen.getByRole("img", { name: "HostelFix" });
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(logo.getAttribute("src")).toBe("/brand/hostelfix-logo.svg");
    expect(logo.getAttribute("loading")).toBe("eager");
    for (const className of ["w-44", "h-auto", "max-w-full"]) {
      expect(logo.classList.contains(className)).toBe(true);
    }
    expect(logo.getAttribute("width")).toBe("259");
    expect(logo.getAttribute("height")).toBe("64");
  });

  it("uses the reversed wordmark and larger size for auth screens", () => {
    render(<BrandLogo variant="reversed" size="auth" className="mx-auto" />);

    const logo = screen.getByRole("img", { name: "HostelFix" });
    expect(logo.getAttribute("src")).toBe("/brand/hostelfix-logo-reversed.svg");
    expect(logo.classList.contains("w-72")).toBe(true);
    expect(logo.classList.contains("mx-auto")).toBe(true);
  });

  it("names a wrapping navigation link without duplicate labels", () => {
    render(
      <a href="/dashboard">
        <BrandLogo />
      </a>,
    );

    expect(screen.getByRole("link", { name: "HostelFix" }).getAttribute("href")).toBe("/dashboard");
  });
});
