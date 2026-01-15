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
  // Optimize barrel imports for faster dev boot and builds (React Best Practice 2.1)
  experimental: {
    optimizePackageImports: ["lucide-react", "@stripe/react-stripe-js"],
  },
};

export default nextConfig;
