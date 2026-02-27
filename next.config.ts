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
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['pdfkit'],
};

export default nextConfig;