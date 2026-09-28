import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    // Student legacy routes
    { source: "/student", destination: "/dashboard", permanent: true },
    { source: "/student/issues", destination: "/dashboard/issues", permanent: true },
    { source: "/student/issues/new", destination: "/dashboard/issues/new", permanent: true },
    { source: "/student/issues/:id", destination: "/dashboard/issues/:id", permanent: true },

    // Hall manager legacy routes
    { source: "/hall-manager", destination: "/dashboard", permanent: true },
    { source: "/hall-manager/issues", destination: "/dashboard/issues", permanent: true },
    { source: "/hall-manager/issues/:id", destination: "/dashboard/issues/:id", permanent: true },

    // Maintenance legacy routes
    { source: "/maintenance", destination: "/dashboard", permanent: true },
    { source: "/maintenance/work-orders", destination: "/dashboard/work-orders", permanent: true },
    { source: "/maintenance/work-orders/:id", destination: "/dashboard/work-orders/:id", permanent: true },

    // Admin legacy routes
    { source: "/admin", destination: "/dashboard", permanent: true },
    { source: "/admin/analytics", destination: "/dashboard/analytics", permanent: true },
    { source: "/admin/audit-logs", destination: "/dashboard/audit-logs", permanent: true },
    { source: "/admin/users", destination: "/dashboard/users", permanent: true },
    { source: "/admin/settings", destination: "/dashboard/settings", permanent: true },
  ],
};

export default nextConfig;
