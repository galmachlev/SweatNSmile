import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity,TextInput,ActivityIndicator,ScrollView,TouchableWithoutFeedback, Modal,} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/userContext';
import { searchFood } from './edamamApi';
import { SelectList } from 'react-native-dropdown-select-list';
import { Meal, mealData } from './FoodData';
import { FoodItem, FoodCategory, FoodData } from '../Menus/FoodData'; // Import from the new file

type SelectedItemsType = Record<string, Record<string, FoodItem | null>>;

// Main DailyMenu Component
const DailyMenu: React.FC = () => {
  const { currentUser, calculateDailyCalories } = useUser();
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const [macros, setMacros] = useState<{ protein: number; carbs: number; fat: number; calories: number }>({ protein: 0, carbs: 0, fat: 0, calories: 0 });
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [subcategories, setSubcategories] = useState<Record<string, FoodCategory[]>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, Record<string, FoodItem | null>>>({ Breakfast: {}, Lunch: {}, Dinner: {}, Extras: {} });
  const [showModal, setShowModal] = useState(false);
   

  // Function to get the border color based on the meal type
  const getBorderColor = (mealType: string): string => {
    const colors: Record<string, string> = {
      Breakfast: '#FFCE76',
      Lunch: '#F8D675',
      Dinner: '#FDE598',
      Extras: '#E8A54B',
    };
    return colors[mealType] || '#FBF783';
  };
    
  // Calculate daily calories when current user or related data changes
  useEffect(() => {
    if (currentUser) {
      const result = calculateDailyCalories(
        currentUser.gender || '',
        String(currentUser.height || ''),
        String(currentUser.currentWeight || ''),
        String(currentUser.goalWeight || ''),
        currentUser.activityLevel || ''
      );

      if (result) {
        setDailyCalories(result.RecommendedDailyCalories);
      }
    }
  }, [currentUser, calculateDailyCalories]);

  // Handle item selection
  const handleSelect = (selected: string | null, mealType: string, category: string, items: FoodItem[]) => {
    if (selected) {
      const item = items.find(item => item.name === selected) || null;
      setSelectedItems(prev => {
        const newSelectedItems = {
          ...prev,
          [mealType]: {
            ...prev[mealType],
            [category]: item,
          },
        };
        updateMacros(newSelectedItems); // עדכון המקרו לאחר הבחירה
        return newSelectedItems;
      });
    }};
  
  // Update macros based on selected items
  const updateMacros = (selectedItems: SelectedItemsType) => {
    if (!selectedItems) return; // Check if selectedItems exist
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalCalories = 0;
  
    Object.keys(selectedItems).forEach(mealType => {
      const categories = selectedItems[mealType] || {};
      Object.keys(categories).forEach(category => {
        const selectedItem = categories[category];
        if (selectedItem) {
          totalProtein += selectedItem.protein || 0;
          totalFat += selectedItem.fat || 0;
          totalCarbs += selectedItem.carbs || 0;
          totalCalories += selectedItem.calories || 0;
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
      <Text>
        (Calories: {item.calories} | P: {item.protein}g, C: {item.carbs}g, F: {item.fat}g )
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
  
  // Adds a selected snack to the "Extras" category
  const handleAddToSnacks = (item: any) => {
    if (!item.food) return; // Check if food data exists

    // Create a new snack item based on the FoodItem interface
    const newSnack: FoodItem = {
        id: item.food.foodId || Date.now().toString(), // Ensure to use an id from the API if available
        name: item.food.label,
        calories: item.food.nutrients.ENERC_KCAL,
        protein: item.food.nutrients.PROCNT,
        fat: item.food.nutrients.FAT,
        carbs: item.food.nutrients.CHOCDF,
        quantity: 1, // Set the default quantity
        food: item.food.foodId, // Assign the food ID if needed
    };

    // Update the selected state to include the new snack item directly
    setSelectedItems(prevSelectedItems => ({
        ...prevSelectedItems,
        Extras: { snack: newSnack }, // Directly set the snack without nesting it in a category
    }));

    // Update state to include the new snack in the Extras category if needed
    setSubcategories(prevSubcategories => {
        const extras = prevSubcategories.Extras || [];

        // Check if "Extras" category exists
        if (extras.length > 0) {
            // Check if the snack already exists in the Extras category
            const existingItem = extras.find(extra =>
                extra.items.some(snack => snack.id === newSnack.id) // Check by id
            );

            if (!existingItem) {
                // Add the new snack to the existing Extras category
                return {
                    ...prevSubcategories,
                    Extras: extras.map(extra =>
                        extra.category === 'Extras'
                            ? { ...extra, items: [...extra.items, newSnack] } // Append new snack
                            : extra
                    ),
                };
            }
        } else {
            // If "Extras" category does not exist, create it
            const newSnackCategory: FoodCategory = {
                category: 'Extras',
                items: [newSnack],
            };

            return {
                ...prevSubcategories,
                Extras: [newSnackCategory], // Create new category with the snack
            };
        }

        return prevSubcategories; // Return previous state if no updates were made
    });

    // Close the search view
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };
     
  //Reset Menu button
  const resetMenu = () => {
    setSelectedItems({
      Breakfast: {},
      Lunch: {},
      Dinner: {},
      Extras: {},
    });
    setMacros({
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
    });
    setShowModal(false);
  };
  
  return (
    <ScrollView>
      
      {/* Reset Menu Button */}
      <TouchableOpacity 
        onPress={() => setShowModal(true)} 
        style={styles.resetButton}
      >
        <Text style={styles.resetButtonText}>
          Clear Menu
        </Text>
        <MaterialIcons name="refresh" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Reset Menu Button Modal */}
      <Modal transparent={true} visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reset Menu</Text>
            <Text style={styles.modalMessage}>Are you sure you want to reset the menu?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={resetMenu} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>

        {/* Calories Circle */}
        <View style={styles.caloriesContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.middleCircle}>
              <View style={styles.inner2Circle}>
                <View style={styles.inner1Circle}>
                  <Text style={styles.caloriesNum}>{macros.calories}/</Text>
                  <Text style={styles.caloriesNum}>{dailyCalories}</Text>
                  <Text style={styles.caloriesLabel}>kcal</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Macros */}
        <View style={styles.macros}>
          {Object.entries(macros)
            .filter(([key]) => key !== 'calories') // Filter out the 'calories' key
            .map(([key, value]) => (
              <View key={key} style={styles.macroItem}>
                <Text style={styles.macroLabel}>
                  {`${key.charAt(0).toUpperCase() + key.slice(1)} (g)`}
                </Text>
                <View style={styles.macroValueContainer}>
                  <Text style={styles.macroValue}>{value}</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Loading indicator */}
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Meal Sections */}
        {(['Breakfast', 'Lunch', 'Dinner', 'Extras'] as Array<string>).map((mealType) => (
          <View key={mealType} style={[styles.mealSection, { borderColor: getBorderColor(mealType) }]}>
            <Text style={styles.mealTitle}>{mealType}</Text>
            {subcategories[mealType]?.length ? (
              subcategories[mealType].map((subcategory) => (
                <View key={subcategory.category} style={styles.subcategory}>
                  <Text style={styles.subcategoryTitle}>{subcategory.category}</Text>
                  <SelectList
                    data={subcategory.items.map(item => ({ value: item.name, key: item.name }))}
                    setSelected={(selected: string | null) =>
                      handleSelect(selected, mealType, subcategory.category, subcategory.items)
                    }
                    placeholder="Select Food"
                    selected={selectedItems[mealType]?.name || null} // Use the name if an item is selected
                  />
                  {renderSelectedItemDetails(mealType, subcategory.category)}
                </View>
              ))
            ) : (
              <Text>No food added yet.</Text>
            )}
          </View>
        ))}

        {/* Floating Add Button */}
        <TouchableOpacity onPress={handleSearchIconPress} style={styles.floatingButton}>
          <FontAwesome name="plus" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Search Bar */}
        {showSearch && (
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search for food to add"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch} // Ensure handleSearch is implemented properly
                    autoFocus
                  />
                  {loading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                  ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : (
                    <FlatList
                      data={searchResults}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.resultItem}
                          onPress={() => handleAddToSnacks(item)}
                        >
                          <Text style={styles.resultText}>{item.food?.label || 'Unknown Food'}</Text>
                          <Text style={styles.resultDetail}>
                            Calories: {Number(item.food?.nutrients?.ENERC_KCAL || 0).toFixed(2)} kcal
                          </Text>
                          <Text style={styles.resultDetail}>
                            Carbohydrates: {Number(item.food?.nutrients?.CHOCDF || 0).toFixed(2)} g
                          </Text>
                          <Text style={styles.resultDetail}>
                            Fat: {Number(item.food?.nutrients?.FAT || 0).toFixed(2)} g
                          </Text>
                          <Text style={styles.resultDetail}>
                            Protein: {Number(item.food?.nutrients?.PROCNT || 0).toFixed(2)} g
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.food?.foodId.toString() || Math.random().toString()} // Use a random key if foodId is not available
                      ListEmptyComponent={() => <Text>No results found</Text>}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}

      </View>
    </ScrollView>
  );
};


// Styles
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
  resetButton: {
    padding: 15,
    backgroundColor: '#FF4C4C', // צבע הרקע של הכפתור
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
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',  
    gap: 10,
  },
  confirmButton: {
    backgroundColor: '#FF4C4C', // Same as reset button
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  confirmButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc', // Neutral color
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButtonText: {
    color: '#000',
    textAlign: 'center',
  },

});

export default DailyMenu;
