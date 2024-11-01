/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  rewrites: async () => [{ source: "/images/:path*", destination: "/:path*" }],
};

export default nextConfig;
