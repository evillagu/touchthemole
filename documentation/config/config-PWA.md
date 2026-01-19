# Configuración PWA (Progressive Web App)

## Objetivo

Este documento describe la configuración completa de Progressive Web App (PWA) en la aplicación "Touch the Mole". Incluye la configuración del Service Worker, Web App Manifest, meta tags, y estrategias de cache para habilitar funcionalidad offline e instalación como aplicación nativa.

## Ubicación de Archivos

- **Manifest**: `public/manifest.webmanifest`
- **Service Worker Config**: `ngsw-config.json`
- **Configuración de App**: `src/app/app.config.ts`
- **HTML Principal**: `src/index.html`
- **Build Config**: `angular.json`
- **GitHub Actions Workflow**: `.github/workflows/deploy-gh-pages.yml`
- **404.html**: `public/404.html`

---

## 1. Web App Manifest

### Archivo: `public/manifest.webmanifest`

El manifest define los metadatos de la aplicación PWA y permite que los usuarios instalen la aplicación en sus dispositivos.

#### Propiedades Configuradas

```json
{
  "name": "Toca el Topo",
  "short_name": "Toca el Topo",
  "description": "Juego interactivo donde debes tocar el topo antes de que desaparezca...",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "./",
  "start_url": "./",
  "theme_color": "#ff2d55",
  "background_color": "#ffd93d",
  "categories": ["games", "entertainment"],
  "lang": "es",
  "dir": "ltr",
  "icons": [...]
}
```

#### Descripción de Propiedades

- **`name`**: Nombre completo de la aplicación mostrado al instalar
- **`short_name`**: Nombre corto usado en la pantalla de inicio y launcher
- **`description`**: Descripción de la aplicación para motores de búsqueda y tiendas
- **`display`**: `"standalone"` - La aplicación se abre sin barra del navegador, como app nativa
- **`orientation`**: `"portrait-primary"` - Orientación preferida (vertical)
- **`scope`**: `"./"` - Alcance de la PWA (toda la aplicación)
- **`start_url`**: `"./"` - URL de inicio cuando se abre la app instalada
- **`theme_color`**: `"#ff2d55"` - Color del tema usado en la barra de estado
- **`background_color`**: `"#ffd93d"` - Color de fondo mostrado durante la carga
- **`categories`**: Categorías de la aplicación para tiendas de aplicaciones
- **`lang`**: `"es"` - Idioma principal de la aplicación
- **`dir`**: `"ltr"` - Dirección del texto (left-to-right)

#### Íconos

Los íconos se definen en el array `icons`:

```json
{
  "src": "logo-topo.svg",
  "sizes": "any",
  "type": "image/svg+xml",
  "purpose": "any"
}
```

**Nota**: Actualmente se usan íconos SVG con `sizes: "any"`. Para mejor compatibilidad, se recomienda agregar íconos PNG en tamaños específicos (192x192 y 512x512).

---

## 2. Meta Tags en HTML

### Archivo: `src/index.html`

Los meta tags proporcionan información adicional para navegadores y sistemas operativos móviles.

#### Meta Tags Configurados

```html
<meta name="description" content="Juego interactivo donde debes tocar el topo..." />
<meta name="theme-color" content="#ff2d55" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Toca el Topo" />
<meta name="mobile-web-app-capable" content="yes" />
```

#### Descripción de Meta Tags

- **`description`**: Descripción para SEO y previews sociales
- **`theme-color`**: Color del tema (debe coincidir con `theme_color` del manifest)
- **`apple-mobile-web-app-capable`**: Habilita modo standalone en iOS
- **`apple-mobile-web-app-status-bar-style`**: Estilo de la barra de estado en iOS
  - `black-translucent`: Barra negra translúcida
- **`apple-mobile-web-app-title`**: Título mostrado en iOS cuando se agrega a pantalla de inicio
- **`mobile-web-app-capable`**: Habilita modo standalone en Android

#### Links Adicionales

```html
<link rel="icon" type="image/x-icon" href="logo-topo.svg" />
<link rel="apple-touch-icon" href="logo-topo.svg" />
<link rel="manifest" href="manifest.webmanifest" />
```

- **`rel="icon"`**: Ícono estándar del navegador
- **`rel="apple-touch-icon"`**: Ícono para iOS cuando se agrega a pantalla de inicio
- **`rel="manifest"`**: Referencia al Web App Manifest

---

## 3. Service Worker Configuration

### Archivo: `ngsw-config.json`

El Service Worker gestiona el cache de recursos para habilitar funcionalidad offline.

#### Estructura de Configuración

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "index.html",
  "assetGroups": [...],
  "dataGroups": []
}
```

**Nota importante**: El `index` y las rutas en `assetGroups` deben ser **relativas** (sin barra inicial `/`) para que respeten el `base-href` configurado durante el build. Esto es especialmente importante para despliegues en GitHub Pages.

#### Asset Groups

Los asset groups definen qué recursos se cachean y cómo.

##### Grupo "app"

```json
{
  "name": "app",
  "installMode": "prefetch",
  "updateMode": "prefetch",
  "resources": {
    "files": [
      "favicon.ico",
      "index.csr.html",
      "index.html",
      "manifest.webmanifest",
      "/*.css",
      "/*.js"
    ]
  }
}
```

**Propósito**: Cachea los archivos esenciales de la aplicación.

**Estrategias**:
- **`installMode: "prefetch"`**: Precarga todos los recursos al instalar el Service Worker
- **`updateMode: "prefetch"`**: Precarga actualizaciones cuando están disponibles

**Recursos incluidos**:
- Archivos HTML (index.html, index.csr.html)
- Archivos CSS y JavaScript
- Favicon y manifest

**Nota importante sobre rutas**:
- Las rutas en `ngsw-config.json` deben ser **relativas** (sin barra inicial `/`) para que respeten el `base-href` configurado durante el build
- Esto es especialmente importante cuando se despliega en GitHub Pages con un `base-href` como `/touch-the-mole/`
- Las rutas absolutas pueden causar errores 404 y bucles infinitos en algunos navegadores cuando el Service Worker intenta cargar recursos desde la raíz en lugar de desde el `base-href`

##### Grupo "assets"

```json
{
  "name": "assets",
  "installMode": "prefetch",
  "updateMode": "prefetch",
  "resources": {
    "files": [
      "/**/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2|mp3|wav|ogg|aac)"
    ]
  }
}
```

**Propósito**: Cachea recursos estáticos (imágenes, fuentes, audio).

**Estrategias**:
- **`installMode: "prefetch"`**: Precarga todos los assets al instalar
- **`updateMode: "prefetch"`**: Precarga actualizaciones de assets

**Tipos de archivos incluidos**:
- Imágenes: SVG, JPG, PNG, WebP, AVIF, GIF
- Fuentes: OTF, TTF, WOFF, WOFF2
- Audio: MP3, WAV, OGG, AAC

#### Data Groups

Los data groups están vacíos actualmente. Se pueden usar para cachear respuestas de APIs con estrategias personalizadas (network-first, cache-first, etc.).

---

## 4. Configuración en app.config.ts

### Archivo: `src/app/app.config.ts`

```typescript
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

#### Configuración del Service Worker

- **`enabled: !isDevMode()`**: 
  - El Service Worker solo está activo en producción
  - En desarrollo (`ng serve`), el Service Worker está deshabilitado para facilitar el debugging

- **`registrationStrategy: 'registerWhenStable:30000'`**:
  - Registra el Service Worker después de que la aplicación esté estable
  - Espera hasta 30 segundos para que la aplicación se estabilice
  - Evita interferir con el desarrollo activo

#### Beneficios

- **Funcionalidad offline**: La aplicación funciona sin conexión a internet
- **Carga rápida**: Recursos cacheados se cargan instantáneamente
- **Actualizaciones automáticas**: El Service Worker detecta y aplica actualizaciones

---

## 5. Configuración de Build

### Archivo: `angular.json`

#### Configuración de Producción

```json
{
  "configurations": {
    "production": {
      "serviceWorker": "ngsw-config.json",
      "outputHashing": "all",
      "optimization": true
    },
    "production-es": {
      "serviceWorker": "ngsw-config.json",
      // ... otras configuraciones
    },
    "production-en": {
      "serviceWorker": "ngsw-config.json",
      // ... otras configuraciones
    }
  }
}
```

#### Propiedades Clave

- **`serviceWorker: "ngsw-config.json"`**: 
  - Referencia al archivo de configuración del Service Worker
  - Angular genera automáticamente `ngsw-worker.js` durante el build

- **`outputHashing: "all"`**: 
  - Agrega hash a los nombres de archivos para cache busting
  - Permite actualizar recursos cuando cambian

- **`optimization: true`**: 
  - Activa optimizaciones de producción
  - Minifica código, elimina código muerto, etc.

#### Generación del Service Worker

Durante el build de producción, Angular:

1. Lee `ngsw-config.json`
2. Genera `ngsw-worker.js` con la lógica de cache
3. Genera `ngsw.json` con la lista de recursos a cachear
4. Incluye ambos archivos en el directorio de salida

---

## 6. Flujo de Funcionamiento

### Instalación de la PWA

1. **Usuario visita la aplicación** en un navegador compatible
2. **Navegador detecta el manifest** y muestra prompt de instalación
3. **Usuario instala la aplicación** (botón "Agregar a pantalla de inicio")
4. **Service Worker se registra** automáticamente
5. **Recursos se precargan** según `installMode: "prefetch"`

### Funcionamiento Offline

1. **Primera visita**: Service Worker cachea recursos según configuración
2. **Visitas posteriores**: Recursos se sirven desde cache
3. **Sin conexión**: La aplicación funciona completamente offline
4. **Actualizaciones**: Service Worker detecta cambios y actualiza cache en segundo plano

### Actualización de la Aplicación

1. **Nuevo build desplegado**: Archivos con nuevos hashes
2. **Service Worker detecta cambios**: Compara `ngsw.json` con versión cacheada
3. **Descarga actualizaciones**: Precarga nuevos recursos en segundo plano
4. **Aplica actualización**: Usuario recarga la página para ver cambios

---

## 7. Comandos y Workflow

### Build para Producción

```bash
# Build estándar
ng build --configuration=production

# Build en español
ng build --configuration=production-es

# Build en inglés
ng build --configuration=production-en
```

**Resultado**: 
- Se genera el Service Worker automáticamente
- Archivos en `dist/` listos para desplegar
- `ngsw-worker.js` y `ngsw.json` incluidos

### Servir Build de Producción Localmente

```bash
# Instalar servidor HTTP simple
npm install -g http-server

# Servir desde dist/
cd dist/touch-the-mole
http-server -p 8080 -c-1
```

**Nota**: El Service Worker solo funciona en producción o con HTTPS.

### Testing del Service Worker

#### En Desarrollo

El Service Worker está deshabilitado en desarrollo (`ng serve`). Para probarlo:

1. Hacer build de producción: `ng build --configuration=production`
2. Servir el build: `http-server -p 8080 dist/touch-the-mole`
3. Abrir en navegador: `http://localhost:8080`

#### Verificar Instalación

1. Abrir DevTools (F12)
2. Ir a la pestaña "Application" (Chrome) o "Storage" (Firefox)
3. Verificar:
   - **Service Workers**: Debe mostrar `ngsw-worker.js` activo
   - **Manifest**: Debe mostrar el manifest correctamente
   - **Cache Storage**: Debe mostrar grupos de cache (`app`, `assets`)

#### Verificar Funcionamiento Offline

1. Abrir DevTools → Network
2. Activar "Offline" en el throttling
3. Recargar la página
4. La aplicación debe funcionar normalmente

---

## 8. Mejores Prácticas

### Performance

1. **Prefetch estratégico**: Solo precargar recursos esenciales
2. **Lazy loading**: Cargar componentes bajo demanda
3. **Optimización de imágenes**: Usar formatos modernos (WebP, AVIF)
4. **Code splitting**: Dividir código en chunks más pequeños

### Actualizaciones

1. **Versionado**: Usar `outputHashing: "all"` para cache busting
2. **Estrategias de actualización**: Balancear entre `prefetch` y `lazy`
3. **Notificaciones**: Informar al usuario sobre actualizaciones disponibles

### Compatibilidad

1. **Fallbacks**: Proporcionar alternativas para navegadores sin soporte
2. **Íconos múltiples**: Incluir PNG en tamaños específicos además de SVG
3. **Testing**: Probar en múltiples navegadores y dispositivos

### Seguridad

1. **HTTPS requerido**: El Service Worker solo funciona en HTTPS (o localhost)
2. **Scope limitado**: Definir `scope` apropiado en el manifest
3. **Validación**: Verificar que el manifest sea válido

---

## 9. Troubleshooting

### Service Worker no se registra

**Causas posibles**:
- Estás en modo desarrollo (`ng serve`)
- No estás usando HTTPS (excepto localhost)
- El build no incluyó el Service Worker

**Solución**:
1. Hacer build de producción: `ng build --configuration=production`
2. Servir con HTTPS o usar localhost
3. Verificar que `ngsw-worker.js` existe en `dist/`

### La aplicación no funciona offline

**Causas posibles**:
- Recursos no están en los asset groups
- Service Worker no está activo
- Cache no se ha poblado

**Solución**:
1. Verificar `ngsw-config.json` incluye todos los recursos necesarios
2. Verificar Service Worker está activo en DevTools
3. Visitar la aplicación una vez online para poblar el cache

### Actualizaciones no se aplican

**Causas posibles**:
- `outputHashing` no está configurado
- Service Worker no detecta cambios
- Cache muy agresivo

**Solución**:
1. Verificar `outputHashing: "all"` en `angular.json`
2. Limpiar cache del navegador
3. Verificar `updateMode` en `ngsw-config.json`

### Manifest no se detecta

**Causas posibles**:
- Ruta incorrecta en `index.html`
- Manifest inválido (JSON mal formado)
- No servido con content-type correcto

**Solución**:
1. Verificar `<link rel="manifest" href="manifest.webmanifest">` en `index.html`
2. Validar JSON del manifest
3. Verificar servidor sirve manifest con `Content-Type: application/manifest+json`

---

## 10. Checklist de Implementación PWA

### Configuración Básica

- [x] Web App Manifest configurado
- [x] Service Worker configurado
- [x] Meta tags para PWA agregados
- [x] Íconos definidos en manifest
- [x] Service Worker registrado en `app.config.ts`

### Configuración de Build

- [x] `serviceWorker` configurado en `angular.json`
- [x] `outputHashing: "all"` para cache busting
- [x] Build de producción genera Service Worker

### Testing

- [ ] Service Worker se registra en producción
- [ ] Aplicación funciona offline
- [ ] Manifest se detecta correctamente
- [ ] Instalación funciona en dispositivos móviles
- [ ] Actualizaciones se aplican correctamente

### Optimizaciones Futuras

- [ ] Íconos PNG en múltiples tamaños (192x192, 512x512)
- [ ] Data groups para cachear respuestas de API
- [ ] Notificaciones push (si es necesario)
- [ ] Estrategias de actualización más granulares

---

## 11. Referencias

- [Angular Service Worker](https://angular.dev/guide/service-worker-intro)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 12. Resumen

La aplicación "Touch the Mole" está completamente configurada como PWA con:

1. **Web App Manifest** completo con metadatos y configuración
2. **Service Worker** configurado con estrategias de cache
3. **Meta tags** para soporte multiplataforma
4. **Build automatizado** que genera el Service Worker
5. **Funcionalidad offline** habilitada

La PWA permite:
- Instalación como aplicación nativa
- Funcionamiento offline completo
- Carga rápida de recursos cacheados
- Actualizaciones automáticas en segundo plano

---

## 13. Despliegue en GitHub Pages

### Objetivo

Esta sección describe la configuración completa para desplegar la aplicación PWA en GitHub Pages, incluyendo GitHub Actions workflow, manejo de routing de SPA, y configuración de base href dinámico.

### Archivos de Configuración

- **GitHub Actions Workflow**: `.github/workflows/deploy-gh-pages.yml`
- **404.html**: `public/404.html` (para manejo de routing)
- **Script de Build**: `package.json` (script `build:gh-pages`)

---

### 13.1. GitHub Actions Workflow

#### Archivo: `.github/workflows/deploy-gh-pages.yml`

El workflow automatiza el proceso de build y deploy a GitHub Pages.

#### Estructura del Workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write
```

#### Triggers

- **Push a `main` o `master`**: Despliega automáticamente cuando se hace push
- **`workflow_dispatch`**: Permite ejecutar manualmente desde GitHub Actions

#### Permisos

- **`contents: read`**: Leer el repositorio
- **`pages: write`**: Escribir en GitHub Pages
- **`id-token: write`**: Autenticación para GitHub Pages

#### Jobs

##### Job: `build`

1. **Checkout del código**
2. **Setup de Node.js** (versión 20 con cache de npm)
3. **Instalación de dependencias** (`npm ci`)
4. **Obtención del nombre del repositorio**
   - Detecta si es un repositorio de usuario (`username.github.io`) o proyecto
   - Calcula el base href apropiado
5. **Build con base href dinámico**
   - Si es `username.github.io`: base href = `/`
   - Si es proyecto: base href = `/repo-name/`
6. **Creación de 404.html dinámico**
   - Genera 404.html con el base href correcto
   - Redirige todas las rutas a `index.html` para que Angular maneje el routing
7. **Upload del artifact** para GitHub Pages

##### Job: `deploy`

1. **Deploy a GitHub Pages** usando el artifact generado

#### Base Href Dinámico

El workflow detecta automáticamente el tipo de repositorio:

```yaml
REPO_NAME=$(echo "${{ github.repository }}" | cut -d'/' -f2)
if [ "$REPO_NAME" = "${{ github.repository_owner }}.github.io" ]; then
  BASE_HREF="/"
else
  BASE_HREF="/$REPO_NAME/"
fi
```

**Ejemplos**:
- Repositorio: `username/touch-the-mole` → Base href: `/touch-the-mole/`
- Repositorio: `username/username.github.io` → Base href: `/`

---

### 13.2. Archivo 404.html

#### Archivo: `public/404.html`

GitHub Pages no soporta routing de SPA nativamente. Cuando un usuario accede directamente a una ruta como `/game`, GitHub Pages busca `/game/index.html`, que no existe.

#### Solución

El archivo `404.html` redirige todas las rutas a `index.html`, permitiendo que Angular Router maneje el routing.

#### Contenido

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Toca el Topo</title>
  <base href="/">
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/index.html'">
</head>
<body></body>
</html>
```

#### Funcionamiento

1. **Usuario accede a `/game`** directamente
2. **GitHub Pages no encuentra `/game/index.html`**
3. **GitHub Pages sirve `404.html`**
4. **`404.html` redirige a `/index.html`** con el base href correcto
5. **Angular Router maneja la ruta `/game`** correctamente

#### Nota

El workflow de GitHub Actions genera un `404.html` dinámico en el build con el base href correcto según el repositorio.

---

### 13.3. Scripts de Build

#### Archivo: `package.json`

Se agregó el script `build:gh-pages`:

```json
{
  "scripts": {
    "build:gh-pages": "ng build --configuration=production"
  }
}
```

#### Uso

El workflow de GitHub Actions usa este script:

```bash
npm run build:gh-pages -- --base-href="$BASE_HREF"
```

El flag `--base-href` se pasa dinámicamente según el tipo de repositorio.

---

### 13.4. Configuración en GitHub

#### Habilitar GitHub Pages

1. Ir a **Settings** → **Pages** en el repositorio
2. En **Source**, seleccionar:
   - **GitHub Actions** (recomendado)
   - O **Deploy from a branch** → `gh-pages` branch

#### Con GitHub Actions (Recomendado)

- El workflow se ejecuta automáticamente
- No se necesita rama `gh-pages`
- El deploy es más rápido y confiable

#### Con Branch `gh-pages`

1. El workflow crea/actualiza la rama `gh-pages`
2. En Settings → Pages, seleccionar branch `gh-pages`
3. La aplicación estará disponible en `https://username.github.io/repo-name/`

---

### 13.5. URLs de la Aplicación

#### Repositorio de Proyecto

Si el repositorio es `username/touch-the-mole`:
- **URL**: `https://username.github.io/touch-the-mole/`
- **Base href**: `/touch-the-mole/`
- **Rutas**: 
  - `https://username.github.io/touch-the-mole/home`
  - `https://username.github.io/touch-the-mole/game`

#### Repositorio de Usuario

Si el repositorio es `username/username.github.io`:
- **URL**: `https://username.github.io/`
- **Base href**: `/`
- **Rutas**:
  - `https://username.github.io/home`
  - `https://username.github.io/game`

---

### 13.6. Flujo de Despliegue

#### Automático (Push a main/master)

1. **Desarrollador hace push** a la rama `main` o `master`
2. **GitHub Actions se activa** automáticamente
3. **Workflow ejecuta build**:
   - Instala dependencias
   - Detecta tipo de repositorio
   - Calcula base href
   - Hace build con base href correcto
   - Genera 404.html dinámico
4. **Workflow despliega** a GitHub Pages
5. **Aplicación disponible** en unos minutos

#### Manual (workflow_dispatch)

1. Ir a **Actions** → **Deploy to GitHub Pages**
2. Click en **Run workflow**
3. Seleccionar rama y ejecutar
4. El proceso es el mismo que el automático

---

### 13.7. Service Worker en GitHub Pages

#### Compatibilidad

El Service Worker funciona correctamente en GitHub Pages porque:
- GitHub Pages proporciona HTTPS automáticamente
- El base href se configura correctamente
- Las rutas relativas funcionan correctamente

#### Verificación

1. Desplegar la aplicación
2. Abrir DevTools → Application
3. Verificar que `ngsw-worker.js` está activo
4. Verificar que el cache se está poblando

---

### 13.8. Troubleshooting GitHub Pages

#### La aplicación muestra 404 en rutas directas

**Causa**: El archivo `404.html` no se generó correctamente o no está en la raíz.

**Solución**:
1. Verificar que el workflow genera `404.html` en el build
2. Verificar que `404.html` está en la raíz del artifact
3. Verificar que GitHub Pages está configurado correctamente

#### Los assets no cargan

**Causa**: Base href incorrecto.

**Solución**:
1. Verificar el base href en el build
2. Verificar que el workflow calcula correctamente el base href
3. Verificar que el manifest y Service Worker usan rutas relativas

#### El Service Worker no funciona

**Causa**: HTTPS no está habilitado o base href incorrecto.

**Solución**:
1. GitHub Pages proporciona HTTPS automáticamente
2. Verificar que el base href es correcto
3. Verificar que `ngsw-worker.js` se genera en el build

#### Error: Bucle infinito y `/.html 404` en navegadores (excepto Chrome)

**Causa**: El Service Worker está intentando cargar recursos desde rutas absolutas que no respetan el `base-href`.

**Síntomas**:
- La aplicación funciona en Chrome pero falla en otros navegadores
- Error: `GET https://username.github.io/touchthemole/.html 404`
- Bucle infinito de redirecciones

**Solución**:
1. Verificar que `ngsw-config.json` usa rutas relativas (sin barra inicial `/`)
2. Verificar que el `index` en `ngsw-config.json` es `"index.html"` (no `"/index.html"`)
3. Verificar que los archivos en `assetGroups` usan rutas relativas
4. Verificar que el build se hace con `--base-href` correcto

**Ejemplo de configuración correcta**:
```json
{
  "index": "index.html",
  "assetGroups": [
    {
      "resources": {
        "files": [
          "favicon.ico",
          "index.html",
          "manifest.webmanifest"
        ]
      }
    }
  ]
}
```

#### El workflow falla

**Causa**: Permisos incorrectos o error en el build.

**Solución**:
1. Verificar permisos en el workflow (`pages: write`, `id-token: write`)
2. Verificar que `npm ci` instala correctamente
3. Verificar logs del workflow en GitHub Actions

---

### 13.9. Comandos Útiles

#### Build Local para GitHub Pages

```bash
# Build con base href para proyecto
ng build --configuration=production --base-href="/touch-the-mole/"

# Build con base href para repositorio de usuario
ng build --configuration=production --base-href="/"
```

#### Verificar Build Localmente

```bash
# Instalar servidor HTTP
npm install -g http-server

# Servir build
cd dist/touch-the-mole
http-server -p 8080
```

#### Testing de 404.html

1. Hacer build con base href correcto
2. Copiar `index.html` a `404.html` en `dist/`
3. Servir con `http-server`
4. Acceder directamente a `/game` y verificar redirección

---

### 13.10. Checklist de Despliegue

#### Configuración Inicial

- [x] GitHub Actions workflow creado
- [x] Archivo 404.html creado
- [x] Script build:gh-pages agregado
- [ ] GitHub Pages habilitado en Settings
- [ ] Permisos del workflow verificados

#### Primera Deploy

- [ ] Push a main/master ejecutado
- [ ] Workflow completado exitosamente
- [ ] Aplicación accesible en GitHub Pages
- [ ] Rutas funcionan correctamente
- [ ] Service Worker activo
- [ ] PWA instalable

#### Verificación Post-Deploy

- [ ] Aplicación carga correctamente
- [ ] Rutas directas funcionan (ej: `/game`)
- [ ] Assets cargan correctamente
- [ ] Service Worker cachea recursos
- [ ] Aplicación funciona offline
- [ ] Manifest detectado correctamente

---

### 13.11. Referencias GitHub Pages

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [Custom 404 Page](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
- [Angular Deployment](https://angular.dev/guide/deployment)

---

### 13.12. Resumen de GitHub Pages

La aplicación está completamente configurada para desplegarse en GitHub Pages con:

1. **GitHub Actions workflow** que automatiza build y deploy
2. **Base href dinámico** que se ajusta según el tipo de repositorio
3. **404.html** que maneja el routing de SPA
4. **Service Worker compatible** con GitHub Pages
5. **Deploy automático** en cada push a main/master

La configuración permite:
- Deploy automático sin intervención manual
- Funcionamiento correcto de rutas de Angular
- Service Worker y PWA funcionando en GitHub Pages
- Soporte para repositorios de proyecto y usuario
