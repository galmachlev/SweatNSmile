import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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
  Breakfast: MealItem[];
  Lunch: MealItem[];
  Dinner: MealItem[];
}

interface MealSectionProps {
  title: string;
  data: MealItem[];
  borderColor: string;
  onRefresh: (title: string) => void;  // הוסף פרופס לפונקציה שתשנה את הערכים
}

const DailyMenu: React.FC = () => {
  const [dailyCalories, setDailyCalories] = useState<number>(1800);
  const [macros, setMacros] = useState<Macros>({ protein: 180, carbs: 175, fat: 30 });
  const [meals, setMeals] = useState<Meals>({
    Breakfast: [],
    Lunch: [],
    Dinner: []
  });

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const MealSection: React.FC<MealSectionProps> = ({ title, data, borderColor, onRefresh }) => (
    <View style={[styles.mealSection, { borderLeftColor: borderColor }]}>
      <View style={styles.header}>
        <Text style={styles.mealTitle}>{title}</Text>
        <TouchableOpacity onPress={() => onRefresh(title)}>
          <FontAwesome name="refresh" size={20} color="#696B6D" />
        </TouchableOpacity>
      </View>
      {data.map((item, index) => (
        <View key={index} style={styles.mealItem}>
          <Text>{item.name}</Text>
          <Text>{item.calories} kcal</Text>
        </View>
      ))}
    </View>
  );
  
  const getBorderColor = (title: string) => {
    switch (title) {
      case 'Breakfast':
        return '#FFCE76';
      case 'Lunch':
        return '#F8D675';
      case 'Dinner':
        return '#FDE598';
      default:
        return '#FBF783'; 
    }
  };

  // Simulated API fetch
  const fetchMealData = async () => {
    // Replace with real API call
    const data = {
      Breakfast: [
        { name: 'Eggs', calories: 200 },
        { name: 'Light bread', calories: 150 },
        { name: 'Cucumber', calories: 70 }
      ],
      Lunch: [
        { name: 'Chicken breast', calories: 350 },
        { name: 'Rice', calories: 270 },
        { name: 'Sweet pepper', calories: 50 }
      ],
      Dinner: [
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

  const handleSearchIconPress = () => {
    setShowSearch(true);
  };

  const handleOutsidePress = () => {
    setShowSearch(false);
    setSearchQuery(''); // Reset the search query if needed
  };

  // Function to refresh meal data
  const refreshMealData = (title: string) => {
    // Replace with logic to refresh the meal data
    console.log(`Refreshing ${title}`);
    // For now, let's simulate refreshing by re-fetching the data
    fetchMealData();
  };

  return (
    <View style={styles.container}>
      {/* Circular progress for daily calories */}
      <View style={styles.caloriesContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={styles.inner2Circle}>
              <View style={styles.inner1Circle}>
                <Text style={styles.caloriesNum}>{dailyCalories}</Text>
                <Text style={styles.caloriesLabel}>kcal</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Macros information */}
      <View style={styles.macros}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>protein(g)</Text>
          <View style={styles.macroValueContainer}>
            <Text style={styles.macroValue}>{macros.protein}</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>carbohydrates(g)</Text>
          <View style={styles.macroValueContainer}>
            <Text style={styles.macroValue}>{macros.carbs}</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fat(g)</Text>
          <View style={styles.macroValueContainer}>
            <Text style={styles.macroValue}>{macros.fat}</Text>
          </View>
        </View>
      </View>

      {/* Meal Sections */}
      <FlatList
        data={Object.entries(meals)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [title, data] = item;
          const borderColor = getBorderColor(title);
          return (
            <MealSection 
              title={title} 
              data={data} 
              borderColor={borderColor} 
              onRefresh={refreshMealData} 
            />
          );
        }}
      />

      {/* Search Modal */}
      {showSearch && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.searchContainer}>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search food to add"
                  style={styles.searchInput}
                  autoFocus
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleSearchIconPress}
      >
        <FontAwesome name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFE',
    paddingBottom: 60,
  },
  caloriesContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#E8A54B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 125,
    height: 125,
    borderRadius: 100, 
    borderWidth: 10,
    borderColor: '#FFCE76',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner2Circle: {
    width: 110,
    height: 110,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#F8D675',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner1Circle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#FDE598',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#696B6D',
  },
  caloriesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#696B6D',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    color: '#696B6D',
    marginBottom: 5,
  },
  macroValueContainer: {
    backgroundColor: '#696B6D', // The gray color from your image
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF', // White color for the text inside the rounded background
  },
  mealSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderLeftColor: '#E8A54B',
    borderLeftWidth: 25,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#696B6D',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#FFF',
    width: '80%',
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#E8A54B',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 35,
    right: 20,
    elevation: 8,
  },
  refreshButton: {
    padding: 5,
  },
});

export default DailyMenu;
