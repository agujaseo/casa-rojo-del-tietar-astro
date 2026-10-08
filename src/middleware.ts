import { defineMiddleware } from 'astro:middleware';
import { timingSafeEqual } from 'node:crypto';

const USER = import.meta.env.KEYSTATIC_USER;
const PASS = import.meta.env.KEYSTATIC_PASS;

function isKeystaticPath(pathname: string): boolean {
  return (
    pathname === '/keystatic' ||
    pathname.startsWith('/keystatic/') ||
    pathname.startsWith('/api/keystatic')
  );
}

function matches(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = new URL(context.request.url);

  if (!isKeystaticPath(pathname)) {
    return next();
  }

  // En desarrollo local sin credenciales explícitas, permitir acceso rápido al CMS
  if (import.meta.env.DEV && (!USER || !PASS)) {
    return next();
  }

  if (!USER || !PASS) {
    return new Response('Keystatic no disponible: credenciales KEYSTATIC_USER y KEYSTATIC_PASS no configuradas.', {
      status: 503,
    });
  }

  const expected = `Basic ${Buffer.from(`${USER}:${PASS}`).toString('base64')}`;
  const provided = context.request.headers.get('authorization') ?? '';

  if (!matches(provided, expected)) {
    return new Response('Acceso restringido — Panel Keystatic Casa Rojo del Tiétar', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Keystatic Casa Rojo del Tietar", charset="UTF-8"',
      },
    });
  }

  return next();
});
