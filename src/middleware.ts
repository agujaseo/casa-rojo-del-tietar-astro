import { defineMiddleware } from 'astro:middleware';
import crypto from 'node:crypto';

const EXPECTED_HASH =
  process.env.KEYSTATIC_AUTH_HASH ||
  '05c0dd5a33807e1ab100a7261cbc62995272356d36d7f362cd83eaf7ce806b4e';

export const onRequest = defineMiddleware((context, next) => {
  // Permitir el prerenderizado estático de /keystatic/index.html (protegido por su propio Gate SHA-256)
  if (context.isPrerendered) {
    return next();
  }

  const { pathname } = context.url;
  if (pathname.startsWith('/api/keystatic')) {
    const authHeader = context.request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.slice(6);
      const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const sepIdx = decoded.indexOf(':');
      if (sepIdx !== -1) {
        const user = decoded.slice(0, sepIdx).trim().toLowerCase();
        const pass = decoded.slice(sepIdx + 1);
        const hash = crypto
          .createHash('sha256')
          .update(`rt_2026_v1:${user}:${pass}`, 'utf8')
          .digest('hex');
        if (hash === EXPECTED_HASH) {
          return next();
        }
      }
    }

    return new Response('Acceso restringido - Administración Casa Rojo del Tiétar', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Keystatic CMS - Casa Rojo del Tietar"',
      },
    });
  }

  return next();
});
