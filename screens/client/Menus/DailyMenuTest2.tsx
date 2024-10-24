import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as GoogleGenerativeAI from '@google/generative-ai';
import { FontAwesome } from '@expo/vector-icons';
import {foodData} from './FoodData';

type Macro = {
  protein: number;
  carbs: number;
  fat: number;
};

interface Ingredient {
  name: string;
  amount: string;
  details: string; // format: 'p:XX, f:XX, c:XX, calories:X'
}

interface Meal {
  totalCalories: number;
  meal: string;
  ingredients: Ingredient[];
}

const DailyMenu: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [macros, setMacros] = useState<Macro>({ protein: 0, carbs: 0, fat: 0 });
  const [previousMeals, setPreviousMeals] = useState<Meal[]>([]);

  const PROTEIN_PERCENTAGE = 0.4;
  const CARBS_PERCENTAGE = 0.4;
  const FAT_PERCENTAGE = 0.2;
  const TOTAL_CALORIES = 2200;
  const FREE_CALORIES = 200;
  const CALORIES_FOR_MEALS = TOTAL_CALORIES - FREE_CALORIES;

  const mealsCalories = {
    breakfast: CALORIES_FOR_MEALS * 0.3,
    lunch: CALORIES_FOR_MEALS * 0.4,
    dinner: CALORIES_FOR_MEALS * 0.3,
  };

  const calculateNutrientBreakdown = (mealCalories: number) => {
    const proteinCalories = mealCalories * PROTEIN_PERCENTAGE;
    const carbsCalories = mealCalories * CARBS_PERCENTAGE;
    const fatCalories = mealCalories * FAT_PERCENTAGE;

    return {
      gramsProtein: Math.floor(proteinCalories / 4),
      gramsCarbs: Math.floor(carbsCalories / 4),
      gramsFat: Math.floor(fatCalories / 9),
    };
  };

  const API_KEY = "AIzaSyAEG-hwBmhVBOIz8t7BQRpGOyPhcr3tWiU";
  const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);

  const getGeminiResponse = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      console.log("Raw response from Gemini:", result);
      return result.response.text(); 
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      setError("Sorry, I couldn't fetch a response. Please try again.");
      return ""; 
    }
  };

  const parseIngredients = (lines: string[]): Ingredient[] => {
    return lines.reduce<Ingredient[]>((acc, line) => {
      const match = line.match(/^\s*\{ name:\s*'(.*?)', amount:\s*'(.*?)', details:\s*'(.*?)' \}\s*$/);
      if (match) {
        const [, name, amount, details] = match;
        acc.push({ name, amount, details });
      }
      return acc;
    }, []);
  };

  const generateMealWithGemini = async (
    mealType: string,
    mealCalories: number,
  ): Promise<Ingredient[]> => {
    const { gramsProtein, gramsCarbs, gramsFat } = calculateNutrientBreakdown(mealCalories);

    const prompt = `
    Generate a healthy ${mealType} with exactly ${mealCalories} calories. 
    It should include ingredients that provide approximately ${gramsProtein}g of protein, ${gramsCarbs}g of carbohydrates, and ${gramsFat}g of fat. 
    Select ingredients based on the type of meal (e.g., breakfast, lunch, or dinner) and ensure the ingredients complement each other in flavor, using data from ${JSON.stringify(foodData)}. 
    Adjust the amount of each ingredient to ensure the total sum of all ingredients equals the exact calorie amount (${mealCalories} calories). 
    Each ingredient must detail its nutritional content, including protein (P), fat (F), carbohydrates (C), and total calories.
  
    Format the output for each ingredient as follows:
    List each ingredient on a new line, detailing the breakdown of protein (P), fats (F), carbohydrates (C), and calories:
    { name: 'Ingredient Name', amount: 'Amount', details: 'p:XX, f:XX, c:XX, calories:X' }. 
    Do not include any additional text or formatting.
  `;
            
    console.log(mealCalories);
  
    const response = await getGeminiResponse(prompt);
    console.log("Response from Gemini:", response);
  
    if (!response) {
      console.error(`No response received for ${mealType}`);
      return [];
    }
  
    const formattedIngredients = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  
    const ingredientsArray: Ingredient[] = parseIngredients(formattedIngredients);
  
    // Filter ingredients to ensure they exist in the provided food data
    const filteredIngredients = ingredientsArray.filter(ingredient =>
      foodData.some(category =>
        category.items.some(item => item.name === ingredient.name)
      )
    );
  
    return filteredIngredients;
  };
  
  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const generatedMeals: Meal[] = await Promise.all(
        Object.entries(mealsCalories).map(async ([mealType, calories]) => {
          const ingredients = await generateMealWithGemini(mealType, calories);
          return {
            meal: mealType.charAt(0).toUpperCase() + mealType.slice(1),
            totalCalories: calories,
            ingredients,
          };
        })
      );

      setPreviousMeals(prevMeals => [...prevMeals, ...generatedMeals]);
      setMeals(generatedMeals.filter(meal => meal.ingredients.length > 0));
      updateMacros(generatedMeals);
    } catch (err) {
      setError('Failed to generate meals. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  const updateMacros = (meals: Meal[]) => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
  
    meals.forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        const details = ingredient.details.split(', ');
        details.forEach(detail => {
          const [key, value] = detail.split(':');
          const parsedValue = parseInt(value);
          if (key.trim() === 'p') {
            totalProtein += parsedValue;
          } else if (key.trim() === 'c') {
            totalCarbs += parsedValue;
          } else if (key.trim() === 'f') {
            totalFat += parsedValue;
          }
        });
      });
    });
  
    setMacros({ protein: totalProtein, carbs: totalCarbs, fat: totalFat });
  };
  
  const handleRefresh = () => {
    setPreviousMeals([]);
    fetchMeals();
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Menu</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <FontAwesome name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.macros}>
        <Text style={styles.macroLabel}>Macros Breakdown:</Text>
        <Text>Protein: {macros.protein}g</Text>
        <Text>Carbs: {macros.carbs}g</Text>
        <Text>Fat: {macros.fat}g</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item, index) => `${item.meal}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.mealContainer}>
              <Text style={styles.mealTitle}>{item.meal}</Text>
              <Text>Total Calories: {item.totalCalories}</Text>
              <FlatList
                data={item.ingredients}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({ item }) => (
                  <View style={styles.ingredientContainer}>
                    <Text>{item.name} ({item.amount})</Text>
                    <Text style={styles.ingredientDetails}>{item.details}</Text>
                  </View>
                )}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  macros: {
    marginVertical: 16,
  },
  macroLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ingredientContainer: {
    marginVertical: 4,
  },
  ingredientDetails: {
    fontStyle: 'italic',
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default DailyMenu;
