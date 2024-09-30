/*
 * This component renders a search bar for the user to search for food items.
 * It uses the `useLazyQuery` hook to fetch the search results from the server.
 * The search results are displayed in a `FlatList` below the search bar.
 * The component also renders a loading indicator while the search is being performed.
 *
 * The component requires the `navigation` prop, which is a reference to the navigation object.
 * The component uses the `navigation` prop to navigate to the `DailyMenuDetails` screen when a search result is selected.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { gql, useLazyQuery } from '@apollo/client';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://unjeodong.us-east-a.ibm.stepzen.net/api/vetoed-badger/__graphql', // URI של IBM StepZen
  cache: new InMemoryCache(), // הגדרת מערכת המטמון
  headers: {
    Authorization: 'apikey unjeodong::local.net+1000::a153c90641a79f856725e561471dee0eb3892335d13eb1b252d4c328c805ada7', // מפתח ה-API שלך
  },
});


const SEARCH_QUERY = gql`
  query search($ingr: String, $upc: String) {
    search(ingr: $ingr, upc: $upc) {
      text
      hints {
        food {
          label
          foodId
          nutrients {
            ENERC_KCAL
            FAT
            CHOCDF
            PROCNT
          }
        }
      }
    }
  }
`;

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
  Extras: MealItem[]; // Added Extras
}

interface MealSectionProps {
  title: string;
  data: MealItem[];
  borderColor: string;
  onRefresh: (title: string) => void;
}

const DailyMenu: React.FC = () => {
  const [dailyCalories, setDailyCalories] = useState<number>(1800);
  const [macros, setMacros] = useState<Macros>({ protein: 180, carbs: 175, fat: 30 });
  const [meals, setMeals] = useState<Meals>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Extras: []
  });

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [performSearch, { loading: searchLoading, error: searchError }] = useLazyQuery(SEARCH_QUERY, {
    onCompleted: (data) => {
      setSearchResults(data?.search?.hints || []);
    }
  });

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
      case 'Extras':
        return '#E8A54B';
      default:
        return '#FBF783';
    }
  };

  type MealType = 'breakfast' | 'lunch' | 'dinner';

  const getRandomItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];
  
  const foodCategories: Record<MealType, { protein: string[]; carbs: string[]; fats: string[] }> = {
    breakfast: {
      protein: ["egg", "yogurt", "cheese", "smoked salmon", "tuna"],
      carbs: ["oats", "whole grain bread", "banana", "berries", "granola"],
      fats: ["avocado", "almond butter", "peanut butter", "chia seeds", "honey"],
    },
    lunch: {
      protein: ["chicken", "beef", "tofu", "veal", "chickpeas", "fish"],
      carbs: ["rice", "quinoa", "pasta", "sweet potato", "whole grain wraps"],
      fats: ["olive oil", "nuts", "cheese", "hummus", "sunflower seeds"],
    },
    dinner: {
      protein: ["fish", "chicken", "tofu", "lean beef", "lentils", "egg"],
      carbs: ["brown rice", "sweet potato", "pasta", "rice"],
      fats: ["butter", "olive oil", "avocado", "pesto", "pumpkin seeds"],
    },
  };
  
  const fetchFoodItems = async (ingredients: string): Promise<any[]> => {
    try {
      const response = await client.query({
        query: SEARCH_QUERY,
        variables: { ingr: ingredients },
      });
  
      return response.data.search.hints
        .map((hint: any) => hint.food)
        .filter((food: any) => {
          // ודא שהאובייקט food לא ריק
          if (!food) {
            return false; // החזר false אם food ריק
          }
  
          // בדוק אם יש תיאור
          const name = food.label || ''; // אם אין תיאור, קח מחרוזת ריקה
          const wordCount = name.split(' ').length;
  
          const isValidItem = wordCount <= 3;
  
          return isValidItem;
        });
    } catch (error) {
      console.error('Error fetching food items from Gemini:', error);
      return []; // Return empty array in case of error
    }
  };
  
  
// Function to create random meal data
const generateRandomMealData = async (mealType: MealType): Promise<any> => {
  const categories = foodCategories[mealType]; // TypeScript now knows this is safe
  const proteins = await fetchFoodItems(categories.protein.join(','));
  const carbs = await fetchFoodItems(categories.carbs.join(','));
  const fats = await fetchFoodItems(categories.fats.join(','));

  const randomMealItem = (items: any[]): any => {
    const randomItem = getRandomItem(items);
    return {
      name: randomItem.label,
      calories: randomItem.nutrients.ENERC_KCAL,
      protein: randomItem.nutrients.PROCNT,
      fat: randomItem.nutrients.FAT,
      carbohydrates: randomItem.nutrients.CHOCDF,
    };
  };

  return {
    [mealType.charAt(0).toUpperCase() + mealType.slice(1)]: [
      randomMealItem(proteins), // Protein
      randomMealItem(carbs),    // Carbs
      randomMealItem(fats),     // Fats
    ],
  };
};

// Function to fetch meal data
const fetchMealData = async (mealType?: string) => {
  try {
    let mealData;
    
    // בדוק אם יש סוג ארוחה שניתן לטעון
    if (mealType) {
      mealData = await generateRandomMealData(mealType);
    } else {
      // טען את כל הארוחות
      const breakfast = await generateRandomMealData("breakfast");
      const lunch = await generateRandomMealData("lunch");
      const dinner = await generateRandomMealData("dinner");

      mealData = {
        ...breakfast,
        ...lunch,
        ...dinner,
        Extras: [], // אפשרות לפריטים נוספים
      };
    }

    // עדכן את המצב
    setMeals(mealData);
  } catch (error) {
    console.error('Error fetching meal data:', error);
  }
};

// Effect to load data on component mount
useEffect(() => {
  fetchMealData();
}, []);

  const handleSearchIconPress = () => {
    setShowSearch(true);
  };

  const handleOutsidePress = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performSearch({ variables: { ingr: searchQuery } });
    }
  };

  const handleAddToSnacks = (item: any) => {
    const newSnack: MealItem = {
      name: item.food.label,
      calories: item.food.nutrients.ENERC_KCAL,
    };
    
    setMeals(prevMeals => ({
      ...prevMeals,
      Extras: [...prevMeals.Extras, newSnack],
    }));

    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const refreshAllMeals = () => {
    console.log('Refreshing all meals');
    fetchMealData();
  };

  const refreshMealData = (title: string) => {
    console.log(`Refreshing ${title}`);
    fetchMealData();
  };

  const mealSections = Object.entries(meals).map(([title, data]) => ({
    title,
    data,
    borderColor: getBorderColor(title),
    type: 'meal' as const
  }));
    
  // Filter out the empty Extras section
  const filteredMealSections = mealSections.filter(section => !(section.title === 'Extras' && section.data.length === 0));
  
  // Add feedback section as the last item
  filteredMealSections.push({
    title: '',
    data: [],
    borderColor: '#FFF', // Placeholder value
    type: 'feedback' as const
  });
  
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
          <Text style={styles.macroLabel}>Protein (g)</Text>
          <View style={styles.macroValueContainer}>
            <Text style={styles.macroValue}>{macros.protein}</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbohydrates (g)</Text>
          <View style={styles.macroValueContainer}>
            <Text style={styles.macroValue}>{macros.carbs}</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fat (g)</Text>
          <View style={styles.macroValueContainer}>
            <Text style={styles.macroValue}>{macros.fat}</Text>
          </View>
        </View>
      </View>

      {/* Meal Sections */}
      <FlatList
        data={filteredMealSections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (item.type === 'meal') {
            return (
              <MealSection 
                title={item.title} 
                data={item.data} 
                borderColor={item.borderColor} 
                onRefresh={refreshMealData} 
              />
            );
          } else if (item.type === 'feedback') {
            return (
              <View style={styles.feedbackSection}>
                <Text style={styles.feedbackText}>
                  Didn't like the menu?
                </Text>
                <TouchableOpacity onPress={refreshAllMeals} style={styles.refreshAllButton}>
                  <FontAwesome name="refresh" size={20} color="#FFF" />
                  <Text style={styles.refreshAllText}>Create different</Text>
                </TouchableOpacity>
              </View>
            );
          }
          return null;
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
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                {searchLoading && <ActivityIndicator />}
                {searchError && <Text style={styles.errorText}>Error: {searchError.message}</Text>}
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.food.foodId.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.resultItem} 
                      onPress={() => handleAddToSnacks(item)}
                    >
                      <Text style={styles.resultText}>
                        {item.food.label}
                      </Text>
                      <Text style={styles.resultDetail}>
                        Calories: {item.food.nutrients.ENERC_KCAL} kcal
                      </Text>
                      <Text style={styles.resultDetail}>
                        Carbohydrates: {item.food.nutrients.CHOCDF} g
                      </Text>
                      <Text style={styles.resultDetail}>
                        Fat: {item.food.nutrients.FAT} g
                      </Text>
                      <Text style={styles.resultDetail}>
                        Protein: {item.food.nutrients.PROCNT} g
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => <Text>No results found</Text>}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Search Icon */}
      <TouchableOpacity onPress={handleSearchIconPress} style={styles.floatingButton}>
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
    marginVertical: 20,
    alignContent: 'center',
    width: '80%',
    justifyContent: 'space-between',
    marginLeft: '8%',

  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    color: '#696B6D',
    marginBottom: 5,
    textAlign: 'center',
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
  feedbackSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fffff',
    borderRadius: 10,
  },
  feedbackText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  refreshAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#696B6D',
    paddingVertical: 10,
    borderRadius: 5,
  },
  refreshAllText: {
    marginLeft: 10,
    color: '#FFF',
    fontWeight: 'bold',
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
  searchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%'
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    marginBottom: 10,
    padding: 5
  },
  searchButton: {
    backgroundColor: '#E8A54B',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center'
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    marginTop: 10
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD'
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDetail: {
    fontSize: 14,
    color: '#696B6D',
    marginTop: 5,
  },
  searchIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#E8A54B',
    borderRadius: 30,
    padding: 10
  },

});

export default DailyMenu;
