import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { searchMeals, Meal } from '../api/meals';
import RecipeCard from '../components/RecipeCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const results = await searchMeals(query.trim());
      setMeals(results);
    } catch {
      setError('Impossible de charger les recettes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher une recette..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.centered} color="#C4622D" size="large" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && searched && meals.length === 0 && !error && (
        <Text style={styles.emptyText}>Aucune recette trouvée.</Text>
      )}

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard
            meal={item}
            onPress={() => navigation.navigate('Detail', { id: item.idMeal })}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F1' },
  searchRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0D5C8',
    color: '#2C1A0E',
  },
  button: {
    backgroundColor: '#C4622D',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  centered: { marginTop: 40 },
  errorText: { textAlign: 'center', color: '#C0392B', marginTop: 20, fontSize: 15 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 15 },
  list: { paddingVertical: 8 },
});
