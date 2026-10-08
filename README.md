# 🏡 Casa Rojo del Tiétar — Web Oficial (Astro 5 + Keystatic CMS)

Sitio web oficial de **Casa Rojo del Tiétar** (*Casa Rural Rojo del Tiétar*), antiguo pajar de piedra rehabilitado de alquiler íntegro para **10 a 13 personas** con **5 suites con baño privado** y **desayuno mediterráneo incluido**, situado en **La Iglesuela del Tiétar (Toledo)**, en pleno Valle del Tiétar y Sierra de San Vicente con vistas a la Sierra de Gredos.

---

## ✨ Características Principales

- **Diseño Editorial Stitch ("Rustic Editorial Luxury"):** Basado en los proyectos de diseño de Google Stitch (`Casa Rural Sierra Redesign` y `Rediseño Web Sierra del Tiétar`), combinando terracota cálido (`#703829`), verde encina (`#59614e`) y lino natural (`#fff8f5`).
- **100% Contenido y Fotografías Reales:** Incluye las **59 fotografías originales en alta resolución**, el logotipo oficial (`logo.jpg`), las **5 suites** (*El Ejido, Gredos, Torinas, El Piélago y El Pajar*), zonas comunes (*Salón con chimenea, Cocina equipada y Patio con barbacoa*), tarifas reales, desayuno mediterráneo incluido y toda la guía histórica/natural de La Iglesuela del Tiétar.
- **Keystatic CMS Integrado (`/keystatic`):**
  - **Singleton `ajustes`:** Configuración general, teléfonos (`605 935 487` / `607 438 345`), precios (`200 €/noche` Dom-Jue, `375 €/noche` Vie-Sáb/Agosto, `1.400 €/semana` Promo Aniversario) y desayuno incluido.
  - **Colección `estancias`:** Gestión de las 5 suites y 3 estancias comunes con sus fotografías y equipamiento.
  - **Colección `blog`:** Guía rural y artículos SEO del Valle del Tiétar y Sierra de San Vicente.
  - **Seguridad:** Panel `/keystatic` protegido mediante HTTP Basic Auth (`src/middleware.ts`).
- **SEO Técnico, GEO/AEO y Schema.org Avanzado:**
  - Grafo completo JSON-LD (`@graph`) con `LodgingBusiness`, `BedAndBreakfast`, `VacationRental`, `Offer`, `FAQPage`, `BreadcrumbList`, `WebSite` y `BlogPosting`.
  - Meta etiquetas OpenGraph, Twitter Cards, etiquetas geográficas (`geo.position`, `ICBM`) para SEO Local en Toledo / Madrid / Valle del Tiétar.
  - Sitemap XML automático (`@astrojs/sitemap`), `robots.txt` y `llms.txt` optimizado para buscadores IA.
- **WPO & Core Web Vitals:**
  - Preload y `fetchpriority="high"` en imágenes LCP.
  - `content-visibility: auto` en secciones below-the-fold.
  - Modales nativos `<dialog>` y acordeones `<details>` sin dependencias pesadas de JavaScript.
  - Compresión HTML y prefetching en viewport activados.

---

## 🚀 Comandos del Proyecto

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (incluye Keystatic en http://localhost:4321/keystatic)
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción (servidor Node standalone)
npm run preview
```

## 🔐 Variables de Entorno (`.env`)

El acceso a `/keystatic` está protegido mediante hash criptográfico SHA-256 con sal (`KEYSTATIC_AUTH_HASH`), sin almacenar nunca contraseñas en texto plano en el código fuente:

```env
KEYSTATIC_AUTH_HASH=05c0dd5a33807e1ab100a7261cbc62995272356d36d7f362cd83eaf7ce806b4e
SITE_URL=https://casaruralsierradeltietar.com
```
