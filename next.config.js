/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  async redirects() {
    return [
      { source: '/clients/new', destination: '/clients', permanent: false },
      { source: '/suppliers/new', destination: '/suppliers', permanent: false },
      { source: '/projects/new', destination: '/projects', permanent: false },
      { source: '/projects/phases', destination: '/phases', permanent: false },
      { source: '/materials/new', destination: '/materials', permanent: false },
      { source: '/materials/moves', destination: '/material-moves', permanent: false },
      { source: '/warehouses/new', destination: '/warehouses', permanent: false },
      { source: '/warehouses/reports', destination: '/warehouses', permanent: false },
      { source: '/revenues/new', destination: '/revenues', permanent: false },
      { source: '/expenses/new', destination: '/expenses', permanent: false },
      { source: '/invoices/new', destination: '/invoices', permanent: false },
      { source: '/invoices/clients', destination: '/invoices', permanent: false },
      { source: '/invoices/suppliers', destination: '/invoices', permanent: false },
      { source: '/cashboxes/new', destination: '/cashboxes', permanent: false },
      { source: '/employees/new', destination: '/employees', permanent: false },
      { source: '/partners/new', destination: '/partners', permanent: false },
      { source: '/partners/settlements', destination: '/main/settlements', permanent: false },
      { source: '/transfers/new', destination: '/transfers', permanent: false },
      { source: '/payrolls/new', destination: '/payrolls', permanent: false },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig