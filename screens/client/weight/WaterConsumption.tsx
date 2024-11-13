/*
 * רכיב זה מציג את כמות המים שהמשתמש שתה ביום הנוכחי, עם אפשרות להוסיף כוס מים על ידי לחיצה על כפתור.
 * הגרף מעודכן באופן אנימטיבי, ומציג את כמות המים הנצרכת ביחס ליעד היומי.
 * במקרה שהמשתמש שותה את כמות המים היומית, מוצגת אנימציה של קונפטי והודעה קופצת המברכת אותו.
 * המערכת משתמשת במערכת חישוב הדינמית של צריכת מים, ומעדכנת את הסטטיסטיקות בכל פעם שהמשתמש מוסיף כוס מים.
 * בנוסף, אם המשתמש לוחץ על כפתור "אפס" (Reset), המידע של צריכת המים מתאפס.
 * בנוסף, מוצגת מודל עם עובדה מעניינת על צריכת מים.
 */

import React, { useState, useRef, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Button, Image, Dimensions, Alert } from 'react-native'; 
import Svg, { Circle } from 'react-native-svg'; 
import ConfettiCannon from 'react-native-confetti-cannon'; 
import { useUser } from '../../../context/UserContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Ionicons } from '@expo/vector-icons'; 

const circleImage = require('../../../Images/water.png'); // תמונה של הטיפת מים שתוצג על המסך

const WaterConsumption = () => {
  const { currentUser } = useUser(); // מקבל את המשתמש הנוכחי מתוך הקונטקסט
  const userId = currentUser?.email ?? 'defaultUserEmail'; // אם לא קיים אימייל, משתמש בברירת מחדל
  const userGenderValue = currentUser?.gender ?? 'male'; // אם אין מידע על המגדר, ברירת המחדל היא 'male'
  const waterGoal = userGenderValue === 'male' ? 2600 : 1800; // קביעת כמות המים שהמשתמש צריך לשתות לפי מגדר
  const { width } = Dimensions.get('window'); // מקבל את רוחב המסך למטרת התאמה
  const radius = 50; // רדיוס מעגל
  const strokeWidth = 10; // רוחב הקו
  const circumference = 2 * Math.PI * radius; // היקף המעגל (הקוטר * פאי)
  const [waterIntake, setWaterIntake] = useState(0); // כמות המים שנשתתה
  const [showConfetti, setShowConfetti] = useState(false); // מצב אם להציג קונפטי
  const [showModal, setShowModal] = useState(false); // מצב אם להראות את המודאל של הגעה ליעד
  const [isGoalReached, setIsGoalReached] = useState(false); // מצב אם היעד הושג
  const [showFactModal, setShowFactModal] = useState(false); // מצב אם להראות מודאל עם עובדה על שתיית מים
  const animatedValue = useRef(new Animated.Value(0)).current; // ערך אנימציה שנע בין 0 ל-1
  
  // שמירת הנתונים באמצעות AsyncStorage - מאפשר לשמור נתונים באופן אסינכרוני במכשיר המקומי ללא שימוש במסד נתונים מקומי או חיבור אינטרנט
  useEffect(() => {
    const loadWaterIntake = async () => {
      const storedIntake = await AsyncStorage.getItem('waterIntake'); // שולף את הכמות שנשתתה מהזיכרון
      const storedDate = await AsyncStorage.getItem('lastIntakeDate'); // שולף את תאריך הצריכה האחרון
      const today = new Date().toISOString().slice(0, 10); // מקבל את התאריך של היום
  
      if (storedDate !== today) {
        await AsyncStorage.setItem('waterIntake', '0'); // מאפס את כמות המים אם היום לא תואם
        await AsyncStorage.setItem('lastIntakeDate', today); // מעדכן את התאריך של היום
      } else {
        setWaterIntake(Number(storedIntake) || 0); // אם יש ערך - מגדיר את כמות המים שנשתתה
      }
    };
  
    loadWaterIntake();
  }, []); // מתבצע רק בפעם הראשונה שהקומפוננטה נטענת

  // בתוך ה-useEffect המעדכן את animatedValue
  useEffect(() => {
    const progress = waterIntake / waterGoal; // חישוב ההתקדמות
    Animated.timing(animatedValue, { // מניע את האנימציה
      toValue: progress, // הערך שאליו האנימציה שואפת
      duration: 500, // משך האנימציה
      useNativeDriver: true, // שימוש במדריך Native לעיבוד מהיר יותר
    }).start();
  
    if (waterIntake >= waterGoal && !isGoalReached) { // אם היעד הושג
      setShowConfetti(true); // מציג קונפטי
      setShowModal(true); // מציג מודאל של ברכות
      setIsGoalReached(true); // מעדכן שהיעד הושג
    }
  
    // עדכון כמות המים ב-AsyncStorage
    const updateWaterIntake = async () => {
      await AsyncStorage.setItem('waterIntake', String(waterIntake)); // שומר את הערך החדש
    };
    
    updateWaterIntake();
  }, [waterIntake]); // הפעולה הזו מתבצעת כל פעם שכמות המים משתנה
  
  // חישוב ה-strokeDashoffset (החלק הממולא במעגל)
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0], // מכיל את ההיקף עד לנקודת ההשלמה
  });

  // הצגת התראה כל 3 דקות אם לא הגענו ליעד
  useEffect(() => {
    const interval = setInterval(() => {
      const remainingWater = waterGoal - waterIntake;
      if (remainingWater > 0) {
        Alert.alert('Reminder', `You have ${remainingWater} ml left to drink today!`);
      }
    }, 180000); // 3 דקות

    return () => clearInterval(interval); // סיום עם יציאת הקומפוננטה
  }, [waterIntake]);

  // הוספת כוס מים
  const handleAddGlass = () => {
    setWaterIntake(prev => prev + 240); // מוסיף 240 מ"ל (כוס מים)
  };

  // הצגת מודאל עם עובדה על שתיית מים
  const handleImagePress = () => {
    setShowFactModal(true);
  };

  // פונקציה לאיפוס הצריכה
  const resetWaterIntake = () => {
    Alert.alert(
      'Reset Water Intake',
      'Are you sure you want to reset your daily intake progress?',
      [
        {
          text: 'No',
          style: 'cancel', // מבטל את הפעולה
        },
        {
          text: 'Yes',
          onPress: () => {
            setWaterIntake(0); // מאפס את הצריכה
            AsyncStorage.setItem('waterIntake', '0'); // מעדכן את AsyncStorage
            setShowConfetti(false); // מאפס את מצב הקונפטי
            setIsGoalReached(false); // מאפס את מצב הגעה ליעד
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={[styles.container, { width: width * 0.4 }]}>
      {/* כותרת של הקומפוננטה */}
      <Text style={styles.title}>Daily Water Consumption</Text>
      
      {/* כפתור ריסט של צריכת המים, כשלוחצים עליו הוא מפעיל את הפונקציה resetWaterIntake */}
      <TouchableOpacity style={styles.resetButton} onPress={resetWaterIntake}>
        <Ionicons name="refresh" size={24} color="#3b5998" />
      </TouchableOpacity>

      {/* כפתור ללחיצה על התמונה, הפונקציה handleImagePress תופעל בעת לחיצה */}
      <TouchableOpacity style={styles.imageContainer} onPress={handleImagePress}>
        <Image source={circleImage} style={styles.image} />
      </TouchableOpacity>
      
      {/* רכיב SVG שמציג מעגל עם אנימציה על פי צריכת המים */}
      <Svg height="150" width="150" viewBox="0 0 120 120" style={styles.svg}>
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* מעגל אנימציה שמציג את צריכת המים, מעודכן על ידי strokeDashoffset */}
        <AnimatedCircle
          cx="60"
          cy="60"
          r={radius}
          stroke="#3b5998"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`} // הגדרת ערך נכון של strokeDasharray
          strokeDashoffset={strokeDashoffset} // עדכון המרחק של הקו האנימטיבי
          strokeLinecap="round"
          rotation={270} // סיבוב 270 מעלות (התחלה מהחלק העליון)
          originX={60} // מגדיר את מרכז הסיבוב
          originY={60} // מגדיר את מרכז הסיבוב
          />
      </Svg>

      {/* תצוגת כמות המים הנצרכת והיעד */}
       <View style={styles.textContainer}>
        <Text style={styles.text}>{`${waterIntake} ml`}</Text>
        <Text style={styles.subText}>Goal: {waterGoal} ml</Text>
      </View>

      {/* כפתור להוספת כוס מים */}
      <TouchableOpacity style={styles.button} onPress={handleAddGlass}>
        <Text style={styles.buttonText}>Add Glass of Water</Text>
      </TouchableOpacity>

      {/* תצוגת קונפטי שמופיעה כאשר מגיעים ליעד המים */}
      {showConfetti && (
        <ConfettiCannon
          count={300}
          origin={{ x: -10, y: 0 }}
          fadeOut
          colors={['green', 'blue', 'yellow', 'pink', 'orange', 'purple']}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      {/* מודל הצגת ברכות כאשר מגיעים ליעד המים */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.congratulationsText}>Congratulations!</Text>
            <Text style={styles.modalText}>You have reached your daily water goal!</Text>
            <Button title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>

      {/* מודל הצגת מידע על המלצות צריכת מים */}
      <Modal
        visible={showFactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFactModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Did you know?</Text>
            <Text style={styles.modalText2}>
              The National Institute of Medicine (IOM) recommends consuming 2.6 liters of fluids for men and 1.8 liters for women (from drinking alone, not from food).
            </Text>
            <Button title="Close" onPress={() => setShowFactModal(false)} />
          </View>
        </View>
      </Modal>

    </View>
  );
};

//רכיב Circle שמסביבו מבוצעת אנימציה עם רכיב Animated.createAnimatedComponent
const AnimatedCircle = Animated.createAnimatedComponent(Circle); 

//סטיילים
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  image: {
    position: 'absolute',
    top: 25,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  svg: {
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b5998',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#6c757d',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalText2: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10, // Ensure the button is on top
  },
});

export default WaterConsumption;

