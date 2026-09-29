# Guía de instalación local (Windows)

Sitio de Montalvan: Statamic 6 + Laravel 13, bilingüe (español `/` e inglés `/en/`).
El contenido son archivos dentro de `content/`, versionados en git.

## 1. Requisitos previos

Instalar y verificar que respondan en PowerShell:

| Herramienta | Versión | Verificar |
|---|---|---|
| PHP | 8.3 o superior | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js (incluye npm) | 20 o superior | `node -v` |
| Git | cualquiera | `git --version` |

Extensiones de PHP necesarias (en `php.ini`, sin `;` delante): `mbstring`, `openssl`, `fileinfo`, `curl`, `zip`, `gd`, `pdo_sqlite`, `sqlite3`.
Comprobar con `php -m`.

## 2. Clonar el repositorio

Necesitas que te hayan dado acceso como colaboradora al repo en GitHub.

```powershell
cd C:\dev
git clone https://github.com/pfiorino/web-montalvan.git
cd web-montalvan
```

## 3. Instalar dependencias de PHP

```powershell
composer install
```

Si Windows Defender bloquea o borra archivos, agrega la carpeta como exclusión (PowerShell como administrador) y repite:

```powershell
Add-MpPreference -ExclusionPath "C:\dev\web-montalvan"
Remove-Item -Recurse -Force vendor
composer install
```

## 4. Configuración

```powershell
Copy-Item .env.example .env
php artisan key:generate
```

Abrir `.env` y cambiar estas líneas:

```
APP_NAME="Montalvan"
APP_URL=http://localhost:8000
APP_LOCALE=es
STATAMIC_PRO_ENABLED=true
```

`STATAMIC_PRO_ENABLED=true` es necesario porque el sitio usa varios idiomas (multisitio). En local es gratis; en producción requiere licencia.

Luego:

```powershell
php artisan config:clear
```

## 5. Instalar dependencias del front

```powershell
npm install
npm run build
```

## 6. Levantar el sitio

Abrir dos terminales en la carpeta del proyecto.

Terminal 1:

```powershell
php artisan serve
```

Terminal 2 (solo si vas a tocar CSS o JS, recarga en vivo):

```powershell
npm run dev
```

- Sitio en español: http://localhost:8000
- Sitio en inglés: http://localhost:8000/en/
- Panel de administración: http://localhost:8000/cp

## 7. Entrar al panel

Ir a http://localhost:8000/cp e iniciar sesión con tu usuario y contraseña (los que te haya pasado el administrador).

Si aún no tienes usuario, crea uno propio desde la terminal:

```powershell
php please make:user
```

Responde nombre, email y contraseña. Cuando pregunte si es superusuario, responde según lo que corresponda.

## 8. Flujo de trabajo diario

Cada cambio de contenido en el panel se guarda como archivos en `content/` (y las imágenes subidas en `public/assets` o `storage`, según la configuración). Para compartirlo con el resto del equipo:

```powershell
git pull
git status
git add .
git commit -m "contenido: descripción del cambio"
git push
```

Buenas prácticas:

- Hacer `git pull` antes de empezar a editar, para no pisar cambios de otra persona.
- Avisar quién edita qué página, para evitar conflictos en los archivos YAML.
- No subir nunca el archivo `.env` (ya está ignorado en `.gitignore`).

## 9. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| `composer install` dice que el lock requiere PHP 8.4 | Actualizar el repo con `git pull` (el lock ya se corrigió) o instalar PHP 8.4 |
| Error "Statamic Pro is required to use multiple sites" | Poner `STATAMIC_PRO_ENABLED=true` en `.env` y correr `php artisan config:clear` |
| Cambios de CSS no se ven | Correr `npm run build` o dejar `npm run dev` abierto |
| Contenido que no aparece tras un `git pull` | `php please stache:clear` |
| Pantalla en blanco o error raro | Revisar `storage/logs/laravel.log` |
