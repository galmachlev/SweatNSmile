import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons

// Types
interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface MealItem {
  name: string;
  calories: number;
}

interface Meals {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
}

const DailyMenu: React.FC = () => {
  const [dailyCalories, setDailyCalories] = useState<number>(1800);
  const [macros, setMacros] = useState<Macros>({ protein: 180, carbs: 175, fat: 30 });
  const [meals, setMeals] = useState<Meals>({
    breakfast: [],
    lunch: [],
    dinner: []
  });

  // Simulated API fetch
  const fetchMealData = async () => {
    // Replace with real API call
    const data = {
      breakfast: [
        { name: 'Eggs', calories: 200 },
        { name: 'Light bread', calories: 150 },
        { name: 'Cucumber', calories: 70 }
      ],
      lunch: [
        { name: 'Chicken breast', calories: 350 },
        { name: 'Rice', calories: 270 },
        { name: 'Sweet pepper', calories: 50 }
      ],
      dinner: [
        { name: 'Salmon', calories: 400 },
        { name: 'Broccoli', calories: 90 },
        { name: 'Quinoa', calories: 120 }
      ]
    };

    setMeals(data);
  };

  useEffect(() => {
    fetchMealData();
  }, []);

  return (
    <View style={styles.container}>
      
      {/* Circular progress for daily calories */}
      <View style={styles.caloriesContainer}>
        <View style={styles.circularProgress}>
          <Text style={styles.caloriesNum}>{dailyCalories} </Text>
            <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      </View>

      <View style={styles.macros}>
        <Text>Protein: {macros.protein}g</Text>
        <Text>Carbs: {macros.carbs}g</Text>
        <Text>Fat: {macros.fat}g</Text>
      </View>

      <FlatList
        data={Object.entries(meals)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => <MealSection title={item[0]} data={item[1]} />}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#A0A3B1" />
        <TextInput placeholder="Search food to add" style={styles.searchInput} />
      </View>
    </View>
  );
};

interface MealSectionProps {
  title: string;
  data: MealItem[];
}

const MealSection: React.FC<MealSectionProps> = ({ title, data }) => (
  <View style={styles.mealSection}>
    <Text style={styles.mealTitle}>{title}</Text>
    {data.map((item, index) => (
      <View key={index} style={styles.mealItem}>
        <Text>{item.name}</Text>
        <Text>{item.calories} kcal</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFE',
    paddingBottom: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  caloriesContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  circularProgress: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#9AB28B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  caloriesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  mealSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
});

export default DailyMenu;
