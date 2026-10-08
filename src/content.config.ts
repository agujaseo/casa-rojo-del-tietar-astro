import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const estancias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/estancias' }),
  schema: z.object({
    title: z.string(),
    tipo: z.string().default('suite-superior'),
    superficie: z.string(),
    capacidad: z.string(),
    camas: z.string(),
    planta: z.string().default('Planta Superior'),
    destacado: z.string(),
    orden: z.number().default(1),
    imagenPrincipal: z.string(),
    galeria: z.array(z.string()).default([]),
    equipamiento: z.array(z.string()).default([]),
    description: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Casa Rojo del Tiétar'),
    category: z.string().default('rutas-y-naturaleza'),
    readingTime: z.string().default('5 min lectura'),
    image: z.string(),
    imageAlt: z.string().default('Casa Rojo del Tiétar en La Iglesuela'),
  }),
});

export const collections = { estancias, blog };
