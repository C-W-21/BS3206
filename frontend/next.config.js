/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: "http://backend:3000/:path*",
            }
        ]
    }
};

module.exports = nextConfig;
