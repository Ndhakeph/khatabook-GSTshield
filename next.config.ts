// import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// // };

// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// }

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // This ignores type errors during the build
    ignoreBuildErrors: true,
  },
  eslint: {
    // This ignores linting errors (like <img> vs <Image>) during the build
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['pdfkit'],
};

export default nextConfig;