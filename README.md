# Sportian – Frontend React (Arquitectura y Decisiones Técnicas)

Este documento resume la arquitectura elegida, las decisiones técnicas en paginación, cache y performance, la separación de capas, la estrategia de testing y un roadmap de mejoras.

## Stack

- React 18 + TypeScript + Vite
- React Router para ruteo
- TanStack Query (React Query) para cache y fetching
- MUI para UI
- Jest + Testing Library para tests

## Arquitectura

- Estructura por dominio (feature-first):
  - `src/modules/players` concentra UI y lógica de “Jugadores”.
    - `features/`: componentes de página/feature (listado y detalle)
    - `hooks/`: hooks de datos y estado de UI
    - `route.tsx`: definición de rutas del módulo, integradas en `shared/routes.ts` y consumidas en `App.tsx`
  - `src/shared`: cross-cutting concerns (layouts, theme, componentes UI reutilizables como Card)
  - `src/services`: acceso a APIs (fetch)
- Layout compuesto: `MainLayout` con Header/Content/Footer.
- Ruteo centralizado: lista de rutas agregada en `routesApp` para facilitar escalado.

Referencias:

- App: src/App.tsx
- Rutas: src/shared/routes.ts y src/modules/players/route.tsx
- Layout: src/shared/layouts/mainLayout.tsx
- UI base: src/shared/ui/card.tsx

## Datos y Cache

- Fuente de datos: endpoint en `src/services/players.ts`.
- Cache con React Query:
  - Hook de lista: `src/modules/players/hooks/usePlayers.ts`
    - `queryKey: ['players']`
    - `staleTime: 5 min` (datos frescos sin re-fetch)
    - `gcTime: 24 h` (persistencia en caché)
    - `networkMode: 'offlineFirst'` (prioriza caché y actualiza en segundo plano)
  - Hook de detalle: `src/modules/players/hooks/usePlayer.ts`
    - Selección por id desde la lista cacheada
    - `isNotFound` para 404 local si el jugador no existe

Beneficios:

- Menos llamadas de red, UX fluida y resiliente a offline.
- Estado de carga, error y éxito unificados por React Query.

## Paginación

- Paginación de cliente (virtual) en `src/modules/players/hooks/useInfinitePlayers.ts`:
  - Tamaño de página `PAGE_SIZE = 20`.
  - Cálculo de items visibles por “slice” de la lista cacheada.
  - `hasNextPage` según visibles vs total.
  - Control de carrera con `isLoadingMoreRef` para evitar dobles cargas.
  - Sincronización de totales con `useEffect` y refs para respetar las reglas de React.
- Disparo de “cargar más” por `IntersectionObserver` en `features/list.tsx` con `threshold: 0.1` y `rootMargin: '100px'`.

Motivación:

- El endpoint retorna una lista completa; se opta por paginar en cliente para simplicidad y velocidad percibida.

Limitaciones:

- Con listas muy grandes conviene migrar a paginación server-side.

## Performance

- Memoización y estabilidad:
  - Componentes memoizados (e.g., Card, PlayerCard, StatBar).
  - `useMemo` para datos derivados; `useCallback` para handlers.
  - Reglas de refs: no leer/escribir durante render; sincronizar en `useEffect`.
- Render escalable:
  - IntersectionObserver evita listeners de scroll globales y reduce trabajo innecesario.
  - Skeletons y feedback de carga para UX.

## Separación de Capas

- Presentación: `features/` (vistas y composición de UI).
- Lógica de UI: `modules/players/hooks`.
- Acceso a datos: `services/` (fetch).
- Ruteo: `modules/<domain>/route.tsx` + `shared/routes.ts`.
- Cross-cutting: `shared/` (layouts, tema, UI base).

## Estrategia de Testing

- Herramientas: Jest + @testing-library/react.
- Cobertura:
  - Hooks de datos: `usePlayers`, `usePlayer`
  - Paginación: `useInfinitePlayers`
  - IntersectionObserver: `useIntersectionObserver`
  - Páginas: `ListPlayers` y `DetailPlayers` con estados loading/success/error
- Prácticas:
  - Mock de `fetch` global; evita acoplar a ESM/bundler.
  - Wrappers con `QueryClientProvider` y `MemoryRouter`.
  - Polyfills controlados en `src/test/setup.ts`.

## Roadmap de Mejora

- Paginación server-side:
  - Parametrizar `services/players` con `page` y `limit` cuando el backend lo soporte.
  - Llaves de caché por página/criterios y “infinite query” real en React Query.
- Virtualización de lista:
  - Integrar `react-window` para cientos/miles de ítems.
- Prefetch y Data Layer:
  - Prefetch de detalle al hover/near viewport.
  - Normalización de entidades si crece la complejidad.
- Observabilidad y calidad:
  - Budgets de performance, medición de render.
  - E2E (Playwright/Cypress) y CI con lint, typecheck, tests.
- Accesibilidad:
  - Roles/labels consistentes y auditorías a11y.
- Dockerización:
  - Imagen multi-stage con Node para build y Nginx para servir `dist` con fallback SPA.
  - Construcción: `docker build -t sportian:prod .`
  - Ejecución: `docker run --rm -p 8080:80 sportian:prod` y abrir http://localhost:8080
  - El backend debe estar disponible para las rutas `/api/*` en el mismo dominio o vía proxy externo.

## Scripts

- `npm run dev`: entorno de desarrollo
- `npm run test`: correr tests
- `npm run lint`: ejecutar ESLint

## Cómo levantar el proyecto (local)

- Requisitos: Node 20+, npm 10+
- Instalar dependencias:

```bash
npm ci
```

- Desarrollo (Vite):

```bash
npm run dev
# Abrir http://localhost:5173
```

- Build de producción:

```bash
npm run build
```

- Preview del build:

```bash
npm run preview
# Abrir http://localhost:4173
```

## Levantar con Docker

- Construir imagen:

```bash
docker build -t sportian:prod .
```

- Ejecutar contenedor:

```bash
docker run --rm -p 8080:80 sportian:prod
# Abrir http://localhost:8080
```

Notas:

- El fallback SPA está configurado en Nginx (nginx.conf) para soportar React Router.
- Las rutas `/api/*` deben resolverse en el mismo dominio o mediante un proxy externo.

### Proxy de API en producción (Nginx)

- En desarrollo, Vite proxy-a `/api/ea` → `https://drop-api.ea.com`.
- En producción Docker, Nginx replica ese comportamiento:
  - Archivo: `nginx.conf`
  - Regla relevante:

```nginx
location /api/ea/ {
  proxy_pass https://drop-api.ea.com/;
  proxy_set_header Host drop-api.ea.com;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

- Si modificas `nginx.conf`, reconstruye la imagen:

```bash
docker build -t sportian:prod .
```

## Solución de problemas

- Puerto 8080 ocupado:
  - Ejecutar en otro puerto:
    ```bash
    docker run --rm -p 8081:80 sportian:prod
    # http://localhost:8081
    ```
  - O liberar el puerto:
    ```bash
    docker ps --format '{{.ID}}\t{{.Names}}\t{{.Ports}}' | grep 0.0.0.0:8080
    docker stop <CONTAINER_ID_OR_NAME>
    docker rm <CONTAINER_ID_OR_NAME>
    # Si es un proceso local:
    lsof -i :8080
    sudo lsof -iTCP:8080 -sTCP:LISTEN
    kill -9 <PID>
    ```

- No carga jugadores en Docker:
  - Asegúrate de tener el bloque de proxy `/api/ea` en `nginx.conf`.
  - Reconstruye la imagen después de cambios:
    ```bash
    docker build -t sportian:prod .
    docker run --rm -p 8080:80 sportian:prod
    ```
