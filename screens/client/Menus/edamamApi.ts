import axios from 'axios';

const APP_ID = '08030483'; 
const APP_KEY = '67cd309030d603a15e8df88a2c28e9dc';
const EDAMAM_API_URL = 'https://api.edamam.com/api/food-database/v2/parser';

// Function to search for food items based on ingredient
export const searchFood = async (ingredient: string) => {
  try {
    const response = await axios.get(EDAMAM_API_URL, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        ingr: ingredient,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Edamam API:', error);
    throw error;
  }
};

// Function to fetch food items from the Edamam API
export const fetchFoodItems = async (ingredients: string): Promise<any[]> => {
  try {
    const foodData = await searchFood(ingredients); // Call the searchFood function

    // Process the response and return the retrieved food items
    return foodData.hints
      .map((hint: any) => hint.food) // Get food information
      .filter((food: any) => {
        // Ensure the food object is not empty
        if (!food) {
          return false; // Return false if food is empty
        }

        // Check if there is a description
        const name = food.label || ''; // If there is no description, take an empty string
        const wordCount = name.split(' ').length; // Count the number of words

        const isValidItem = wordCount <= 3; // Check if the word count is 3 or less

        return isValidItem; // Return true if it is valid
      });
  } catch (error) {
    console.error('Error fetching food items from Edamam:', error);
    return []; // Return an empty array in case of error
  }
};
