import axios, { AxiosError } from 'axios';

// Application IDs and Keys for different APIs
const NUTRITION_APP_ID = '1819ba46';
const NUTRITION_APP_KEY = '4d37c48e6bb660485646255234d6009d';
const RECIPE_APP_ID = 'e5c2dbb7';
const RECIPE_APP_KEY = '77c9bd3f46f7f035b6ade101987451a6';
const FOOD_DATABASE_APP_ID = 'f08678bb';
const FOOD_DATABASE_APP_KEY = 'e5ffa7af8b03dfb301649b18a7ea2d57';

// API URLs
const EDAMAM_NUTRITION_API_URL = 'https://api.edamam.com/api/food-database/v2/parser';
const EDAMAM_RECIPE_API_URL = 'https://api.edamam.com/search';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


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




// פונקציה לחיפוש מתכון לפי רשימת מרכיבים
export const fetchRecipeFromAPI = async (ingredients: string[], displayedRecipes: string[]): Promise<string> => {
  await delay(2000); // השהייה של 2000 מילישניות
  const query = ingredients.join(','); // המרת רשימת המרכיבים למחרוזת אחת
  const url = `${EDAMAM_RECIPE_API_URL}?q=${query}&app_id=${RECIPE_APP_ID}&app_key=${RECIPE_APP_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.hits && data.hits.length > 0) {
      // חיפוש מתכון חדש שמכיל לפחות אחת מהמילים שהיוזר רשם
      const newRecipe = data.hits.find((recipe: { recipe: { label: string; ingredientLines: string[] } }) => 
        !displayedRecipes.includes(recipe.recipe.label) && 
        ingredients.some(ingredient => 
          recipe.recipe.ingredientLines.some(line => line.toLowerCase().includes(ingredient.toLowerCase()))
        )
      );

      if (newRecipe) {
        const recipe = newRecipe.recipe;
        const recipeTitle = recipe.label;
        const recipeUrl = recipe.url;
        const recipeIngredients = recipe.ingredientLines.join('\n');
        const recipeInstructions = `For detailed instructions, visit: ${recipeUrl}`;

        return `🍽️ Recipe: ${recipeTitle}\n\n📋 Ingredients:\n${recipeIngredients}\n\n🔗 Instructions:\n${recipeInstructions}`;
      } else {
        return 'Sorry, no more recipes found that contain any of the provided ingredients.';
      }
    } else {
      return 'Sorry, no recipes found for the provided ingredients.';
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return 'Failed to fetch recipe. Please try again later.';
  }
};

// פונקציה שתטפל בקלט של המשתמש ליצירת מתכון
export const handleUserInputForRecipe = async (input: string, displayedRecipes: string[]): Promise<string> => {
  // פיצול הקלט למרכיבים, התחשבות גם בפסיקים וגם ברווחים
  const ingredients = input.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean);
  
  const recipe = await fetchRecipeFromAPI(ingredients, displayedRecipes);
  return recipe;
};

// דוגמה לשימוש בפונקציה
//handleUserInputForRecipe("chicken, tomato, garlic").then(console.log);

// פונקציה שתבצע את זיהוי המרכיב וכמותו
export const handleUserInputForQuantityAndIngredient = async (input: string) => {
  const regex = /^(\d+)\s+(.+)$/;
  const match = input.match(regex);

  if (match) {
    const quantity = match[1];
    const ingredient = match[2];
    const ingredientWithQuantity = `${quantity} ${ingredient}`;

    console.log(`Fetching nutritional info for: ${ingredientWithQuantity}`);
    // מחזירים את המידע התזונתי
    return await getNutritionalInfoForIngredient(ingredientWithQuantity);
  } else {
    console.log("Input not recognized. Please enter in the format 'quantity ingredient' in English.");
    return null; // החזר NULL אם האינפוט לא זוהה
  }
};

// Fetch nutritional information for a food item with quantity
export const fetchNutritionalInfo = async (ingredient: string) => {
  await delay(500); // השהייה של 500 מילישניות
  try {
    const response = await axios.get(`https://api.edamam.com/api/nutrition-data`, {
      params: {
        app_id: NUTRITION_APP_ID,
        app_key: NUTRITION_APP_KEY,
        'nutrition-type': 'cooking',
        ingr: ingredient,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nutritional info:", error);
    return null; // מחזיר null במקרה של שגיאה
  }
};


// פונקציה לקבלת מידע תזונתי עבור מרכיב עם כמות
export const getNutritionalInfoForIngredient = async (ingredient: string) => {
  const nutritionalInfo = await fetchNutritionalInfo(ingredient);

  if (nutritionalInfo) {
    console.log("Nutritional Information:", nutritionalInfo);

    // Destructure total nutrients
    const { ENERC_KCAL, PROCNT, FAT, CHOCDF, NA } = nutritionalInfo.totalNutrients || {};

    // Set quantities or default to 0
    const calories = ENERC_KCAL ? ENERC_KCAL.quantity : 0;
    const protein = PROCNT ? PROCNT.quantity : 0;
    const fat = FAT ? FAT.quantity : 0;
    const carbs = CHOCDF ? CHOCDF.quantity : 0;
    const sodium = NA ? NA.quantity : 0; // Sodium included

    // Check if all values are zero
    if (calories === 0 && protein === 0 && fat === 0 && carbs === 0 && sodium === 0) {
      console.log("The nutritional information returned is invalid. All values are zero. Try entering in the format 'quantity ingredient' in English.");
      return null; // Return null for invalid info
    } else {
      // Return the nutritional info formatted with two decimal places
      return {
        calories: calories.toFixed(2), // Two decimal places
        protein: protein.toFixed(2), // Two decimal places
        fat: fat.toFixed(2), // Two decimal places
        carbs: carbs.toFixed(2), // Two decimal places
        sodium: sodium.toFixed(2) // Two decimal places
      };
    }
  } else {
    console.log("Failed to fetch nutritional information.");
    return null; // Return null for fetch failure
  }
};

