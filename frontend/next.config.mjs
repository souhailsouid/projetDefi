/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID:
      process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID,
  },
};

export default nextConfig;
