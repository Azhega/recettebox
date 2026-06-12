# RecetteBox

App mobile de recettes built with Expo + React Native.

## Lancement

```bash
npm install
npx expo start
```

Scanne le QR code avec **Expo Go** (iOS/Android).

## Stack

- Expo / React Native
- React Navigation (Stack + Bottom Tabs)
- Redux Toolkit + redux-persist + AsyncStorage
- API : [TheMealDB](https://www.themealdb.com/)

## Fonctionnalités

- [x] Recherche de recettes via l'API TheMealDB
- [x] Liste avec `FlatList` + composant `RecipeCard` réutilisable
- [x] Écran détail (image, ingrédients, instructions)
- [x] Favoris gérés via Redux (`favoritesSlice`)
- [x] Favoris persistés au redémarrage (`redux-persist` + `AsyncStorage`)
- [x] Écran "Favoris" avec état vide
- [x] États loading / erreur / vide sur chaque écran
- [x] Navigation par onglets (Accueil / Favoris)

## Structure

```
src/
  api/         → meals.ts (fetch TheMealDB)
  store/       → store.ts, hooks.ts, slices/favoritesSlice.ts
  screens/     → HomeScreen, DetailScreen, FavoritesScreen
  components/  → RecipeCard
App.tsx        → Provider + PersistGate + Navigation
```
