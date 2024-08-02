/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ibb.co" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
  async redirects() {
    return [{ source: "/", destination: "/feedbacks", permanent: true }];
  },
};

export default nextConfig;
