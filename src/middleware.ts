import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // Permitir siempre el prerenderizado estático de todas las rutas (incluida /keystatic/index.html)
  if (context.isPrerendered) {
    return next();
  }
  return next();
});
