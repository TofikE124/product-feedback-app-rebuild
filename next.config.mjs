/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org" }],
  },
  async redirects() {
    return [{ source: "/", destination: "/feedbacks", permanent: true }];
  },
};

export default nextConfig;
