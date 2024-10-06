import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { searchFood } from '../Menus/edamamApi'; // הנתיב לקובץ שלך

const SearchComponent: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]); // Clear results before fetching
    try {
      const data = await searchFood(ingredient);
      setResults(data.hints || []);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={ingredient}
        onChangeText={setIngredient}
        placeholder="Search for an ingredient"
      />
      <Button title="Search" onPress={handleSearch} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {results && (
        <View>
{results.hints.map((hint: any, index: number) => (
  <View key={hint.food.foodId || index}> // Use index as fallback
    {/* Render your food item here */}
  </View>
))}
        </View>
      )}
    </View>
  );
};

export default SearchComponent;
