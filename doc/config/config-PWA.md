# Configuración PWA (Progressive Web App)

## Objetivo

Este documento describe la configuración completa de Progressive Web App (PWA) en la aplicación "Touch the Mole". Incluye la configuración del Service Worker, Web App Manifest, meta tags, y estrategias de cache para habilitar funcionalidad offline e instalación como aplicación nativa.

## Ubicación de Archivos

- **Manifest**: `public/manifest.webmanifest`
- **Service Worker Config**: `ngsw-config.json`
- **Configuración de App**: `src/app/app.config.ts`
- **HTML Principal**: `src/index.html`
- **Build Config**: `angular.json`

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
  "index": "/index.html",
  "assetGroups": [...],
  "dataGroups": []
}
```

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
      "/favicon.ico",
      "/index.csr.html",
      "/index.html",
      "/manifest.webmanifest",
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
