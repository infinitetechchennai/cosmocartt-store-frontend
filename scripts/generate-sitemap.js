import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

const baseUrl = 'https://www.cosmocartt.com';
const staticPages = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/shipping-policy',
  '/refund-policy',
];

const products = [
  { slug: 'oneplus-10-pro-transparent-mobile-back-case', id: 'oneplus-10-pro-transparent-mobile-back-case' },
  { slug: 'oneplus-10r-5g-transparent-mobile-back-case', id: 'oneplus-10r-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-11r-5g-transparent-mobile-back-case', id: 'oneplus-11r-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-12-transparent-mobile-back-case', id: 'oneplus-12-transparent-mobile-back-case' },
  { slug: 'oneplus-12r-5g-transparent-mobile-back-case', id: 'oneplus-12r-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-13-5g-transparent-mobile-back-case', id: 'oneplus-13-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-13r-5g-transparent-mobile-back-case', id: 'oneplus-13r-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-5t-transparent-mobile-back-case', id: 'oneplus-5t-transparent-mobile-back-case' },
  { slug: 'oneplus-6-transparent-mobile-back-case', id: 'oneplus-6-transparent-mobile-back-case' },
  { slug: 'oneplus-6t-transparent-mobile-back-case', id: 'oneplus-6t-transparent-mobile-back-case' },
  { slug: 'oneplus-7-pro-transparent-mobile-back-case', id: 'oneplus-7-pro-transparent-mobile-back-case' },
  { slug: 'oneplus-7-transparent-mobile-back-case', id: 'oneplus-7-transparent-mobile-back-case' },
  { slug: 'oneplus-7t-pro-transparent-mobile-back-case', id: 'oneplus-7t-pro-transparent-mobile-back-case' },
  { slug: 'oneplus-7t-transparent-mobile-back-case', id: 'oneplus-7t-transparent-mobile-back-case' },
  { slug: 'oneplus-8-pro-transparent-mobile-back-case', id: 'oneplus-8-pro-transparent-mobile-back-case' },
  { slug: 'oneplus-8-transparent-mobile-back-case', id: 'oneplus-8-transparent-mobile-back-case' },
  { slug: 'oneplus-9-pro-transparent-mobile-back-case', id: 'oneplus-9-pro-transparent-mobile-back-case' },
  { slug: 'oneplus-9-transparent-mobile-back-case', id: 'oneplus-9-transparent-mobile-back-case' },
  { slug: 'oneplus-9rt-5g-transparent-mobile-back-case', id: 'oneplus-9rt-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-2-5g-transparent-mobile-back-case', id: 'oneplus-nord-2-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-2t-transparent-mobile-back-case', id: 'oneplus-nord-2t-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-3-5g-transparent-mobile-back-case', id: 'oneplus-nord-3-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-4-5g-transparent-mobile-back-case', id: 'oneplus-nord-4-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-ce-3-lite-5g-transparent-mobile-back-case', id: 'oneplus-nord-ce-3-lite-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-ce-4-5g-transparent-mobile-back-case', id: 'oneplus-nord-ce-4-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-ce-4-lite-transparent-mobile-back-case', id: 'oneplus-nord-ce-4-lite-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-ce-5g-transparent-mobile-back-case', id: 'oneplus-nord-ce-5g-transparent-mobile-back-case' },
  { slug: 'oneplus-nord-transparent-mobile-back-case', id: 'oneplus-nord-transparent-mobile-back-case' },
  { slug: 'magnetic-flip-cover-for-oneplus-8-one-plus-81-8-leather-case', id: 'magnetic-flip-cover-for-oneplus-8-one-plus-81-8-leather-case' },
];

const urls = [
  ...staticPages.map((pathName) => ({ loc: `${baseUrl}${pathName}`, priority: pathName === '/' ? '1.00' : '0.80' })),
  ...products.map((product) => ({ loc: `${baseUrl}/product/${product.slug}`, priority: '0.75' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(
    (page) => `  <url>\n    <loc>${page.loc}</loc>\n    <priority>${page.priority}</priority>\n  </url>`
  )
  .join('\n')}\n</urlset>\n`;

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Generated ${sitemapPath} with ${urls.length} URLs.`);
