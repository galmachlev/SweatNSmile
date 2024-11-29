import axios from 'axios'; // הספרייה עוזרת לתקשר עם שירותים חיצוניים כמו גט, פוסט, דליט, פוט, שימושית עבור החזרת מידע בפורמט גייסון 

// API חיצוני מתוך אתר EDAMAM 
const NUTRITION_APP_ID = '1819ba46'; // עבור הפונקציה של כמות+שם מרכיב
const NUTRITION_APP_KEY = '4d37c48e6bb660485646255234d6009d'; // עבור הפונקציה של כמות+שם מרכיב
const RECIPE_APP_ID = 'e5c2dbb7'; // עבור הפונקציה של מתכונים
const RECIPE_APP_KEY = '77c9bd3f46f7f035b6ade101987451a6'; // עבור הפונקציה של מתכונים
const FOOD_DATABASE_APP_ID = 'f08678bb'; // עבור הפונקציה של חיפוש מזון והוספה לאקסטרות
const FOOD_DATABASE_APP_KEY = 'e5ffa7af8b03dfb301649b18a7ea2d57'; // עבור הפונקציה של חיפוש מזון והוספה לאקסטרות

// API URLs
const EDAMAM_NUTRITION_API_URL = 'https://api.edamam.com/api/food-database/v2/parser';
const EDAMAM_RECIPE_API_URL = 'https://api.edamam.com/search';

// פונקציה שמחזירה הבטחה לאחר השהייה מסוימת
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ביצוע חיפוש מידע על פריטי מזון דרך המסד נתונים חיצוני של אדמם עבור התפריט היומי והוספה לאקסטרות
export const searchFood = async (ingredient: string) => {
  try {
    // בקשת GET ל-API של Edamam עם פרמטרים לזיהוי מזהה האפליקציה, המפתח, והמרכיב לחיפוש
    const response = await axios.get(EDAMAM_NUTRITION_API_URL, {
      params: {
        app_id: FOOD_DATABASE_APP_ID, // מזהה אפליקציה ל-API
        app_key: FOOD_DATABASE_APP_KEY, // מפתח גישה ל-API
        ingr: ingredient, // המרכיב שאותו רוצים לחפש
      },
    });
    
    // החזרת המידע שהתקבל מה-API
    return response.data;
  } catch (error) {
    // טיפול בשגיאה: רישום הודעה למסוף במקרה של כשל בקבלת המידע
    console.error('Error fetching data from Edamam API:', error);
    
    // השלכת השגיאה כדי שהפונקציה הקוראת תוכל לטפל בה
    throw error;
  }
};

// פונקציה לחיפוש מתכון לפי רשימת מרכיבים
export const fetchRecipeFromAPI = async (ingredients: string[], displayedRecipes: string[]): Promise<string> => {
  await delay(2000); // השהייה מלאכותית של 2000 מילישניות כדי לדמות זמן תגובה

  // המרת רשימת המרכיבים למחרוזת אחת המופרדת בפסיקים לשימוש בשאילתת ה-API
  const query = ingredients.join(',');
  
  // בניית URL עבור בקשת ה-API לפי המחרוזת שנוצרה והוספת מזהים לאימות
  const url = `${EDAMAM_RECIPE_API_URL}?q=${query}&app_id=${RECIPE_APP_ID}&app_key=${RECIPE_APP_KEY}`;

  try {
    // שליחת בקשת GET ל-API כדי לקבל מתכונים התואמים את המרכיבים שהוזנו
    const response = await axios.get(url);
    const data = response.data; // קבלת נתוני המתכונים מהתשובה של ה-API

    // בדיקה אם נמצאו מתכונים שמתאימים לשאילתא (hits מציין את רשימת התוצאות)
    if (data.hits && data.hits.length > 0) {
      
      // חיפוש מתכון חדש שעדיין לא הוצג ושאחד או יותר מהמרכיבים מופיע ברשימת המרכיבים שלו
      const newRecipe = data.hits.find((recipe: { recipe: { label: string; ingredientLines: string[] } }) => 
        !displayedRecipes.includes(recipe.recipe.label) && // בדיקה שהמתכון עוד לא הוצג
        ingredients.some(ingredient => 
          recipe.recipe.ingredientLines.some(line => line.toLowerCase().includes(ingredient.toLowerCase())) // בדיקה אם לפחות אחד המרכיבים מופיע ברשימת המרכיבים של המתכון
        )
      );

      // אם נמצא מתכון חדש שמתאים
      if (newRecipe) {
        const recipe = newRecipe.recipe; // קבלת אובייקט המתכון שמצאנו
        const recipeTitle = recipe.label; // שם המתכון
        const recipeUrl = recipe.url; // הקישור למתכון המלא באתר המקורי
        const recipeIngredients = recipe.ingredientLines.join('\n'); // המרת רשימת המרכיבים למחרוזת אחת עם מעברי שורה בין כל מרכיב
        const recipeInstructions = `For detailed instructions, visit: ${recipeUrl}`; // קישור להוראות ההכנה, אם קיימות, באתר המקורי

        // החזרת פרטי המתכון המלאים בפורמט קריא
        return `🍽️ Recipe: ${recipeTitle}\n\n📋 Ingredients:\n${recipeIngredients}\n\n🔗 Instructions:\n${recipeInstructions}`;
      } else {
        // אם לא נמצא מתכון שלא הוצג בעבר, מחזירים הודעה מתאימה
        return 'Sorry, no more recipes found that contain any of the provided ingredients.';
       }
    } else {
      // אם לא נמצאו מתכונים כלל, מחזירים הודעת שגיאה מתאימה
      return 'Sorry, no recipes found for the provided ingredients.';
     }
  } catch (error) {
    // טיפול במקרה של שגיאה במהלך בקשת ה-API (כמו שגיאת רשת)
    console.error('Error fetching recipe:', error);
    
    // החזרת הודעת שגיאה שתוצג למשתמש
    return 'Failed to fetch recipe. Please try again later.';
   }
};

// פונקציה שתטפל בקלט של המשתמש ליצירת מתכון - בשימוש בקובץ של המתכונים-גימיני
export const handleUserInputForRecipe = async (input: string, displayedRecipes: string[]): Promise<string> => {
  // פיצול הקלט למרכיבים, התחשבות גם בפסיקים וגם ברווחים
  const ingredients = input.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean);
  const recipe = await fetchRecipeFromAPI(ingredients, displayedRecipes);
  return recipe;
};

// פונקציה שולחת בקשה למאגר חיצוני כדי לקבל מידע תזונתי עבור פריט מזון עם כמות מסוימת
export const fetchNutritionalInfo = async (ingredient: string) => {
  await delay(500); // השהייה של 500 מילישניות לפני שליחת הבקשה
  try {
    const response = await axios.get(`https://api.edamam.com/api/nutrition-data`, {
      params: {
        app_id: NUTRITION_APP_ID, // מזהה אפליקציה לשימוש ב-API
        app_key: NUTRITION_APP_KEY, // מפתח אפליקציה לשימוש ב-API
        'nutrition-type': 'cooking', // סוג החישוב התזונתי: בישול
        ingr: ingredient, // כמות ופריט המזון שאנו מעוניינים לקבל עבורם מידע תזונתי
      },
    });
    return response.data; // מחזיר את המידע התזונתי שהתקבל מהשרת
  } catch (error) {
    console.error("Error fetching nutritional info:", error); // מדפיס שגיאה במידה והבקשה נכשלה
    return null; // מחזיר נאל במקרה של שגיאה
  }
};

// פונקציה לקבלת מידע תזונתי עבור מרכיב עם כמות
export const getNutritionalInfoForIngredient = async (ingredient: string) => {
  const nutritionalInfo = await fetchNutritionalInfo(ingredient);

  if (nutritionalInfo) {
    console.log("Nutritional Information:", nutritionalInfo);

    // אתחול כל הערכים שרוצים לקבל מידע על פריט מסויים
    const { ENERC_KCAL, PROCNT, FAT, CHOCDF} = nutritionalInfo.totalNutrients || {};

    // שליפת המידע בהתאם לערך התזונתי של הפריט או השמה של 0 במידה ואין מידע זמין
    const calories = ENERC_KCAL ? ENERC_KCAL.quantity : 0;
    const protein = PROCNT ? PROCNT.quantity : 0;
    const fat = FAT ? FAT.quantity : 0;
    const carbs = CHOCDF ? CHOCDF.quantity : 0;

    // Check if all values are zero
    if (calories === 0 && protein === 0 && fat === 0 && carbs === 0) {
      console.log("The nutritional information returned is invalid. All values are zero. Try entering in the format 'quantity ingredient' in English.");
      return null; // Return null for invalid info
    } else {
      // החזרה של הערכים עם 2 ספרות מקסימום אחרי הנקודה
      return {
        calories: calories.toFixed(2),
        protein: protein.toFixed(2), 
        fat: fat.toFixed(2),
        carbs: carbs.toFixed(2), 
      };
    }
  } else {
    console.log("Failed to fetch nutritional information.");
    return null; // החזרת נאל במידה ולא הצליח לטעון טוב את הערכים
  }
};

// פונקציה לזיהוי כמות ומרכיב מתוך הקלט של המשתמש - בשימוש בקובץ של המתכונים-גימיני
export const handleUserInputForQuantityAndIngredient = async (input: string) => {
  // יצירת ביטוי רגולרי למציאת מספר וכמות בקלט
  const regex = /^(\d+)\s+(.+)$/;
  const match = input.match(regex); // התאמה לביטוי הרגולרי

  if (match) {
    const quantity = match[1]; // הכמות המספרית
    const ingredient = match[2]; // שם המרכיב
    const ingredientWithQuantity = `${quantity} ${ingredient}`; // הרכבת מחרוזת מלאה עם הכמות והמרכיב

    console.log(`Fetching nutritional info for: ${ingredientWithQuantity}`);
    // מחזירים את המידע התזונתי עבור הכמות והמרכיב המבוקשים
    return await getNutritionalInfoForIngredient(ingredientWithQuantity);
  } else {
    // הודעת שגיאה אם הפורמט אינו תואם
    console.log("Input not recognized. Please enter in the format 'quantity ingredient' in English.");
    return null; // החזר NULL אם הפורמט אינו זוהה
  }
};


