import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pins the workspace root explicitly — without this, Turbopack walks up
  // looking for a lockfile and can land on an unrelated one sitting in the
  // user's home directory, which it then (correctly) refuses to use.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
