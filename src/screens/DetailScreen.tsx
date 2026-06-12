import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getMealById, Meal } from '../api/meals';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

function getIngredients(meal: Meal): string[] {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient?.trim()) {
      ingredients.push(`${measure?.trim() ?? ''} ${ingredient.trim()}`.trim());
    }
  }
  return ingredients;
}

export default function DetailScreen({ route }: Props) {
  const { id } = route.params;
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFav = favorites.some((m) => m.idMeal === id);

  useEffect(() => {
    getMealById(id)
      .then(setMeal)
      .catch(() => setError('Impossible de charger la recette.'))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleFavorite() {
    if (!meal) return;
    if (isFav) dispatch(removeFavorite(meal.idMeal));
    else dispatch(addFavorite(meal));
  }

  if (loading) return <ActivityIndicator style={styles.centered} color="#C4622D" size="large" />;
  if (error || !meal) return <Text style={styles.errorText}>{error ?? 'Recette introuvable.'}</Text>;

  const ingredients = getIngredients(meal);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

      <View style={styles.header}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
          <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {meal.strCategory && (
        <Text style={styles.meta}>{meal.strCategory}{meal.strArea ? ` · ${meal.strArea}` : ''}</Text>
      )}

      <Text style={styles.sectionTitle}>Ingrédients</Text>
      {ingredients.map((ing, idx) => (
        <Text key={idx} style={styles.ingredient}>• {ing}</Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{meal.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F1' },
  content: { paddingBottom: 40 },
  centered: { flex: 1, marginTop: 80 },
  errorText: { textAlign: 'center', color: '#C0392B', marginTop: 60, fontSize: 15 },
  image: { width: '100%', height: 260 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1A0E',
  },
  favBtn: { padding: 4 },
  favIcon: { fontSize: 26 },
  meta: { paddingHorizontal: 16, color: '#C4622D', fontSize: 14, marginBottom: 8 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C1A0E',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  ingredient: {
    fontSize: 14,
    color: '#444',
    paddingHorizontal: 20,
    marginBottom: 3,
  },
  instructions: {
    fontSize: 14,
    color: '#444',
    paddingHorizontal: 16,
    lineHeight: 22,
  },
});
