# Game Catalog

Single-page Vue 3 application for browsing a catalog of games. The app includes client-side search, provider filtering, paginated results, and a game details page.

## Features

- Search games by name.
- Filter the list by provider.
- Paginate the catalog with URL-synced page state.
- Open a dedicated details page for each game.
- Load data either from local mock data or from a configurable external API.

## Tech Stack

- Vue 3
- Vite
- Pinia
- Vue Router
- Sass

## Getting Started

### Requirements

- Node.js `^20.19.0 || >=22.12.0`
- npm

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm run dev
```

### Type-check the project

```sh
npm run type-check
```

### Build for production

```sh
npm run build
```

### Preview the production build

```sh
npm run preview
```

## Data Source

By default, the app loads games from `public/mock-games.json`.

You can switch to a real API by creating a `.env` file in the project root:

```env
VITE_GAMES_API_URL=https://your-api.example.com/games
```

The API layer supports these response shapes:

- `[{ ...game }]`
- `{ games: [{ ...game }] }`
- `{ items: [{ ...game }] }`
- `{ data: [{ ...game }] }`

Each game item is expected to contain at least these fields:

```json
{
  "id": 1,
  "name": "Game 001",
  "provider": "NetEnt",
  "players": 30,
  "image": "https://example.com/image.jpg",
  "description": "Game description"
}
```

## Application Behavior

- Search text is stored in the URL as `q`.
- Selected provider is stored in the URL as `provider`.
- Current page is stored in the URL as `page`.
- Pagination resets to the first page when search or provider filter changes.

## Project Structure

```text
src/
  components/   Reusable UI parts such as search, filters, and game cards
  pages/        Route-level pages for the catalog and game details
  router/       Vue Router configuration
  services/     Data loading and API normalization
  store/        Pinia store for catalog state
public/
  mock-games.json
```
