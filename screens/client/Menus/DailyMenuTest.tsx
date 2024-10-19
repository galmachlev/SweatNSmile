import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

// Application IDs and Keys for Edamam API
const FOOD_DATABASE_APP_ID = '08030483';
const FOOD_DATABASE_APP_KEY = '67cd309030d603a15e8df88a2c28e9dc';

// API URLs
const EDAMAM_NUTRITION_API_URL = 'https://api.edamam.com/api/food-database/v2/parser';

// Function to search for food ingredients using the Edamam API
export const searchFood = async (ingredient: string) => {
  try {
    const response = await axios.get(EDAMAM_NUTRITION_API_URL, {
      params: {
        app_id: FOOD_DATABASE_APP_ID,
        app_key: FOOD_DATABASE_APP_KEY,
        ingr: ingredient,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Edamam API:', error);
    throw error;
  }
};

// Constants for nutrient distribution percentages
const PROTEIN_PERCENTAGE = 40;
const CARBS_PERCENTAGE = 40;
const FAT_PERCENTAGE = 20;

// Function to calculate the nutrient breakdown based on total meal calories
const calculateNutrientBreakdown = (mealCalories: number) => {
  const proteinCalories = (mealCalories * PROTEIN_PERCENTAGE) / 100;
  const carbsCalories = (mealCalories * CARBS_PERCENTAGE) / 100;
  const fatCalories = (mealCalories * FAT_PERCENTAGE) / 100;

  const gramsProtein = Math.floor(proteinCalories / 4); // 1g protein = 4 calories
  const gramsCarbs = Math.floor(carbsCalories / 4);     // 1g carb = 4 calories
  const gramsFat = Math.floor(fatCalories / 9);         // 1g fat = 9 calories

  return {
    gramsProtein,
    gramsCarbs,
    gramsFat,
  };
}

// רשימת המוצרים שלך
const meals: { [key: string]: string[] } = { // Explicitly define the type
  Breakfast: ['Eggs', 'Oatmeal', 'Avocado', 'Greek Yogurt', 'Banana'],
  Lunch: ['Chicken Breast', 'Brown Rice', 'Olive Oil', 'Quinoa', 'Tuna'],
  Dinner: ['Pasta', 'Steak', 'Vegetables', 'Seafood', 'Quinoa'],
};

// פונקציה עבור הבקשות ל-API עם עיכוב
async function fetchFoodItem(item: string): Promise<any> { // Explicitly define the parameter type
  try {
    const response = await axios.get(`YOUR_API_URL`, { params: { item } });
    return response.data;
  } catch (error: any) { // Define the error type
    if (error.response && error.response.status === 429) {
      console.error('Too many requests. Waiting before retrying...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // המתן 2 שניות
      return fetchFoodItem(item); // נסה שוב
    }
    console.error('Error fetching food item:', error);
    throw error; // מעלה את השגיאה כדי שהקוד העליון יוכל לטפל בה
  }
}

// פונקציה כדי לגשת למוצרים ולשלוח בקשות ל-API
async function fetchMeals() {
  for (const [mealType, items] of Object.entries(meals) as [string, string[]][]) { // Ensure the correct type
    for (const item of items) {
      try {
        const foodData = await fetchFoodItem(item); // שימוש בפונקציה עם העיכוב
        console.log(`Fetched data for ${item}:`, foodData);
      } catch (error: any) { // Define the error type
        console.error(`Error fetching data for ${item}:`, error);
      }
    }
  }
}

// קריאה לפונקציה
fetchMeals();

// Update the createMeal function to choose ingredients based on meal type
const createMeal = async (mealCalories: number, mealType: keyof typeof meals) => { // Use keyof for mealType
  const ingredientCount = 3; // Number of ingredients to include
  const selectedIngredients: any[] = [];
  let totalCalories = 0;

  const ingredients = meals[mealType]; // Access the ingredients using the defined type

  // Loop to select ingredients
  while (selectedIngredients.length < ingredientCount && totalCalories < mealCalories) {
    const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];

    try {
      const data = await searchFood(randomIngredient);
      const foodItem = data.hints[0]; // Assuming you want to take the first result

      if (foodItem) {
        const calories = Number(foodItem.food.nutrients.ENERC_KCAL);
        if (totalCalories + calories <= mealCalories) {
          selectedIngredients.push(foodItem);
          totalCalories += calories;
        }
      }
    } catch (error) {
      console.error('Error fetching food item:', error);
    }
  }

  return {
    ingredients: selectedIngredients,
    totalCalories,
    nutrientBreakdown: calculateNutrientBreakdown(totalCalories),
  };
};

const DailyMenu2: React.FC = () => {
  const [meals, setMeals] = useState<any[]>([]); // Ensure meals is initialized as an empty array
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateMeals = async () => {
    setLoading(true);
    setError('');

    const breakfastCalories = 600; // 600 calories for breakfast
    const lunchCalories = 800;     // 800 calories for lunch
    const dinnerCalories = 800;    // 800 calories for dinner

    try {
      const breakfast = await createMeal(breakfastCalories, 'Breakfast');
      const lunch = await createMeal(lunchCalories, 'Lunch');
      const dinner = await createMeal(dinnerCalories, 'Dinner');

      setMeals([
        { type: 'Breakfast', meal: breakfast.ingredients, totalCalories: breakfast.totalCalories },
        { type: 'Lunch', meal: lunch.ingredients, totalCalories: lunch.totalCalories },
        { type: 'Dinner', meal: dinner.ingredients, totalCalories: dinner.totalCalories },
      ]);
    } catch (err: any) { // Define the error type
      setError('Failed to generate meals. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button title="Generate Meals" onPress={handleGenerateMeals} />
        
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {meals.map((meal, index) => (
          <View key={index} style={styles.mealContainer}>
            <Text style={styles.mealType}>{meal.type}:</Text>
            {meal.meal.map((ingredient: any, i: number) => (
              <View key={i}>
                <Text style={styles.mealDescription}>
                  {ingredient.food.label} - {ingredient.food.nutrients.ENERC_KCAL} kcal
                </Text>
                {i < meal.meal.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
            <Text style={styles.totalCalories}>Total Calories: {meal.totalCalories}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  mealContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  mealType: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  mealDescription: {
    fontSize: 16,
    color: '#666',
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
});

export default DailyMenu2;
