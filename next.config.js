/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'oyxwbdnarstdyanjdpqw.supabase.co',
            },
            ...(process.env.NODE_ENV === 'development' ? [
                {
                    protocol: 'http',
                    hostname: 'localhost'
                },
                {
                    protocol: 'http',
                    hostname: '127.0.0.1'
                }
            ] : [])
        ]
    }
};

module.exports = nextConfig;
