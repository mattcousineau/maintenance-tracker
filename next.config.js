/** @type {import('next').NextConfig} */
const nextConfig = {
  //we are defining advanced header solutions here for 7 - troubleshooting avatar
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "referrer-policy", value: "no-referrer" }],
      },
    ];
  },
};

module.exports = nextConfig;
