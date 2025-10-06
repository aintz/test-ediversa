# Test Ediversa – Turborepo con Next.js y librería UI

Este proyecto es un **monorepo configurado con Turborepo** que contiene una aplicación Next.js (PokeDex) y una librería de componentes UI compilable y reutilizable.

La aplicación consume la **[PokeAPI](https://pokeapi.co/)** para mostrar una Pokédex interactiva con paginación, búsqueda y modales de detalle.

---

## Estructura del proyecto

```
turbo-repo/
│
├── apps/
│   └── pokedex/                # Aplicación principal Next.js
│
└── packages/
    ├── ui/                     # Librería de componentes (Button, Modal, PageTitle)
```

---

## Tecnologías principales

- [Turborepo](https://turbo.build/repo) — gestión de monorepos  
- [Next.js 14](https://nextjs.org/) — framework React con SSR  
- [React Query (TanStack)](https://tanstack.com/query/latest) — manejo de datos asíncronos  
- [TypeScript](https://www.typescriptlang.org/) — tipado estático  
- [React Table](https://tanstack.com/table) — renderizado de tablas  
- [CSS Modules](https://nextjs.org/docs/basic-features/built-in-css-support) — estilos modulares  
- [PokeAPI](https://pokeapi.co/) — API pública para datos de Pokémon  

---

## Instalación

Clona el repositorio e instala las dependencias con tu gestor preferido (`pnpm` recomendado):

```bash
# Clonar el repositorio
git clone https://github.com/aintz/test-ediversa.git

cd test-ediversa

# Instalar dependencias
pnpm install
```

> Si usas `npm` o `yarn`, también funciona, pero Turborepo está optimizado para `pnpm`.

---

## Compilar la librería UI

La librería `packages/ui` contiene componentes reutilizables (Button, Modal, PageTitle) que pueden importarse desde la app Next.js.

Para compilar la librería:

```bash
cd packages/ui
pnpm run build
```

Esto generará la carpeta `dist/` con los componentes compilados listos para usar.

### Componentes incluidos

| Componente   | Descripción |
|---------------|-------------|
| `Button`      | Botón base reutilizable |
| `Modal`       | Modal simple con contenido dinámico |
| `PageTitle`   | Encabezado con título e imagen |

---

## Ejecutar la aplicación Next.js

Una vez compilada la librería, ejecuta la app web desde la raíz del monorepo:

```bash
# Desde la raíz del proyecto
pnpm run dev --filter=web
```

O con el comando Turborepo directo:

```bash
turbo run dev --filter=web
```

Esto iniciará el servidor de desarrollo en  
👉 **http://localhost:3000**

---

## Ejemplo de uso de la librería en la app Next.js

En la aplicación `apps/web`, el componente `PageTitle` se importa directamente desde el paquete `ui`:

```tsx
import PageTitle from "@repo/ui/PageTitle";

export default function HomePage() {
  return (
    <main>
      <PageTitle title="Pokédex" imageUrl="/pokemon-logo.png" />
    </main>
  );
}
```

Y se utiliza en la página principal junto con los componentes de tabla y modal para mostrar los Pokémon obtenidos desde la API.

---

## Scripts principales

| Comando | Descripción |
|----------|-------------|
| `pnpm install` | Instala dependencias |
| `pnpm build` | Compila todos los paquetes |
| `pnpm dev` | Inicia el entorno de desarrollo |
| `pnpm lint` | Ejecuta linter en todos los workspaces |

---

## Autor

Desarrollado por **Aintzane**  
Diseño y desarrollo de la arquitectura Turborepo + Next.js + UI Library.

---

## Posibles mejoras
- Documentación de componentes con Storybook.
- **Ordenamiento completo:** Actualmente, el ordenamiento de la tabla solo funciona para la columna de *Nombre*. Debería ampliarse para que sea funcional también en las columnas de *XP Base*, *Tipos*, *Habilidades*, etc.  
- **Compatibilidad sin JavaScript:** En la versión estática (sin JS activado) falta implementar las funcionalidades de búsqueda y navegación entre páginas.  
- **Mejoras de UI/UX:** Podría incorporarse paginación más visual, filtros por tipo de Pokémon y una vista de detalles más rica (sprites adicionales, estadísticas, etc.).  

---

## Licencia

Proyecto personal. Todos los derechos reservados.
