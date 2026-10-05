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
  // The article PDF route reads its font files from disk at runtime
  // (lib/pdf/styles.ts). They're loaded by path, not imported, so the
  // build can't see that the deployed function needs them — say so. The
  // key is a glob, so the route's literal [slug] brackets are escaped.
  outputFileTracingIncludes: {
    '/api/articles/\\[slug\\]/pdf': ['./lib/pdf/fonts/*.ttf'],
  },
};

export default nextConfig;
