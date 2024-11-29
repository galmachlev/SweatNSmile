import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity,TextInput,ActivityIndicator,ScrollView,TouchableWithoutFeedback, Modal, Alert,} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import { searchFood } from './edamamApi';
import { SelectList } from 'react-native-dropdown-select-list';
import { Meal, mealData } from './FoodData';
import { FoodItem, FoodCategory, FoodData } from '../Menus/FoodData'; // Import from the new file
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: Text strings must be rendered within a <Text> component.'
]);

// הגדרת טיפוס למבנה נתונים המייצג את נראות פרטי המזון בכל ארוחה ובקטגוריות
interface DetailsVisibility {
  // המפתח הוא סוג הארוחה (כמו 'Breakfast', 'Lunch', 'Dinner', 'Extras')
  [mealType: string]: {
    // המפתח הוא קטגוריית המזון (כמו 'protein', 'carbs', 'fat', 'vegetable')
    [category: string]: boolean; // הערך הבוליאני מציין אם פרטי המזון מוצגים או לא
  };
}

// טיפוס של פריטי המזון שנבחרו, כל ארוחה מכילה קטגוריות עם פריטי מזון או null
type SelectedItemsType = Record<string, Record<string, FoodItem | null>>;

const DailyMenu: React.FC = () => {
  const { currentUser, calculateDailyCalories } = useUser(); // גישה למשתמש הנוכחי וחישוב קלוריות יומיות
  const [dailyCalories, setDailyCalories] = useState<number>(0); // משתנה לשמירת סך הקלוריות היומיות
  const [macros, setMacros] = useState<{ protein: number; carbs: number; fat: number; calories: number }>({ protein: 0, carbs: 0, fat: 0, calories: 0 }); // שמירת ערכי המאקרו היומיים
  const [meals, setMeals] = useState<Meal[]>([]); // שמירת רשימת הארוחות
  const [showSearch, setShowSearch] = useState<boolean>(false); // שליטה בהצגת תיבת החיפוש
  const [searchQuery, setSearchQuery] = useState<string>(''); // ערך הקלט לחיפוש
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]); // תוצאות החיפוש
  const [loading, setLoading] = useState<boolean>(false); // סטטוס טעינה
  const [error, setError] = useState<string>(''); // הודעת שגיאה
  const [subcategories, setSubcategories] = useState<Record<string, FoodCategory[]>>({}); // קטגוריות משנה של פריטי המזון
  const [selectedItems, setSelectedItems] = useState<Record<string, Record<string, FoodItem | null>>>({ Breakfast: {}, Lunch: {}, Dinner: {}, Extras: {} }); // פריטים שנבחרו לכל ארוחה
  const [showModal, setShowModal] = useState(false); // שליטה בהצגת המודל הכללי
  const [showModalSave, setShowModalSave] = useState(false); // שליטה בהצגת מודל השמירה
  const [detailsVisibility, setDetailsVisibility] = useState<DetailsVisibility>({}); // מצב הצגת פרטים לפי ארוחה וקטגוריה
  const [mealCalories, setMealCalories] = useState<{ [key: string]: number }>({}); // סך הקלוריות לכל ארוחה
  const [extrasCalories, setExtrasCalories] = useState(0); // סך הקלוריות של פריטי ה-Extras
  const [tempSelections, setTempSelections] = useState<SelectedItemsType>({}); // פריטים שנבחרו זמנית
  const [resetClicked, setResetClicked] = useState(false); // מעקב אחרי לחיצה על ריסט
  const [resetCounter, setResetCounter] = useState(0); // ספירה של פעולות הריסט
  const [showModalDelete, setShowModalDelete] = useState(false); // שליטה בהצגת מודל מחיקה
  const [itemToDelete, setItemToDelete] = useState(null); // פריט שמיועד למחיקה

  // פונקציה לקבלת צבע גבול לפי סוג הארוחה
  const getBorderColor = (mealType: string): string => {
    const colors: Record<string, string> = {
        Breakfast: '#FFCE76', // צבע לארוחת בוקר
        Lunch: '#F8D675',    // צבע לארוחת צהריים
        Dinner: '#FDE598',   // צבע לארוחת ערב
        Extras: '#E8A54B',   // צבע לאקסטרות
    };
    return colors[mealType] || '#FBF783'; // ברירת מחדל לצבע
  };

  // פונקציה לשמירת תפריט לשרת
  const saveMenu = async () => {
    const email = currentUser?.email; // מקבל את המייל של המשתמש הנוכחי
    const menuData = {
        email,
        meals: selectedItems, // הארוחות שנבחרו
        totalMacros: macros,  // סך המאקרונוטריינטים
    };

    try {
        let res = await fetch('https://database-s-smile.onrender.com/api/users/saveMenu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menuData), // המרה ל-JSON
        });

        // בדיקה אם הבקשה הצליחה
        if (res.ok) {
            Alert.alert('Success', 'Menu saved successfully!');
        } else {
            Alert.alert('Error', 'Failed to save the menu.');
        }
    } catch (error) {
        console.error('Error saving menu:', error); // שגיאה בעת שליחה
        Alert.alert('Error', 'An error occurred while saving the menu.');
    }
  };

  // חישוב קלוריות יומיות כשהמשתמש או נתונים קשורים משתנים - משתמש בנוסחאות שנמצאות ביוזר קונטקסט
  useEffect(() => {
    if (currentUser) {
        const result = calculateDailyCalories(
            currentUser.gender || '',         // מגדר
            String(currentUser.height || ''), // גובה
            String(currentUser.currentWeight || ''), // משקל נוכחי
            String(currentUser.goalWeight || ''),    // משקל יעד
            currentUser.activityLevel || '',   // רמת פעילות
            currentUser.age || 0               // גיל המשתמש
        );

        if (currentUser.age === undefined || currentUser.age === 0) {
            console.error("Error: User's age is missing!"); // הודעת שגיאה אם הגיל חסר
        }

        if (result) {
            setDailyCalories(result.RecommendedDailyCalories); // הגדרת קלוריות יומיות
        }
    }
  }, [currentUser, calculateDailyCalories]); // מאזין לשינויים במשתמש ובפונקציית החישוב

  // אחוזים לקלוריות לפי ארוחה
  const mealDistribution = {
    Breakfast: 0.25,
    Lunch: 0.4,
    Dinner: 0.25,
    Extras: 0.1
  };

  // אחוזים לקלוריות לפי מאקרונוטריינטים
  const nutrientDistribution = {
    Protein: 0.35,
    Fat: 0.15,
    Carb: 0.35,
    Vegetable: 0.075,
    Fruit: 0.075,
  };

  // חישוב חלוקת קלוריות ומאקרונוטריינטים
  function calculateMealNutrientDistribution(dailyCalories: number) {
    const mealCalories: { [key: string]: number } = {}; // קלוריות לארוחות
    const nutrientCalories: { [key: string]: number } = {}; // קלוריות לפי רכיבי מזון

    // חישוב קלוריות עבור כל ארוחה
    for (const meal in mealDistribution) {
        mealCalories[meal] = parseFloat((dailyCalories * mealDistribution[meal]).toFixed(2));
    }

    // חישוב מאקרונוטריינטים בהתבסס על קלוריות כוללות
    const totalMealCalories = Object.values(mealCalories).reduce((a, b) => a + b, 0);
    for (const nutrient in nutrientDistribution) {
        nutrientCalories[nutrient] = parseFloat((totalMealCalories * nutrientDistribution[nutrient]).toFixed(2));
    }

    return {
        mealCalories,
        nutrientCalories,
    };
  }

  // עדכון קלוריות לפי שינוי ב-dailyCalories
  useEffect(() => {
    const { mealCalories: calculatedMealCalories } = calculateMealNutrientDistribution(dailyCalories);
    setMealCalories(calculatedMealCalories); // עדכון state של קלוריות לפי ארוחה
  }, [dailyCalories]);

  // התאמת פריט מזון לפי קלוריות יעד
  function adjustFoodItem(item: FoodItem, targetCalories: number): FoodItem {
    const scalingFactor = targetCalories / item.calories; // פקטור ההתאמה
    return {
        ...item,
        calories: parseFloat(targetCalories.toFixed(0)),       // קלוריות מותאמות
        protein: parseFloat((item.protein * scalingFactor).toFixed(1)), // חלבון מותאם
        fat: parseFloat((item.fat * scalingFactor).toFixed(1)),         // שומן מותאם
        carbs: parseFloat((item.carbs * scalingFactor).toFixed(1)),     // פחמימות מותאמות
        quantity: parseFloat((item.quantity * scalingFactor).toFixed(1)), // כמות מותאמת
    };
  }

  // יצירת תפריט יומי
  const generateDailyMenu = () => {
    // רשימת הארוחות בתפריט
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Extras'];

    // משתנה שמכיל את הפריטים שנבחרו לכל ארוחה
    const updatedSelectedItems: SelectedItemsType = {
      Breakfast: {},
      Lunch: {},
      Dinner: {},
      Extras: {},
    };

    // אובייקט לשמירת הקלוריות המוקצות לכל קטגוריה בכל ארוחה
    const allocatedCalories: { [key: string]: { [key: string]: number } } = {
      Breakfast: {},
      Lunch: {},
      Dinner: {},
      Extras: {},
    };

    // חישוב חלוקת הקלוריות בין הארוחות על בסיס כמות הקלוריות היומית
    const distribution = calculateMealNutrientDistribution(dailyCalories);

    // לולאה על כל סוגי הארוחות
    meals.forEach(mealType => {
      // הקצאת הקלוריות לארוחה הנוכחית לפי החלוקה
      const mealCalories = distribution.mealCalories[mealType];

      // יצירת פריט עבור כל קטגוריה (חלבון, פחמימה וכו') לפי חלוקת המאקרונוטריינטים
      Object.keys(nutrientDistribution).forEach(nutrient => { 
        
        const nutrientCalories = mealCalories * nutrientDistribution[nutrient as keyof typeof nutrientDistribution]; // חישוב הקלוריות עבור הקטגוריה הספציפית
        const item = getRandomItemForCategory(mealType, nutrient, nutrientCalories); // שליפת פריט אקראי שמתאים לקטגוריה ולכמות הקלוריות
        
        if (item) {
          const adjustedItem = adjustFoodItem(item, nutrientCalories); // התאמת הפריט לכמות הקלוריות הנדרשת
          updatedSelectedItems[mealType][nutrient] = adjustedItem; // הוספת הפריט למבנה הנתונים של הפריטים שנבחרו
          allocatedCalories[mealType][nutrient] = adjustedItem.calories; // עדכון הקלוריות המוקצות לקטגוריה זו
        }
      });
    });

    setSelectedItems(updatedSelectedItems); // עדכון מצב הפריטים שנבחרו
    setTempSelections(updatedSelectedItems); // שמירת הבחירות הזמניות עבור עריכה
    updateMacros(updatedSelectedItems); // עדכון ערכי המאקרונוטריינטים על בסיס הפריטים שנבחרו
    setResetClicked(false); // איפוס מצב הכפתור של הריסט
    setExtrasCalories(0); // איפוס הקלוריות של הקטגוריה Extras
  };

  // בוחרת פריט אקראי מתוך קטגוריה מסוימת וסוג ארוחה, בהתבסס על קלוריות יעד
  const getRandomItemForCategory = (mealType: string, category: string, targetCalories: number): FoodItem | null => {
    // מחפשים את רשימת הפריטים לפי סוג הארוחה והקטגוריה
    const categoryItems = mealData
      .find(meal => meal.mealName === mealType)?.categories
      .find(cat => cat.category === category)?.items || [];
      
    // מחזירים null אם אין פריטים בקטגוריה
    if (categoryItems.length === 0) return null;
    // בוחרים פריט אקראי מתוך הרשימה
    const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
    // מחזירים את הפריט מבלי לשנות את הקלוריות
    return { ...randomItem };
  };

  // יוזם את מצב התצוגה (פרטי הפריטים יהיו מוסתרים כברירת מחדל)
  useEffect(() => {
    const initialVisibility = Object.fromEntries(
        ['Breakfast', 'Lunch', 'Dinner', 'Extras'].map(mealType => [
            mealType,
            // ממפה כל תת-קטגוריה לאובייקט עם ערך ראשוני false (מוסתר)
            Object.fromEntries(subcategories[mealType]?.map(subcategory => [subcategory.category, false]) || [])
        ])
    );
    setDetailsVisibility(initialVisibility); // מעדכן את הסטייט
  }, [subcategories]); // רץ מחדש כאשר subcategories משתנה

  
  // משנה את מצב התצוגה של תת-קטגוריה מסוימת
  const toggleDetails = (mealType: string, itemId: string) => {
    setDetailsVisibility(prev => ({
        ...prev, // שומר על המצב הקודם
        [mealType]: {
            ...prev[mealType], // שומר על מצב הארוחות האחרות
            [itemId]: !prev[mealType]?.[itemId], // הופך את המצב הנוכחי של הפריט
        },
    }));
  };

  // מטפלת בבחירת פריט ומעדכנת אותו לפי קלוריות יעד
  const handleSelect = (selected: FoodItem | null, mealType: string, category: string, targetCalories: number) => {
    if (selected) {
        // מתאים את הפריט הנבחר על בסיס קלוריות היעד
        const adjustedItem = adjustFoodItem(selected, targetCalories); 
        
        // מעדכן את הסטייט של הפריטים שנבחרו
        setSelectedItems(prev => {
            const newSelectedItems = {
                ...prev, // שומר על הפריטים שנבחרו עד כה
                [mealType]: {
                    ...prev[mealType], // שומר על הפריטים האחרים באותה ארוחה
                    [category]: adjustedItem, // מעדכן את הפריט החדש בקטגוריה הנכונה
                },
            };
            updateMacros(newSelectedItems); // מעדכן את המאקרו
            return newSelectedItems; // מחזיר את הסטייט החדש
        });
    }
  };

  // פונקציה למציאת פריט על פי מזהה ייחודי (id)
  const FindItem = (id: string) => { 
    let categories = mealData.find(meal => meal.mealName[0] === id[0])?.categories || []; // מחפש את הקטגוריות המתאימות לארוחה על פי האות הראשונה של המזהה
    let items = categories.find(cat => cat.code === id[1])?.items || []; // מוצא את הפריטים שבקטגוריה הרלוונטית על פי האות השנייה של המזהה
    let item = items.find(item => item.id === id) || null; // מוצא את הפריט הספציפי על פי ה-id המלא
    let mealType = id[0]=='B'?'Breakfast':id[0]=='L'?'Lunch':id[0]=='D'?'Dinner':'Extras'; // מזהה את סוג הארוחה לפי התו הראשון של ה-id
    let cat = categories.find(cat => cat.code === id[1])?.category || ''; // מוצא את שם הקטגוריה על פי הקוד השני של ה-id
    let targetCalories = mealCalories[mealType] * nutrientDistribution[cat]; // מחשב את כמות הקלוריות המטרה על בסיס חלוקה תזונתית
    
    // קורא לפונקציה שמטפלת בבחירת הפריט, ומעביר את המידע שמצאנו
    handleSelect(item, mealType, cat, targetCalories);

    // הדפסה לצורכי ניפוי שגיאות ובדיקת הנתונים שנבחרו
    // console.log("Selected Item:", item);
    // console.log("Target Calories:", targetCalories); 
    // console.log("ID:", id);
  }

  // פונקציה שפועלת בעת בחירת פריט מתוך הרשימה של החיפוש והוספה בשביל לארוחת האקסטרה
  const handleSelectFood = (item: any) => {
      if (item.food) {
        const newFood: FoodItem = {
          id: item.food.foodId,
          name: item.food.label,
          calories: item.food.nutrients.ENERC_KCAL,
          protein: item.food.nutrients.PROCNT,
          fat: item.food.nutrients.FAT,
          carbs: item.food.nutrients.CHOCDF,
          quantity: item.food.measure || 'grams' // המידה אם קיימת
        };
    
        // עדכון `selectedItems` כך שהפריט יופיע ישירות בקטגוריית "Extras"
        setSelectedItems(prevItems => ({
          ...prevItems,
          Extras: {
            ...prevItems.Extras,
            [newFood.name]: newFood, // הגדרת השם ישירות כערך המוצג
          },
        }));
    
        // עדכון המאקרו הכולל לפי הפריט החדש
        setMacros(prevMacros => ({
          protein: parseFloat((prevMacros.protein + newFood.protein).toFixed(1)),
          fat: parseFloat((prevMacros.fat + newFood.fat).toFixed(1)),
          carbs: parseFloat((prevMacros.carbs + newFood.carbs).toFixed(1)),
          calories: parseFloat((prevMacros.calories + newFood.calories).toFixed(1)),
        }));
    
        // עדכון הקלוריות של האקסטרות
        setExtrasCalories(prevCalories => prevCalories + newFood.calories);
    
        // הוספת הפריט לקטגוריית "Extras" ב-`subcategories` להצגה ישירה
        setSubcategories(prevSubcategories => ({
          ...prevSubcategories,
          Extras: [
            ...(prevSubcategories.Extras || []),
            {
              category: "Extras",
              items: [...(prevSubcategories.Extras?.find(cat => cat.category === "Extras")?.items || []), newFood]
            }
          ],
        }));
    
        // איפוס תוצאות החיפוש וסגירת תיבת החיפוש
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
  };
      
  // Update macros based on selected items
  const updateMacros = (tempSelections: SelectedItemsType) => {
    if (!tempSelections) return; // Check if selectedItems exist
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalCalories = 0;

    Object.keys(tempSelections).forEach(mealType => {
      const categories = tempSelections[mealType] || {};
      Object.keys(categories).forEach(category => {
        const tempSelections = categories[category];
        if (tempSelections) {
          totalProtein += tempSelections.protein || 0;
          totalFat += tempSelections.fat || 0;
          totalCarbs += tempSelections.carbs || 0;
          totalCalories += tempSelections.calories || 0;
        }
      });
    });

    setMacros({
      protein: parseFloat(totalProtein.toFixed(1)),
      fat: parseFloat(totalFat.toFixed(1)),
      carbs: parseFloat(totalCarbs.toFixed(1)),
      calories: parseFloat(totalCalories.toFixed(1)),
    });
  };
         
  // Show selected item details below each selected food item
  const renderSelectedItemDetails = (mealType: string, category: string) => {
    const item = selectedItems[mealType]?.[category];
    if (!item) return null;
  
    return (
      <Text style={styles.selectedItemDetails}>
         Quantity(g): {item.quantity} | Calories: {item.calories} | P(g): {item.protein} | F(g): {item.fat} | C(g): {item.carbs}
      </Text>
    );
  };
  
  // Fetches food data from FoodData.tsx
  const fetchFoodData = async (): Promise<FoodData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data: FoodData = {
          breakfastCategories: mealData.find(meal => meal.mealName === 'Breakfast')?.categories || [],
          lunchCategories: mealData.find(meal => meal.mealName === 'Lunch')?.categories || [],
          dinnerCategories: mealData.find(meal => meal.mealName === 'Dinner')?.categories || [],
        };
        resolve(data);
      }, 1000);
    });
  };
    
  // Fetches food data and initializes meal categories.
  const loadFoodItems = async () => {
    setLoading(true);
    setError('');
    try {
      const foodData: FoodData = await fetchFoodData();
      const categories = ['Breakfast', 'Lunch', 'Dinner'];
      const initialMeals = categories.map(mealType => ({
        mealName: mealType,
        categories: foodData[mealType.toLowerCase() + 'Categories' as keyof FoodData] || [],
      }));
  
      setMeals(initialMeals);
      setSubcategories({
        Breakfast: foodData.breakfastCategories || [],
        Lunch: foodData.lunchCategories || [],
        Dinner: foodData.dinnerCategories || [],
        Extras: [],
      });
    } catch {
      setError('Error fetching food data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load food items on component mount
  useEffect(() => {
    loadFoodItems();
  }, []);

  useEffect(() => {
    if (dailyCalories > 0) {
        generateDailyMenu();
    }
  }, [dailyCalories]);
 
  // Handle search query change
  const handleSearch = async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        setError('');
        try {
          const data = await searchFood(searchQuery);
          setSearchResults(data.hints || []);
        } catch (err) {
          setError('Error fetching data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
  };
  
  // Handle search icon press
  const handleSearchIconPress = () => setShowSearch(true);
    
  // Handle outside press
  const handleOutsidePress = () => {
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
  };
  
  useEffect(() => {
    if (resetClicked) {
      generateDailyMenu();
      setTempSelections({});
      setResetClicked(false); // Reset the flag after generating the menu
    }
  }, [resetClicked]); // This useEffect is triggered only when resetClicked is set to true
  
  // פונקציה למחיקת פריט מתוך Extras
  const deleteExtraItem = (itemName: string) => {
    const itemToRemove = selectedItems.Extras?.[itemName];
  
    if (!itemToRemove) {
      console.log("Item not found in Extras, nothing to delete");
      return;
    }
  
    console.log("Deleting Extra Item:", itemToRemove);
  
    // עדכון הקלוריות
    setExtrasCalories((prevCalories) => prevCalories - (itemToRemove.calories || 0));
  
    // מחיקת הפריט מתוך ה-state של Extras
    setSelectedItems((prevSelectedItems) => {
      const updatedExtras = { ...prevSelectedItems.Extras };
      delete updatedExtras[itemName]; // מחיקת הפריט מתוך Extras
      return {
        ...prevSelectedItems,
        Extras: updatedExtras,
      };
    });
  };

  // פונקציה לטיפול באישור מחיקה
  const handleDeleteExtraItem = () => {
    if (itemToDelete) {
      deleteExtraItem(itemToDelete); // מחיקת הפריט
    }
    setShowModalDelete(false); // סגירת המודל
    setItemToDelete(null); // איפוס הפריט למחיקה
  };

  useEffect(() => {
    // חישוב המאקרו מחדש כאשר `selectedItems` מתעדכן
    const newMacros = calculateMacros(selectedItems);
    setMacros(newMacros);
  }, [selectedItems]); // trigger when selectedItems change
      
  const calculateMacros = (tempSelections: SelectedItemsType) => {
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalCalories = 0;
  
    Object.keys(tempSelections).forEach(mealType => {
      const categories = tempSelections[mealType] || {};
      Object.values(categories).forEach((item) => {
        if (item) {
          totalProtein += item.protein || 0;
          totalFat += item.fat || 0;
          totalCarbs += item.carbs || 0;
          totalCalories += item.calories || 0;
        }
      });
    });
  
    return {
      protein: parseFloat(totalProtein.toFixed(1)),
      fat: parseFloat(totalFat.toFixed(1)),
      carbs: parseFloat(totalCarbs.toFixed(1)),
      calories: parseFloat(totalCalories.toFixed(1)),
    };
  };
  
  // פונקציה לאתחול התפריט
  const handleReset = () => {
    setResetCounter(prevCounter => prevCounter + 1);// עדכן את המונה כדי לגרום לאתחול מחדש
    setShowModal(false);
    setResetClicked(true);
    setSelectedItems({ Breakfast: {}, Lunch: {}, Dinner: {}, Extras: {} });
    setMacros({ protein: 0, carbs: 0, fat: 0, calories: 0 });
    setExtrasCalories(0);
    setTempSelections({});
    setDetailsVisibility({
      Breakfast: { Carb: false, Fat: false, Fruit: false, Protein: false, Vegetable: false },
      Lunch: { Carb: false, Fat: false, Fruit: false, Protein: false, Vegetable: false },
      Dinner: { Carb: false, Fat: false, Fruit: false, Protein: false, Vegetable: false },
      Extras: { Carb: false, Fat: false, Fruit: false, Protein: false, Vegetable: false },
    });
  };        
  
  // console.log(selectedItems.Extras)

  return (
    <ScrollView>
      
      {/* כפתור לאיפוס התפריט */}
      <TouchableOpacity 
        onPress={() => setShowModal(true)} // מציג את המודל לאישור איפוס התפריט
        style={styles.resetButton}
      >
        <Text style={styles.resetButtonText}>
          Generate new menu {/* טקסט על כפתור זה: "צור תפריט חדש" */}
        </Text>
        <MaterialIcons name="refresh" size={24} color="#FFF" /> {/* אייקון רענון */}
      </TouchableOpacity>

      {/* מודל לאישור איפוס התפריט */}
      <Modal transparent={true} visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>{/* מסך רקע כהה שמכסה את המסך */}
          <View style={styles.modalContainer}>{/* מיכל המודל */}
            <Text style={styles.modalTitle}>Reset Menu</Text>{/* כותרת המודל */}
            <Text style={styles.modalMessage}>Are you sure you want to reset the menu?</Text>{/* הודעת אישור */}
            <View style={styles.modalButtons}>{/* אזור כפתורים */}
              {/* כפתור אישור איפוס */}
              <TouchableOpacity onPress={handleReset} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Yes</Text>{/* טקסט על כפתור האישור */}
              </TouchableOpacity>
              {/* כפתור דחיית איפוס */}
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>No</Text>{/* טקסט על כפתור הדחייה */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* משמש כאשר יש צורך לעדכן את התצוגה בצורה דינמית, כמו במקרה של שינוי מסוים בתפריט או אינדיקציה לפעולה שהתרחשה */}
      <View style={styles.container}  key={resetCounter}> 

      {/* עיגול סך כל הקלוריות בתפריט */}
      <View style={styles.caloriesContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={styles.inner2Circle}>
              <View style={styles.inner1Circle}>
                <Text 
                  style={[
                    styles.caloriesNum, 
                    macros.calories > dailyCalories ? styles.overBudget : null // אם הסכום של הפריטים לאחר שמשתמש הוסיף פריטים לאקסטרה גדול מזה שהומלץ מתלכחילה אז חריגה - צביעה באדום
                  ]}
                >
                  {macros.calories.toFixed(0)}/
                </Text>
                <Text style={styles.caloriesNum}>{dailyCalories}</Text>
                <Text style={styles.caloriesLabel}>calories</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* סכימת כל הערכים של המאקרו-נוטריינטים */}
      <View style={styles.macros}>
        {Object.entries(macros)
          .filter(([key]) => key !== 'calories') // מסנן את מפתח 'calories' כי הוא כבר מוצג בנפרד
          .map(([key, value]) => (
            <View key={key} style={styles.macroItem}>
              <Text style={styles.macroLabel}>
                {`${key.charAt(0).toUpperCase() + key.slice(1)} (g)`}{/* ממיר את שם המפתח לאות ראשונה גדולה */}
              </Text>
              <View style={styles.macroValueContainer}>
                <Text style={styles.macroValue}>{value}</Text>{/* מציג את ערך המאקרו */}
              </View>
            </View>
          ))}
      </View>

        {/* מודל הטעינה של המונה */}
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
        {/* אם יש שגיאה, הצג את הודעת השגיאה */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Meal Sections */}
        {(['Breakfast', 'Lunch', 'Dinner'] as Array<string>).map((mealType) => (
          <View key={mealType} style={[styles.mealSection, { borderColor: getBorderColor(mealType) }]}>
            <Text style={styles.mealTitle}>
            {mealType} - <Text style={styles.caloriesText}>{Math.round(mealCalories[mealType] || 0)} cal</Text>
            </Text>
            {subcategories[mealType]?.length ? (
              subcategories[mealType].map((subcategory) => {
                const isVisible = detailsVisibility[mealType]?.[subcategory.category];

                // console.log(selectedItems[mealType][subcategory.category]?.name)

                return (
                  <View key={subcategory.category} style={styles.subcategory}>
                    <Text style={styles.subcategoryTitle}>{subcategory.category}</Text>
                    <View style={styles.selectContainer}>
                    <SelectList 
                        data={subcategory.items.map(item => ({ value: item.name, key: item.id }))}
                        setSelected={(item: any) =>  {resetClicked? setTempSelections({}) : setTempSelections(item)}}
                        placeholder={selectedItems[mealType][subcategory.category]?.name || "Select Food"}
                        onSelect={() => FindItem(tempSelections)}
                    />
                      <TouchableOpacity onPress={() => toggleDetails(mealType, subcategory.category)} style={styles.infoButton}>
                        <Icon name="info" size={20} color="#696B6D" />
                      </TouchableOpacity>
                    </View>
                    {isVisible && renderSelectedItemDetails(mealType, subcategory.category)}
                  </View>
                );
              })
            ) : (
              <Text>No food added yet.</Text>
            )}
          </View>
        ))}

        {/* קונטיינר ארוחת אקסטרות */}
        <View style={[styles.mealSection, { borderColor: getBorderColor('Extras') }]}> 
          <Text style={[styles.mealTitle, styles.caloriesText]}>
            Extras - {' '}
            <Text 
              style={[
                styles.caloriesText,
                extrasCalories > Math.round(mealCalories['Extras'] || 0) ? styles.overBudget : null
              ]}
            >
              {Math.round(extrasCalories || 0)} {/* הצגת סך הקלוריות של האקסטרות */}
            </Text> 
            / {Math.round(mealCalories['Extras'] || 0)} cal{/* הצגת סך הקלוריות שהוקצו לאקסטרות */}
          </Text>
          
          {/* אם יש פריטים באקסטרות */}
          {selectedItems.Extras && Object.values(selectedItems.Extras).length > 0 ? (
            Object.values(selectedItems.Extras).map((item: any) => ( // עבור כל פריט אקסטרה 
              <View key={item.id} style={styles.subcategory}>
                <Text style={[styles.selectedItemName, styles.itemContainer]}>{item.name}</Text>{/* הצגת שם הפריט */}
                
                {/* כפתור מחיקת פריט אקסטרה */}
                <TouchableOpacity 
                  onPress={() => { 
                    setShowModalDelete(true); // הצגת המודל למחיקת פריט
                    setItemToDelete(item.name); // הגדרת שם הפריט למחיקה
                  }} 
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={20} color="#f00" />{/* אייקון מחיקה */}
                </TouchableOpacity>

                {/* מודל לאישור מחיקת פריט אקסטרה */}
                <Modal transparent={true} visible={showModalDelete} animationType="fade">
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalMessage}>Are you sure you want to delete this item?</Text>{/* הודעת אישור למחיקה */}
                      <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={handleDeleteExtraItem} style={styles.confirmButton}>
                          <Text style={styles.confirmButtonText}>Yes</Text>{/* כפתור אישור למחיקה */}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowModalDelete(false)} style={styles.cancelButton}>
                          <Text style={styles.cancelButtonText}>No</Text>{/* כפתור ביטול מחיקה */}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                {/* כפתור הצגת פרטי אקסטרה */}
                <TouchableOpacity onPress={() => toggleDetails('Extras', item.id)} style={styles.infoButton}>
                  <Icon name="info" size={20} color="#696B6D" />{/* אייקון מידע */}
                </TouchableOpacity>                
                
                {/* הצגת פרטי פריט אקסטרה אם הם מוצגים */}
                <View style={styles.selectContainer}>
                  {detailsVisibility['Extras']?.[item.id] && (
                    <Text style={styles.selectedItemDetails}>
                      Calories: {item.calories.toFixed(0)} | P(g): {item.protein.toFixed(1)} | F(g): {item.fat.toFixed(1)} | C(g): {item.carbs.toFixed(1)}
                    </Text> // הצגת פרטי תזונה: קלוריות, חלבון, שומן, פחמימות
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text>No extras added yet.</Text> // אם אין פריטים באקסטרות 
          )}
        </View>

        {/* הכפתור של הוספת פריט לרשימת האקסטרות (+) */}
        <TouchableOpacity onPress={handleSearchIconPress} style={styles.floatingButton}>
          <FontAwesome name="plus" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* הצגת החיפוש של הפריט שעתיד להתווסף לרשימת האקסטרות */}
        {showSearch && ( // אם flag showSearch הוא true, הצג את תיבת החיפוש
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput} // סגנון תיבת הקלט
                    placeholder="Search for food to add" // טקסט רמז בתיבת הקלט
                    value={searchQuery} // הערך הנוכחי של חיפוש
                    onChangeText={setSearchQuery} // עדכון השאילתה בעת שינוי טקסט
                    onSubmitEditing={handleSearch} // קריאה לפונקציה בעת שליחה (לחיצה על אנטר)
                    autoFocus // התמקדות אוטומטית בתיבת החיפוש
                  />
                  {loading ? ( // אם אנחנו בטעות בטעינה
                    <ActivityIndicator size="small" color="#0000ff" /> // מציג את האינדיקטור של טעינה
                  ) : error ? ( // אם יש שגיאה
                    <Text style={styles.errorText}>{error}</Text> // מציג את השגיאה
                  ) : ( // אם לא בטעינה ואין שגיאה
                    <FlatList
                      data={searchResults} // מציג את התוצאות שחזרו מהחיפוש
                      renderItem={({ item }) => ( // עבור כל תוצאה בחיפוש
                        <TouchableOpacity
                          style={styles.resultItem} // סגנון עבור כל פריט תוצאה
                          onPress={() => handleSelectFood(item)} // לחיצה על פריט תוצאה כדי לבחור אותו
                        >
                          <Text style={styles.resultText}>{item.food?.label || 'Unknown Food'}</Text>{/* שם המזון או טקסט חלופי אם לא נמצא */}
                          <Text style={styles.resultDetail}>
                            Calories: {Number(item.food?.nutrients?.ENERC_KCAL || 0).toFixed(2)} cal
                          </Text>{/* קלוריות */}
                          <Text style={styles.resultDetail}>
                            Carbohydrates: {Number(item.food?.nutrients?.CHOCDF || 0).toFixed(2)} g
                          </Text>{/* פחמימות */}
                          <Text style={styles.resultDetail}>
                            Fat: {Number(item.food?.nutrients?.FAT || 0).toFixed(2)} g
                          </Text>{/* שומן */}
                          <Text style={styles.resultDetail}>
                            Protein: {Number(item.food?.nutrients?.PROCNT || 0).toFixed(2)} g
                          </Text>{/* חלבון */}
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.food?.foodId.toString() || Math.random().toString()} // מפתח ייחודי לכל פריט
                      ListEmptyComponent={() => <Text>No results found</Text>} // אם אין תוצאות, מציג הודעה
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}

      </View>

      {/* כפתור המפעיל את הפונקציה ששומרת בדאטה בייס בתוך דף AllMenusTable */}
      <TouchableOpacity onPress={saveMenu} style={styles.saveButton}>
        <Text style={styles.resetButtonText}>Save Menu</Text>
        <MaterialIcons name="save" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* המודל של כפתור השמירה */}
      <Modal transparent={true} visible={showModalSave} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Save Menu</Text>
              <Text style={styles.modalMessage}>Would you like to save this version as today's menu?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowModalSave(false)} style={styles.yesButton}>
                  <Text style={styles.confirmButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowModalSave(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>

    </ScrollView>
  );
};


// סטיילים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFE',
    paddingBottom: 100,
  },
  caloriesContainer: {
    alignItems: 'center',
  },
  outerCircle: {
    width: 155,
    height: 155,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#E8A54B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 145,
    height: 145,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#FFCE76',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner2Circle: {
    width: 135,
    height: 135,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#F8D675',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner1Circle: {
    width: 125,
    height: 125,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#FDE598',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesNum: {
    fontSize: 20,
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
    backgroundColor: '#696B6D',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
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
    borderLeftWidth: 25,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
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
    marginBottom: 10,
  },
  caloriesText: {
      fontSize: 14, 
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
  },
  mealList: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  foodList: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
  },
  foodItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 5,
  },
  foodListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  foodItemName: {
    fontSize: 16,
  },
  subcategory: {
    marginBottom: 10,
    width: '90%',
  },
  subcategoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  searchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    marginBottom: 10,
    padding: 5,
  },
  searchButton: {
    backgroundColor: '#E8A54B',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
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
    padding: 10,
  },
  saveButton: {
    padding: 20,
    marginBottom: 70,
    marginHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#3E6613', // צבע הרקע של הכפתור
    flexDirection: 'row', // מאפשר הצגת האייקון והטקסט באותה שורה
    alignItems: 'center', // ממרכז את התוכן
    justifyContent: 'center', // מרכז את האייקון
  },
  resetButton: {
    padding: 15,
    backgroundColor: '#FF7B7B', // צבע הרקע של הכפתור
    flexDirection: 'row', // מאפשר הצגת האייקון והטקסט באותה שורה
    alignItems: 'center', // ממרכז את התוכן
    justifyContent: 'center', // מרכז את האייקון
  },
  resetButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10, // מרווח בין הטקסט לאייקון
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 40,
    paddingHorizontal: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',  
    gap: 10,
  },
  confirmButton: {
    backgroundColor: '#FF7B7B', // Same as reset button
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  confirmButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  yesButton: {
    backgroundColor: '#3E6613', 
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#ccc', // Neutral color
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectContainer: {
    position: 'relative', // הגדרת מיקום עבור הילד
    width: '100%', // קבע את הרוחב ל-100% של הסקשן
  },
  infoButton: {
    position: 'absolute', // הפוך את הכפתור למיקום מוחלט
    right: -30, // מיקום הכפתור בקצה הימני של הקונטיינר
    top: '50%', // מרכז את הכפתור אנכית
    transform: [{ translateY: -10 }], // תיקון מרכז האנכי של הכפתור
  },
  deleteButton: {
    position: 'absolute', // הפוך את הכפתור למיקום מוחלט
    right: 10, // מיקום הכפתור בקצה הימני של הקונטיינר
    top: '50%', // מרכז את הכפתור אנכית
    transform: [{ translateY: -10 }], // תיקון מרכז האנכי של הכפתור
  },
  selectedItemDetails: {
    fontSize: 12,
    color: '#696B6D',
    marginTop: 2,
    paddingLeft: 20,
  },
  overBudget: {
    color: '#FF7B7B', // צבע אדום
  },
  selectedItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginLeft: 10,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#999', // Change to your desired border color
    borderRadius: 9,
    backgroundColor: '#FFFFFF', // Optional: background color
    padding: 12,
  },
  selectedItemName: {
    fontSize: 14, // עדכן את גודל הפונט כך שיתאים לשאר הפריטים
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 30,
  },
    infoButtonE: {
    marginLeft: 20,
  },
});

export default DailyMenu;
