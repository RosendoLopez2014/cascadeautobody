/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rcktbuilds.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "*.woocommerce.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
