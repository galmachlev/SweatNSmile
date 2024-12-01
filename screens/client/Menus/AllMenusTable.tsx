import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';

// טיפוס המייצג פריט אוכל
type FoodItem = {
  id: string; // מזהה ייחודי לכל פריט אוכל
  name: string; // שם הפריט (למשל: "תפוח" או "חזה עוף")
  quantity: number; // הכמות של הפריט בגרמים
  calories: number; // מספר הקלוריות בפריט
  protein: number; // כמות החלבון בפריט בגרמים
  fat: number; // כמות השומן בפריט בגרמים
  carbs: number; // כמות הפחמימות בפריט בגרמים
};

// טיפוס המייצג ארוחה, כאשר כל קטגוריה בתוך הארוחה מציינת פריט אוכל
type Meal = {
  [category: string]: FoodItem; // כל קטגוריה (כגון 'פחמימות', 'חלבון') מכילה פריט אוכל מסוג FoodItem
};

// טיפוס המייצג תפריט, הכולל תאריך, מזהה תפריט וארוחות מסוג Meal
type Menu = {
  date: string | number | Date; // תאריך התפריט
  menuId: string; // מזהה ייחודי לתפריט
  meals: {
    [mealType: string]: Meal; // סוג ארוחה (למשל, 'בוקר', 'צהריים')  
  };
};


const AllMenusTable = () => {
  const { currentUser } = useUser(); // משתנה שמכיל את פרטי המשתמש הנוכחי
  const [menus, setMenus] = useState<Menu[]>([]); // שמירה של רשימת התפריטים
  const [loading, setLoading] = useState(false); // משתנה למעקב אחרי מצב טעינת הנתונים
  const [error, setError] = useState(''); // משתנה להחזקת הודעת שגיאה
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null); // משתנה לשמירת התפריט שנבחר
  const [showModal, setShowModal] = useState(false); // משתנה לצורך הצגת/הסתרת המודל

  // פונקציה לטעינת התפריטים מהשרת
  const fetchUserMenus = async () => {
    if (!currentUser?.email) return; // אם אין אימייל למשתמש, לא נטען נתונים
    setLoading(true); // מתחילים את טעינת הנתונים
    setError(''); // מנקים את הודעת השגיאה אם הייתה
    try {
      let response = await fetch(`https://database-s-smile.onrender.com/api/users/menus/${currentUser.email}`);
      if (response.ok) {
        let data = await response.json();
        setMenus(data); // מעדכנים את הנתונים בסטייט
      } else {
        setError('you have no menus yet!'); 
      }
    } catch (err) {
      setError('An error occurred while fetching menus.'); // הצגת שגיאה במידה ויש בעיה בהתחברות
    } finally {
      setLoading(false); // מסיימים את טעינת הנתונים
    }
  };

  useEffect(() => {
    fetchUserMenus(); // טוענים את התפריטים כאשר המשתמש קיים
  }, [currentUser]); // כל פעם שמשתמש משתנה, נטען מחדש את הנתונים

  const handleViewDetails = (menu: Menu) => {
    setSelectedMenu(menu); // שמירת התפריט שנבחר
    setShowModal(true); // הצגת המודל עם פרטי התפריט
  };

  // חישוב קלוריות טוטאל של כל ארוחה בתפריט
  const calculateMealCalories = (meal: Meal) => {
    return Object.values(meal).reduce((sum, item) => sum + item.calories, 0); // סיכום קלוריות מכל פריט בארוחה
  };
  
  // חישוב קלוריות טוטאל של כל התפריט
  const calculateTotalCalories = (menu: Menu) => {
    return Object.values(menu.meals).reduce(
      (sum, meal) => sum + calculateMealCalories(meal), // חישוב קלוריות עבור כל ארוחה
      0
    );
  };

  // חישוב מאקרו-נוטריינטים עבור כל ארוחה
  const calculateMealMacros = (meal: Meal) => {
    return Object.values(meal).reduce(
      (sum, item) => ({
        protein: sum.protein + item.protein, // חישוב חלבון
        fat: sum.fat + item.fat, // חישוב שומן
        carbs: sum.carbs + item.carbs, // חישוב פחמימות
      }),
      { protein: 0, fat: 0, carbs: 0 } // אתחול ערכים בהתחלה
    );
  };

  // חישוב מאקרו-נוטריינטים עבור כל התפריט
  const calculateTotalMacros = (menu: Menu) => {
    return Object.values(menu.meals).reduce(
      (totals, meal) => {
        const mealMacros = calculateMealMacros(meal); // חישוב מאקרו עבור כל ארוחה
        return {
          protein: totals.protein + mealMacros.protein, // חיבור חלבון
          fat: totals.fat + mealMacros.fat, // חיבור שומן
          carbs: totals.carbs + mealMacros.carbs, // חיבור פחמימות
        };
      },
      { protein: 0, fat: 0, carbs: 0 } // אתחול ערכים בהתחלה
    );
  };  

  // פונקציה להצגת פרטי התפריט
  const renderMenuItem = ({ item }: { item: Menu }) => (
    <View style={styles.menuItem}>
      <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text> {/* הצגת התאריך */}
      <TouchableOpacity style={styles.detailsButton} onPress={() => handleViewDetails(item)}>
        <Text style={styles.detailsButtonText}>View Details</Text> {/* כפתור להצגת פרטים נוספים */}
        <MaterialIcons name="arrow-forward" size={20} color="#FFF" /> {/* אייקון של חץ */}
      </TouchableOpacity>
    </View>
  );

  // פונקציה לקבלת צבע גבול על פי סוג הארוחה
  const getBorderColor = (mealType: string) => {
    const colors: { [key: string]: string } = {
      Breakfast: '#FFCE76',
      Lunch: '#F8D675',
      Dinner: '#FDE598',
      Extras: '#E8A54B',
    };
    return colors[mealType] || '#FBF783'; // מחזיר את הצבע המתאים לכל סוג ארוחה
  };
  
  return (
    <View style={styles.container}>
      
      {/* כותרת בראש הדף */}
      <Text style={styles.headerText}>All Your Menus</Text>
      
      {/* אם המידע בטעינה, מציגים אינדיקטור טעינה */}
      {loading && <ActivityIndicator size="large" color="#3E6613" />}
      
      {/* אם יש שגיאה, מציגים את הודעת השגיאה */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {/* אם לא נמצאו תפריטים, מציגים הודעה */}
      {!loading && menus.length === 0 ? <Text style={styles.noMenusText}>No menus found.</Text> : null}
      
      {/* הצגת התפריטים בתוך FlatList */}
      <FlatList
        data={menus} // מקור הנתונים - התפריטים
        renderItem={renderMenuItem} // פונקציה שמציגה את כל פריט בתפריט
        keyExtractor={(item) => item.menuId} // מזהה ייחודי לכל פריט
        contentContainerStyle={styles.listContainer} // סגנון עבור התוכן של רשימת התפריטים
      />

      {/* המודל שמציג פרטים נוספים על התפריט */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>

              {/* כותרת בתוך המודל */}
              <Text style={styles.modalTitle}>Menu Details</Text>

                {/* סך קלוריות */}
                <View style={styles.caloriesContainer}>
                  <View style={styles.outerCircle}>
                    <View style={styles.middleCircle}>
                      <View style={styles.inner2Circle}>
                        <View style={styles.inner1Circle}>
                          <Text style={styles.caloriesNum}>
                            {/* הצגת סך הקלוריות של התפריט */}
                            {selectedMenu ? calculateTotalCalories(selectedMenu) : 0}
                          </Text>
                          <Text style={styles.caloriesLabel}>calories</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* סך מאקרו-נוטריינטים (חלבון, שומן, פחמימות) */}
                {selectedMenu && selectedMenu.meals && Object.keys(selectedMenu.meals).length > 0 ? (
                  <View style={styles.macros}>
                    {Object.entries(calculateTotalMacros(selectedMenu))
                      .filter(([key]) => key !== 'calories') // מסנן את 'calories' מהתצוגה
                      .map(([key, value]) => (
                        <View key={key} style={styles.macroItem}>
                          <Text style={styles.macroLabel}>
                            {/* הצגת שם המאקרו עם אות ראשונה גדולה */}
                            {`${key.charAt(0).toUpperCase() + key.slice(1)} (g)`} 
                          </Text>
                          <View style={styles.macroValueContainer}>
                            <Text style={styles.macroValue}>{value.toFixed(1)}</Text> {/* הצגת ערך המאקרו עם ספרה אחת אחרי הנקודה */}
                          </View>
                        </View>
                      ))}
                  </View>
                ) : null}

              {/* הצגת פרטי הארוחות */}
              {selectedMenu && selectedMenu.meals && Object.keys(selectedMenu.meals).length > 0 ? (
                Object.keys(selectedMenu.meals).map((mealType) => (
                  <View key={mealType} style={[styles.mealSection, { borderColor: getBorderColor(mealType) }]}>
                    
                    {/* שם הארוחה וסך הקלוריות שלה */}
                    <Text style={styles.mealTitle}>
                      {mealType} -{' '}
                      <Text style={styles.caloriesText}>
                        {calculateMealCalories(selectedMenu.meals[mealType])} calories
                      </Text>
                    </Text>

                    {/* הצגת מאקרו-נוטריינטים של הארוחה */}
                    <Text style={styles.macrosText}>
                      <Text style={styles.macrosValue}>
                        Protein: {calculateMealMacros(selectedMenu.meals[mealType]).protein.toFixed(1)}g
                        {' '} | {' '}
                        Fat: {calculateMealMacros(selectedMenu.meals[mealType]).fat.toFixed(1)}g
                        {' '} | {' '}
                        Carbs: {calculateMealMacros(selectedMenu.meals[mealType]).carbs.toFixed(1)}g
                      </Text>
                    </Text>

                    {/* הצגת פרטי כל פריט בתוך הארוחה */}
                    {Object.entries(selectedMenu.meals[mealType]).map(([category, item]) => (
                      <View key={item.id} style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemInfo}>
                          Quantity: {item.quantity}g | Calories: {item.calories.toFixed(0)} | {"\n"}
                          Protein: {item.protein.toFixed(1)}g | Fat: {item.fat.toFixed(1)}g | Carbs: {item.carbs.toFixed(1)}g
                        </Text>
                      </View>
                    ))}
                  </View>
                )) 
              ) : (  
                <Text style={styles.noItemsText}>No items added.</Text> //אם אין פריטים בארוחה, מציגים הודעה
              )}

              {/* כפתור סגירה למודל */}
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// סטיילים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFE',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E6613',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#696B6D',
  },
  menuDateText: {
    fontSize: 14,
    color: '#3E6613', // צבע ירוק כהה שמותאם לצבעים באפליקציה
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20, // להוסיף ריווח בין השורות
  },
  menuDateLabel: {
    marginTop: 20,
    fontSize: 14,
    color: '#3E6613', // צבע ירוק כהה שמותאם לצבעים באפליקציה
    textAlign: 'center',
    fontWeight: 'bold',
  },  
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E6613',
    padding: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#FFF',
    marginRight: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  noMenusText: {
    textAlign: 'center',
    color: '#696B6D',
  },
  listContainer: {
    paddingBottom: 100,
  },
  caloriesText: {
    fontSize: 14, 
},
macrosText: {
  marginBottom: 25,
  color: '#3E6613',

},

macrosValue: {
  fontSize: 12,  // גודל טקסט קטן יותר
  color: '#3E6613',  // צבע ירוק כהה כדי להבדיל את המאקרוזים
},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mealDetailsContainer: {
    marginBottom: 20,
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
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#3E6613',
  },
  itemDetails: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemInfo: {
    fontSize: 12,
    color: '#696B6D',
  },
  noItemsText: {
    fontSize: 14,
    color: '#696B6D',
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#3E6613',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  caloriesContainer: {
    alignItems: 'center',
  },
  outerCircle: {
    width: 135,
    height: 135,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#E8A54B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 125,
    height: 125,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#FFCE76',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner2Circle: {
    width: 115,
    height: 115,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#F8D675',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner1Circle: {
    width: 105,
    height: 105,
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

});

export default AllMenusTable;
