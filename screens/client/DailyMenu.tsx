import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


//types 
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
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
}

const DailyMenu: React.FC = () => {
  // הרמת קלוריות שהוא צריך להגיע אליה, צריך לשלוף את זה מנתוני המשתמש בינתיים רשום 1800
  const [dailyCalories, setDailyCalories] = useState<number>(1800);

  // גם כן צריך להגיע מהפונקציה המתאימה
  const [macros, setMacros] = useState<Macros>({ protein: 180, carbs: 175, fat: 30 }); 
  const [meals, setMeals] = useState<Meals>({
    breakfast: [],
    lunch: [],
    dinner: []
  });

  // פונקציה למשוך נתונים מה-API (נניח שהיא קיימת)
  const fetchMealData = async () => {
    try {
      // כאן יש להשתמש ב-API כדי לקבל את הנתונים ולחלק אותם לפי ארוחות
      const response = await fetch('YOUR_API_ENDPOINT');
      const data = await response.json();

      // לדוגמא: חלוקה לארוחות
      setMeals({
        breakfast: data.breakfast,
        lunch: data.lunch,
        dinner: data.dinner
      });
    } catch (error) {
      console.error('Error fetching meal data:', error);
    }
  };

  // טעינת נתונים בעת עליית הקומפוננטה
  useEffect(() => {
    fetchMealData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.calories}>{dailyCalories} kcal</Text>
      <View style={styles.macros}>
        <Text>Protein: {macros.protein}g</Text>
        <Text>Carbs: {macros.carbs}g</Text>
        <Text>Fat: {macros.fat}g</Text>
      </View>
      <View style={styles.meals}>
        <MealSection title="Breakfast" data={meals.breakfast} />
        <MealSection title="Lunch" data={meals.lunch} />
        <MealSection title="Dinner" data={meals.dinner} />
      </View>
      <Button title="Refresh Meal" onPress={fetchMealData} />
    </View>
  );
};

interface MealSectionProps {
  title: string;
  data: MealItem[];
}

const MealSection: React.FC<MealSectionProps> = ({ title, data }) => (
  <View style={styles.mealSection}>
    <Text style={styles.mealTitle}>{title}</Text>
    {data.map((item, index) => (
      <View key={index} style={styles.mealItem}>
        <Text>{item.name}</Text>
        <Text>{item.calories} kcal</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  calories: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20
  },
  meals: {
    flex: 1
  },
  mealSection: {
    marginBottom: 20
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  }
});

export default DailyMenu;
