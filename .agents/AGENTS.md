# AGENTS.md — Casa Rojo del Tiétar (Astro 5 + Keystatic CMS)

> Reglas de proyecto para Antigravity en el repositorio oficial de **Casa Rojo del Tiétar** (`casaruralsierradeltietar.com`).

## 1. Stack Tecnológico
- **Framework:** Astro 5 (`output: 'static'` con rutas híbridas SSR para `/keystatic` y `/api/keystatic` vía `@astrojs/node` standalone).
- **CMS Git-based:** Keystatic CMS (`@keystatic/astro` + `@keystatic/core`), protegido por HTTP Basic Auth en [`src/middleware.ts`](file:///c:/Users/IsmaelPCTrabajo/.gemini/antigravity/scratch/Stitch/src/middleware.ts).
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`) con sistema de diseño editorial *Rustic Editorial Luxury* inspirado en los diseños de Google Stitch (`#703829` terracota del Tiétar, `#59614e` verde encina, `#fff8f5` lino cálido).
- **Tipografías:** `Playfair Display` (titulares editoriales) + `Plus Jakarta Sans` (cuerpo y UI).

## 2. Identidad de Marca y Datos Reales
- **Nombre de marca:** Casa Rojo del Tiétar (`Casa Rural Rojo del Tiétar`).
- **Dirección:** Paraje el Carrascal, s/n. 45633 La Iglesuela del Tiétar (Toledo).
- **Teléfonos:** `605 935 487` / `607 438 345`.
- **Email:** `casarural@casaruralsierradeltietar.com`.
- **Activos fotográficos:** 59 fotografías reales descargadas del sitio original en `public/uploads/` + logotipo oficial `public/uploads/logo.jpg`.

## 3. Estándares de SEO, Schema y WPO
- Todas las páginas utilizan [`src/layouts/Layout.astro`](file:///c:/Users/IsmaelPCTrabajo/.gemini/antigravity/scratch/Stitch/src/layouts/Layout.astro) con JSON-LD `@graph` (`LodgingBusiness`, `BedAndBreakfast`, `VacationRental`, `Offer`, `WebSite`, `BreadcrumbList`, `FAQPage`, `BlogPosting`), OpenGraph, Twitter Cards y Geo-tags de La Iglesuela del Tiétar.
- Imágenes Above-the-Fold (LCP) llevan `fetchpriority="high"` y `decoding="async"`.
- Secciones Below-the-Fold utilizan `content-visibility: auto` (`.content-auto`) y `loading="lazy"`.
