/*
 * המסך הראשון בעת כניסה לדף המתכונים
 * רכיב זה מציג מסך עם רשימה של קטגוריות מתכונים.
 * כל קטגוריה מיוצגת באמצעות תצוגה הכוללת תמונה וכותרת.
 * כאשר המשתמש לוחץ על קטגוריה, הרכיב עובר למסך "RecipeCategoryScreen"
 * ומעביר אליו את הקטגוריה שנבחרה כפרמטר.
 */

import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// רשימת קטגוריות המתכונים עם מזהה, כותרת ותמונה לכל קטגוריה
const categories = [
  { id: '1', title: 'Breakfast', image: require('../../../Images/breakfast.jpg') },
  { id: '2', title: 'Lunch', image: require('../../../Images/lunch.jpeg') },
  { id: '3', title: 'Dinner', image: require('../../../Images/dinner.jpg') },
  { id: '4', title: 'Snacks', image: require('../../../Images/snacks.jpg') },
];

// רכיב ליצירת פריט קטגוריה יחיד עם כותרת, תמונה ואירוע לחיצה
const CategoryItem = ({ title, image, onPress }: { title: string; image: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <Image source={image} style={styles.categoryImage} />
    <Text style={styles.categoryTitle}>{title}</Text>
  </TouchableOpacity>
);

// רכיב עיקרי שמייצג את מסך הקטגוריות "HealthyRecipesScreen"
const HealthyRecipesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // פונקציה שמנווטת למסך המתאים בעת לחיצה על קטגוריה מסוימת
  const handleCategoryPress = (category: string) => {
    navigation.navigate('RecipeCategoryScreen', { category });
  };

  return (
    <View style={styles.container}>
      {/* כותרת המסך */}
      <Text style={styles.header}>Healthy Recipes</Text>
      
      {/* תצוגה של רשימת הקטגוריות כרשת של פריטים */}
      <View style={styles.grid}>
        {categories.map(category => (
          <CategoryItem
            key={category.id}
            title={category.title}
            image={category.image}
            onPress={() => handleCategoryPress(category.title)}
          />
        ))}
      </View>
      
      {/* כפתור מעבר למסך צ'אט עם המלצות מתכונים בהתאם לפריטים שהמשתמש מזין */}
      <TouchableOpacity 
        style={styles.chatButton} 
        onPress={() => navigation.navigate('GeminiRecipes')}>
        <Ionicons name="chatbubble" size={24} color="white" />
        <Text style={styles.chatButtonText}>Chat with Gemini for custom Recipes</Text>
      </TouchableOpacity>
    </View>
  );
};

// סטיילים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#696B6D',
    marginBottom: 50,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    height: 200,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  categoryImage: {
    width: '100%',
    height: '80%',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#696B6D',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E6613',
    borderRadius: 20,
    padding: 20,
    marginTop: 100,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HealthyRecipesScreen;
