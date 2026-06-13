import path from 'path';
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Local monorepo: ../../.env — Railway/Docker: /app only
const repoRoot = path.join(__dirname, '..', '..');
loadEnvConfig(
  path.basename(repoRoot) === 'Winajes' || path.basename(repoRoot) === 'winajes'
    ? repoRoot
    : __dirname,
);

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
    ],
  },
  async redirects() {
    return [{ source: '/', destination: '/ko', permanent: false }];
  },
};

export default withNextIntl(nextConfig);
