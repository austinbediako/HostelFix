import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "HostelFix",
  title: "HostelFix — UG Legon Maintenance Portal",
  description: "Report and track maintenance issues in University of Ghana Legon halls.",
};

export const viewport: Viewport = {
  themeColor: "#2F4A75",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
