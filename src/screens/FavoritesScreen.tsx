import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppSelector } from '../store/hooks';
import RecipeCard from '../components/RecipeCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const favorites = useAppSelector((state) => state.favorites.items);

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun favori pour l'instant.</Text>
        <Text style={styles.emptyHint}>Ajoutez des recettes depuis leur page détail ❤️</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={favorites}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        <RecipeCard
          meal={item}
          onPress={() => navigation.navigate('Detail', { id: item.idMeal })}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F1' },
  list: { paddingVertical: 8 },
  empty: {
    flex: 1,
    backgroundColor: '#FAF6F1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#2C1A0E', marginBottom: 8 },
  emptyHint: { fontSize: 14, color: '#888', textAlign: 'center' },
});
