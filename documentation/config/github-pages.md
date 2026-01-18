# Configuración de GitHub Pages

## Objetivo

Este documento describe la configuración completa para desplegar la aplicación Angular "Touch the Mole" en GitHub Pages usando GitHub Actions. Incluye el workflow automatizado, los comandos necesarios, y la explicación de cada paso del proceso.

## Ubicación de Archivos

- **Workflow de GitHub Actions**: `.github/workflows/deploy-gh-pages.yml`
- **Script de Build**: `package.json` (script `build:gh-pages`)
- **Archivo 404**: Generado dinámicamente en el workflow
- **Documentación**: `documentation/config/github-pages.md` (este archivo)

---

## 1. Workflow de GitHub Actions

### Archivo: `.github/workflows/deploy-gh-pages.yml`

El workflow automatiza completamente el proceso de build y deploy a GitHub Pages.

### Estructura del Workflow

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

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    # Job de construcción
  deploy:
    # Job de despliegue
```

### Triggers del Workflow

- **Push a `main` o `master`**: Se ejecuta automáticamente cuando se hace push a estas ramas
- **`workflow_dispatch`**: Permite ejecutar el workflow manualmente desde la interfaz de GitHub Actions

### Permisos Requeridos

- **`contents: read`**: Permite leer el contenido del repositorio
- **`pages: write`**: Permite escribir/desplegar en GitHub Pages
- **`id-token: write`**: Permite autenticación OIDC para GitHub Pages (requerido para acciones oficiales)

### Concurrency

- **`group: "pages"`**: Agrupa todas las ejecuciones del workflow
- **`cancel-in-progress: false`**: No cancela ejecuciones en progreso (permite múltiples deploys)

---

## 2. Job: `build`

### Paso 1: Checkout del Código

```yaml
- name: Checkout
  uses: actions/checkout@v4
```

**Comando equivalente**: `git checkout`

**Propósito**: Descarga el código del repositorio en el runner de GitHub Actions.

**Por qué se hace**: Necesitamos el código fuente para compilar la aplicación.

---

### Paso 2: Setup de Node.js

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

**Comando equivalente**: 
```bash
# Instalar Node.js 20
nvm install 20
nvm use 20

# Configurar cache de npm
npm config set cache ~/.npm
```

**Propósito**: 
- Instala Node.js versión 20 (compatible con Angular 20)
- Configura el cache de npm para acelerar instalaciones posteriores

**Por qué se hace**: 
- Angular 20 requiere Node.js 20.x o superior
- El cache reduce el tiempo de instalación de dependencias en ejecuciones posteriores

---

### Paso 3: Instalación de Dependencias

```yaml
- name: Install dependencies
  run: npm ci
```

**Comando**: `npm ci`

**Propósito**: Instala las dependencias del proyecto de forma limpia y determinística.

**Por qué se usa `npm ci` en lugar de `npm install`**:
- **Más rápido**: Omite actualizaciones y verificaciones innecesarias
- **Determinístico**: Usa exactamente las versiones de `package-lock.json`
- **Limpio**: Elimina `node_modules` antes de instalar (instalación limpia)
- **Ideal para CI/CD**: Garantiza builds reproducibles

**Equivalente local**:
```bash
# En tu máquina local, normalmente usarías:
npm install

# Pero en CI/CD se recomienda:
npm ci
```

---

### Paso 4: Obtención del Nombre del Repositorio

```yaml
- name: Get repository name
  id: repo
  run: |
    REPO_NAME=$(echo "${{ github.repository }}" | cut -d'/' -f2)
    echo "name=$REPO_NAME" >> $GITHUB_OUTPUT
    echo "Repository name: $REPO_NAME"
```

**Comando equivalente**:
```bash
# Si github.repository = "username/touch-the-mole"
REPO_NAME=$(echo "username/touch-the-mole" | cut -d'/' -f2)
# Resultado: REPO_NAME = "touch-the-mole"
```

**Propósito**: Extrae el nombre del repositorio (segunda parte después de `/`).

**Por qué se hace**: 
- Necesitamos el nombre para calcular el `base-href` correcto
- Los repositorios de proyecto usan `/repo-name/` como base
- Los repositorios de usuario (`username.github.io`) usan `/` como base

**Ejemplo**:
- Repositorio: `johndoe/touch-the-mole` → `REPO_NAME = "touch-the-mole"`
- Repositorio: `johndoe/johndoe.github.io` → `REPO_NAME = "johndoe.github.io"`

---

### Paso 5: Build para GitHub Pages

```yaml
- name: Build for GitHub Pages
  run: |
    REPO_NAME="${{ steps.repo.outputs.name }}"
    if [ "$REPO_NAME" = "${{ github.repository_owner }}.github.io" ]; then
      BASE_HREF="/"
    else
      BASE_HREF="/$REPO_NAME/"
    fi
    echo "Building with base-href: $BASE_HREF"
    npm run build:gh-pages -- --base-href="$BASE_HREF"
```

**Comandos ejecutados**:
```bash
# 1. Determinar base-href
if [ "$REPO_NAME" = "username.github.io" ]; then
  BASE_HREF="/"
else
  BASE_HREF="/touch-the-mole/"
fi

# 2. Ejecutar build con base-href
npm run build:gh-pages -- --base-href="$BASE_HREF"
```

**Desglose del comando `npm run build:gh-pages`**:

Según `package.json`:
```json
"build:gh-pages": "ng build --configuration=production"
```

**Comando completo equivalente**:
```bash
ng build --configuration=production --base-href="/touch-the-mole/"
```

**Explicación de cada parte**:

1. **`ng build`**: Comando de Angular CLI para compilar la aplicación
   - **Por qué**: Compila TypeScript a JavaScript, procesa templates, optimiza assets

2. **`--configuration=production`**: Usa la configuración de producción
   - **Por qué**: 
     - Habilita optimizaciones (minificación, tree-shaking)
     - Genera el Service Worker para PWA
     - Desactiva source maps (reducción de tamaño)
     - Aplica hash a los archivos para cache busting

3. **`--base-href="/touch-the-mole/"`**: Define la ruta base de la aplicación
   - **Por qué**: 
     - GitHub Pages sirve la aplicación en `https://username.github.io/touch-the-mole/`
     - Angular necesita saber esta ruta base para cargar assets y rutas correctamente
     - Sin esto, los assets (CSS, JS, imágenes) no se cargarían correctamente

**Lógica del base-href dinámico**:

```bash
# Si es repositorio de usuario (username.github.io)
BASE_HREF="/"  # La app está en la raíz

# Si es repositorio de proyecto (username/touch-the-mole)
BASE_HREF="/touch-the-mole/"  # La app está en /touch-the-mole/
```

**Resultado del build**:
- Archivos compilados en: `dist/touch-the-mole/browser/`
- Incluye: `index.html`, archivos JS, CSS, assets, Service Worker
- **Nota**: Angular 20 con `@angular/build:application` genera los archivos en el subdirectorio `browser/`

---

### Paso 6: Creación de 404.html

```yaml
- name: Create 404.html
  run: |
    REPO_NAME="${{ steps.repo.outputs.name }}"
    if [ "$REPO_NAME" = "${{ github.repository_owner }}.github.io" ]; then
      BASE_HREF="/"
    else
      BASE_HREF="/$REPO_NAME/"
    fi
    cat > dist/touch-the-mole/browser/404.html << EOF
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Toca el Topo</title>
      <base href="$BASE_HREF">
      <script>
        sessionStorage.redirect = location.href;
      </script>
      <meta http-equiv="refresh" content="0;URL='$BASE_HREFindex.html'">
    </head>
    <body></body>
    </html>
    EOF
```

**Comando equivalente**:
```bash
# Crear archivo 404.html con contenido específico
cat > dist/touch-the-mole/browser/404.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Toca el Topo</title>
  <base href="/touch-the-mole/">
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/touch-the-mole/index.html'">
</head>
<body></body>
</html>
EOF
```

**Propósito**: Crea un archivo `404.html` que redirige todas las rutas no encontradas a `index.html`.

**Por qué se hace**:
- GitHub Pages es un servidor de archivos estáticos
- No entiende el routing de Angular (SPA - Single Page Application)
- Cuando un usuario accede directamente a `/game`, GitHub Pages busca `game.html` que no existe
- El `404.html` captura estas rutas y redirige a `index.html`
- Angular Router entonces maneja la ruta correctamente en el cliente

**Explicación del contenido**:

1. **`<base href="/touch-the-mole/">`**: Define la ruta base (debe coincidir con el base-href del build)
2. **`sessionStorage.redirect`**: Guarda la URL original para que Angular pueda redirigir después
3. **`<meta http-equiv="refresh">`**: Redirige inmediatamente a `index.html`

**Ejemplo de flujo**:
1. Usuario accede a: `https://username.github.io/touch-the-mole/game`
2. GitHub Pages no encuentra `game.html`
3. Sirve `404.html` automáticamente
4. `404.html` redirige a `/touch-the-mole/index.html`
5. Angular carga y el Router navega a `/game`

---

### Paso 7: Creación de .nojekyll

```yaml
- name: Create .nojekyll
  run: touch dist/touch-the-mole/browser/.nojekyll
```

**Comando equivalente**:
```bash
touch dist/touch-the-mole/browser/.nojekyll
```

**Propósito**: Crea un archivo `.nojekyll` en el directorio de build para desactivar Jekyll en GitHub Pages.

**Por qué se hace**:
- GitHub Pages usa Jekyll por defecto para procesar archivos
- Jekyll puede procesar `README.md` y otros archivos que no queremos
- El archivo `.nojekyll` le dice a GitHub Pages que no use Jekyll
- Sin este archivo, GitHub Pages puede mostrar el `README.md` en lugar de `index.html`
- Es especialmente importante cuando se usa GitHub Actions como source

**Nota**: Aunque uses GitHub Actions, agregar `.nojekyll` garantiza que Jekyll no procese los archivos si hay alguna configuración incorrecta.

---

### Paso 8: Setup de Pages

```yaml
- name: Setup Pages
  uses: actions/configure-pages@v4
```

**Comando equivalente**: No tiene equivalente directo en consola (es una acción de GitHub).

**Propósito**: Configura el entorno de GitHub Pages en el runner.

**Por qué se hace**: 
- Prepara el entorno para el despliegue
- Verifica que GitHub Pages esté habilitado
- Configura las variables de entorno necesarias

---

### Paso 9: Upload del Artifact

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist/touch-the-mole/browser'
```

**Comando equivalente**:
```bash
# Comprimir y subir el directorio
tar -czf artifact.tar.gz -C dist/touch-the-mole/browser .
# Subir a GitHub (acción interna)
```

**Propósito**: Sube el directorio compilado como artifact para que el job `deploy` lo use.

**Por qué se hace**:
- Los jobs de GitHub Actions son independientes
- El job `build` se ejecuta en un runner
- El job `deploy` se ejecuta en otro runner
- Necesitamos transferir los archivos compilados entre jobs
- El artifact es el mecanismo para hacer esto

**Nota importante**: 
- Angular 20 con `@angular/build:application` genera los archivos en `dist/touch-the-mole/browser/`
- El path del artifact debe apuntar a `./dist/touch-the-mole/browser` (no a `./dist/touch-the-mole`)
- Si el path es incorrecto, GitHub Pages mostrará el `README.md` en lugar de la aplicación

**Contenido del artifact**:
- `.nojekyll` - Archivo para desactivar Jekyll
- `index.html` - Página principal
- `404.html` - Página de redirección
- Archivos JS compilados (con hash)
- Archivos CSS compilados (con hash)
- Assets (imágenes, iconos, etc.)
- Service Worker (`ngsw-worker.js`, `ngsw.json`)

---

## 3. Job: `deploy`

### Paso 1: Deploy a GitHub Pages

```yaml
deploy:
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

**Comando equivalente**: No tiene equivalente directo (es una acción de GitHub).

**Propósito**: Despliega el artifact generado en el job `build` a GitHub Pages.

**Explicación**:

1. **`environment: name: github-pages`**: 
   - Define el environment de GitHub Pages
   - Requiere aprobación si está configurado (opcional)
   - Permite protección de ramas

2. **`needs: build`**: 
   - El job `deploy` espera a que `build` termine exitosamente
   - Garantiza que el artifact esté disponible antes de desplegar

3. **`actions/deploy-pages@v4`**: 
   - Acción oficial de GitHub para desplegar a Pages
   - Toma el artifact del job `build`
   - Lo despliega al servidor de GitHub Pages
   - Genera la URL pública de la aplicación

**Resultado**:
- La aplicación está disponible en: `https://username.github.io/touch-the-mole/`
- O en: `https://username.github.io/` (si es repositorio de usuario)

---

## 4. Comandos de Consola Explicados

### Comandos del Workflow

#### `npm ci`

**Qué hace**: Instala dependencias de forma limpia y determinística.

**Por qué se usa en CI/CD**:
- Más rápido que `npm install`
- Usa exactamente las versiones de `package-lock.json`
- Elimina `node_modules` antes de instalar (instalación limpia)
- Garantiza builds reproducibles

**Equivalente local**:
```bash
# En desarrollo local normalmente usas:
npm install

# Pero para CI/CD o cuando quieres instalación limpia:
npm ci
```

**Cuándo usarlo**:
- ✅ En CI/CD (GitHub Actions, Jenkins, etc.)
- ✅ Cuando quieres garantizar versiones exactas
- ✅ Cuando `package-lock.json` está actualizado
- ❌ NO usar si `package-lock.json` está desactualizado

---

#### `npm run build:gh-pages`

**Qué hace**: Compila la aplicación Angular para producción.

**Desglose del comando**:

Según `package.json`:
```json
"build:gh-pages": "ng build --configuration=production"
```

**Comando completo**:
```bash
ng build --configuration=production
```

**Qué hace cada parte**:

1. **`ng build`**: 
   - Compila TypeScript a JavaScript
   - Procesa templates HTML
   - Compila estilos SCSS a CSS
   - Optimiza y minifica código
   - Genera Service Worker (si está configurado)

2. **`--configuration=production`**: 
   - Usa la configuración de producción de `angular.json`
   - Habilita optimizaciones:
     - Minificación de JS y CSS
     - Tree-shaking (elimina código no usado)
     - AOT (Ahead-of-Time) compilation
     - Source maps desactivados
     - Hash en nombres de archivos para cache busting

**Resultado**:
- Archivos en: `dist/touch-the-mole/browser/`
- `.nojekyll` - Archivo para desactivar Jekyll (creado manualmente en el workflow)
- `index.html` - Página principal
- `main.[hash].js` - Código JavaScript principal
- `polyfills.[hash].js` - Polyfills
- `styles.[hash].css` - Estilos compilados
- `ngsw-worker.js` - Service Worker
- `ngsw.json` - Configuración del Service Worker
- Assets (imágenes, iconos, etc.)

**Nota**: Angular 20 con `@angular/build:application` genera los archivos en el subdirectorio `browser/` por defecto.

**Equivalente local para probar**:
```bash
# Build local para probar
npm run build:gh-pages

# O con base-href específico
ng build --configuration=production --base-href="/touch-the-mole/"

# Servir localmente para probar
npx http-server dist/touch-the-mole/browser -p 8080
```

---

#### `--base-href="/touch-the-mole/"`

**Qué hace**: Define la ruta base de la aplicación.

**Por qué es necesario**:
- GitHub Pages sirve la app en una subruta: `https://username.github.io/touch-the-mole/`
- Angular necesita saber esta ruta para:
  - Cargar assets correctamente (`/touch-the-mole/styles.css`)
  - Generar rutas correctas (`/touch-the-mole/game`)
  - Configurar el Router correctamente

**Sin base-href**:
- Angular asume que la app está en la raíz (`/`)
- Los assets se buscarían en: `https://username.github.io/styles.css` ❌
- No se cargarían correctamente

**Con base-href**:
- Angular sabe que la app está en `/touch-the-mole/`
- Los assets se buscan en: `https://username.github.io/touch-the-mole/styles.css` ✅
- Todo funciona correctamente

**Ejemplo de uso**:
```bash
# Para repositorio de proyecto
ng build --base-href="/touch-the-mole/"

# Para repositorio de usuario (username.github.io)
ng build --base-href="/"
```

---

### Comandos Adicionales Útiles

#### Verificar el Build Localmente

```bash
# 1. Hacer build
npm run build:gh-pages -- --base-href="/touch-the-mole/"

# 2. Servir localmente para probar
npx http-server dist/touch-the-mole/browser -p 8080

# 3. Acceder a http://localhost:8080/touch-the-mole/
```

**Por qué hacer esto**:
- Verificar que el build funciona antes de hacer push
- Probar que las rutas funcionan correctamente
- Verificar que los assets se cargan

---

#### Verificar el Artifact en GitHub Actions

Después de que el workflow se ejecute:

1. Ir a **Actions** → Seleccionar el workflow ejecutado
2. Click en el job **build**
3. Scroll hasta **Upload artifact**
4. Descargar el artifact para inspeccionar su contenido

**Por qué hacer esto**:
- Verificar que todos los archivos están presentes
- Verificar que `404.html` se creó correctamente
- Verificar que `.nojekyll` está presente
- Verificar que el Service Worker está incluido
- Verificar que `index.html` está en la raíz del artifact

---

## 5. Configuración en GitHub

### Habilitar GitHub Pages

1. Ir a **Settings** → **Pages** en el repositorio
2. En **Source**, seleccionar: **"GitHub Actions"**
3. Guardar los cambios

**Por qué "GitHub Actions" y no "Deploy from a branch"**:
- **GitHub Actions**: Usa el workflow personalizado (recomendado)
- **Deploy from a branch**: Usa Jekyll automáticamente (no funciona para Angular)

### Verificar Permisos

1. Ir a **Settings** → **Actions** → **General**
2. En **Workflow permissions**, verificar:
   - **Read and write permissions** (recomendado)
   - O **Read repository contents and packages permissions** con permisos adicionales

**Por qué se necesitan estos permisos**:
- El workflow necesita leer el código (`contents: read`)
- El workflow necesita escribir en GitHub Pages (`pages: write`)
- El workflow necesita autenticación OIDC (`id-token: write`)

---

## 6. Flujo Completo de Despliegue

### Flujo Automático (Push a main/master)

```
1. Desarrollador hace push a main/master
   ↓
2. GitHub Actions detecta el push
   ↓
3. Workflow se ejecuta automáticamente
   ↓
4. Job "build" se ejecuta:
   - Checkout del código
   - Setup Node.js 20
   - npm ci (instalar dependencias)
   - Calcular base-href dinámico
   - npm run build:gh-pages (compilar)
   - Crear 404.html en dist/touch-the-mole/browser/
   - Crear .nojekyll en dist/touch-the-mole/browser/
   - Subir artifact desde dist/touch-the-mole/browser/
   ↓
5. Job "deploy" se ejecuta:
   - Espera a que "build" termine
   - Despliega artifact a GitHub Pages
   ↓
6. Aplicación disponible en GitHub Pages
   (típicamente en 1-2 minutos)
```

### Flujo Manual (workflow_dispatch)

```
1. Ir a Actions → "Deploy to GitHub Pages"
   ↓
2. Click en "Run workflow"
   ↓
3. Seleccionar rama y ejecutar
   ↓
4. Mismo proceso que el automático
```

---

## 7. URLs de la Aplicación

### Repositorio de Proyecto

Si el repositorio es `username/touch-the-mole`:

- **URL base**: `https://username.github.io/touch-the-mole/`
- **Base href**: `/touch-the-mole/`
- **Rutas**:
  - `https://username.github.io/touch-the-mole/` → Home
  - `https://username.github.io/touch-the-mole/home` → Home
  - `https://username.github.io/touch-the-mole/game` → Game

### Repositorio de Usuario

Si el repositorio es `username/username.github.io`:

- **URL base**: `https://username.github.io/`
- **Base href**: `/`
- **Rutas**:
  - `https://username.github.io/` → Home
  - `https://username.github.io/home` → Home
  - `https://username.github.io/game` → Game

---

## 8. Troubleshooting

### Error: "Get Pages site failed"

**Causa**: GitHub Pages no está habilitado o no está configurado para usar GitHub Actions.

**Solución**:
1. Ir a **Settings** → **Pages**
2. Seleccionar **"GitHub Actions"** como fuente
3. Guardar

---

### Error: Aparece el README.md en lugar de la aplicación

**Causa**: El path del artifact es incorrecto o falta el archivo `.nojekyll`.

**Síntomas**:
- Al acceder a la URL de GitHub Pages, se muestra el contenido del `README.md`
- No se carga la aplicación Angular

**Solución**:
1. **Verificar el path del artifact**: Debe ser `./dist/touch-the-mole/browser` (no `./dist/touch-the-mole`)
   - Angular 20 con `@angular/build:application` genera los archivos en el subdirectorio `browser/`
   - El workflow debe subir desde `dist/touch-the-mole/browser/`
2. **Verificar que `.nojekyll` existe**: El workflow debe crear `dist/touch-the-mole/browser/.nojekyll`
3. **Verificar configuración de GitHub Pages**: Debe estar configurado para usar "GitHub Actions" como source

**Verificar en el workflow**:
```yaml
- name: Create .nojekyll
  run: touch dist/touch-the-mole/browser/.nojekyll

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist/touch-the-mole/browser'  # ← Path correcto
```

---

### Error: Jekyll está procesando el sitio

**Causa**: GitHub Pages está usando Jekyll en lugar de GitHub Actions, o falta el archivo `.nojekyll`.

**Solución**:
1. Cambiar la fuente a **"GitHub Actions"** en Settings → Pages
2. Verificar que el archivo `.nojekyll` se crea en el workflow (ya está implementado en el Paso 7)

**Nota**: El workflow actual ya incluye la creación de `.nojekyll` en `dist/touch-the-mole/browser/.nojekyll`.

---

### Error: Assets no se cargan

**Causa**: Base href incorrecto o no configurado.

**Solución**:
1. Verificar que el base-href en el build coincida con la URL del repositorio
2. Verificar que el `404.html` tenga el mismo base-href
3. Verificar en el navegador la consola para ver qué rutas está intentando cargar

---

### Error: Rutas directas no funcionan

**Causa**: `404.html` no está presente o tiene base-href incorrecto.

**Solución**:
1. Verificar que `404.html` se crea en el workflow
2. Verificar que el base-href en `404.html` es correcto
3. Verificar que `404.html` está en el artifact

---

## 9. Verificación Post-Deploy

### Checklist de Verificación

Después de que el workflow se ejecute exitosamente:

- [ ] Workflow completó sin errores
- [ ] Aplicación accesible en la URL de GitHub Pages
- [ ] Página principal carga correctamente
- [ ] Rutas directas funcionan (ej: `/game`)
- [ ] Assets cargan correctamente (CSS, JS, imágenes)
- [ ] Service Worker está activo (verificar en DevTools → Application → Service Workers)
- [ ] PWA es instalable (verificar en DevTools → Application → Manifest)
- [ ] Aplicación funciona offline (desactivar red y probar)

### Comandos para Verificar Localmente

```bash
# 1. Hacer build con el mismo base-href que GitHub Pages
npm run build:gh-pages -- --base-href="/touch-the-mole/"

# 2. Crear 404.html manualmente
cat > dist/touch-the-mole/browser/404.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Toca el Topo</title>
  <base href="/touch-the-mole/">
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/touch-the-mole/index.html'">
</head>
<body></body>
</html>
EOF

# 3. Crear .nojekyll
touch dist/touch-the-mole/browser/.nojekyll

# 4. Servir localmente
npx http-server dist/touch-the-mole/browser -p 8080

# 5. Acceder a http://localhost:8080/touch-the-mole/
# 6. Probar rutas directas: http://localhost:8080/touch-the-mole/game
```

---

## 10. Mejoras Opcionales

### Verificación de Build

Agregar verificación para asegurar que los archivos críticos estén presentes:

```yaml
- name: Verify build output
  run: |
    if [ ! -f "dist/touch-the-mole/browser/index.html" ]; then
      echo "Error: index.html not found"
      exit 1
    fi
    if [ ! -f "dist/touch-the-mole/browser/404.html" ]; then
      echo "Error: 404.html not found"
      exit 1
    fi
    if [ ! -f "dist/touch-the-mole/browser/.nojekyll" ]; then
      echo "Error: .nojekyll not found"
      exit 1
    fi
    echo "Build verification passed"
```

**Por qué**: Verifica que los archivos críticos estén presentes antes de subir el artifact.

**Nota**: El archivo `.nojekyll` ya está incluido en el workflow actual (Paso 7).

---

### Agregar Verificación de Build

```yaml
- name: Verify build output
  run: |
    if [ ! -f "dist/touch-the-mole/index.html" ]; then
      echo "Error: index.html not found"
      exit 1
    fi
    if [ ! -f "dist/touch-the-mole/404.html" ]; then
      echo "Error: 404.html not found"
      exit 1
    fi
    echo "Build verification passed"
```

**Por qué**: Verifica que los archivos críticos estén presentes antes de subir el artifact.

---

## 11. Referencias

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Angular Deployment Guide](https://angular.dev/guide/deployment)

---

## 12. Resumen

El workflow de GitHub Pages está completamente configurado y automatizado:

1. **Build automático**: Compila la aplicación Angular con el base-href correcto
2. **404.html dinámico**: Crea el archivo de redirección con el base-href correcto en `dist/touch-the-mole/browser/`
3. **Archivo .nojekyll**: Crea `.nojekyll` para desactivar Jekyll y evitar que se muestre el README.md
4. **Path correcto del artifact**: Sube desde `dist/touch-the-mole/browser/` (donde Angular 20 genera los archivos)
5. **Deploy automático**: Despliega a GitHub Pages sin intervención manual
6. **Base href dinámico**: Se ajusta automáticamente según el tipo de repositorio
7. **Service Worker compatible**: Funciona correctamente en GitHub Pages

**Comandos clave**:
- `npm ci` - Instalación limpia de dependencias
- `npm run build:gh-pages` - Build de producción
- `--base-href` - Configuración de ruta base para GitHub Pages

**Configuración requerida en GitHub**:
- Settings → Pages → Source: **"GitHub Actions"**
- Settings → Actions → Workflow permissions: **"Read and write permissions"**
