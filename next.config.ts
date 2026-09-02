import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pins the workspace root explicitly — without this, Turbopack walks up
  // looking for a lockfile and can land on an unrelated one sitting in the
  // user's home directory, which it then (correctly) refuses to use.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // The admin panel lets editors paste any hosted URL into
    // authors.photo_url / issues.cover_image (there's no upload flow
    // yet), and next/image refuses to optimize a remote host that isn't
    // explicitly allow-listed. Wide open to any https host rather than a
    // fixed list, since editorial writes are already gated by RLS
    // (editor/admin only) — this isn't accepting arbitrary public input.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
