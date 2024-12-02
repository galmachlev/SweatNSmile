import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useUser } from '../../../context/UserContext';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';

// הגדרת טייפ האובייקט של אפשרויות האתגר
type ChallengeOption = {
  goalType: 'workouts' | 'sleep' | 'activeDays' | 'trySomethingNew'; // סוג האתגר
  label: string; // תווית להצגה
  description: string; // תיאור האתגר
  image: any; // תמונה מייצגת
};

// רשימת האתגרים השבועיים לבחירה
const challengeOptions: ChallengeOption[] = [
  { goalType: 'workouts', label: '3 Workouts', description: 'Complete 3 workouts per week.', image: require('../../../Images/run.png') },
  { goalType: 'sleep', label: 'Sleep Hours', description: 'Sleep X hours each night.', image: require('../../../Images/Sleep.png') },
  { goalType: 'activeDays', label: 'Active Days', description: 'Be active every day this week.', image: require('../../../Images/kik.jpg') },
  { goalType: 'trySomethingNew', label: 'Try new activity', description: 'Try a new activity this week.', image: require('../../../Images/lifting.jpg') },
];

const WeeklyChallenge = () => {
  const { currentUser, updateUserDetails } = useUser(); // שימוש ב-context של המשתמש
  const [isChoosingNewChallenge, setIsChoosingNewChallenge] = useState(false); // מצב לבחירת אתגר חדש
  const navigation = useNavigation(); // ניתוב למסכים שונים

  useEffect(() => {
    const today = new Date();
    // בדיקה אם האתגר הקיים פג תוקף
    if (currentUser?.weeklyGoals?.[0]?.endDate && new Date(currentUser.weeklyGoals[0].endDate) < today) {
      updateUserDetails(currentUser.email, { weeklyGoals: [] }); // מחיקת האתגר הקיים
      setIsChoosingNewChallenge(true); // הפעלת מסך לבחירת אתגר חדש
    } else {
      // אם יש אתגר פעיל, ניווט למסך פרטי האתגר
      if (currentUser?.weeklyGoals?.length) {
        navigation.navigate('ChallengeDetails', { goalType: currentUser.weeklyGoals[0].goalType });
      } else {
        setIsChoosingNewChallenge(true); // אם אין אתגר פעיל, אפשר לבחור אחד חדש
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isChoosingNewChallenge) {
      // ניווט חזרה לאתגרים במידה והאתגר הפעיל מוצג
      setTimeout(() => {
        setIsChoosingNewChallenge(true);
      }, 0);
    }
  }, [isChoosingNewChallenge]);

  // פונקציה לבחירת אתגר
  const selectChallenge = (goalType: ChallengeOption['goalType'], targetValue: number) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // הגדרת תאריך סיום לאתגר בעוד 7 ימים

    const newWeeklyGoal = {
      goalType, // סוג האתגר
      targetValue, // ערך היעד
      progressValue: 0, // התקדמות התחלתית
      startDate: new Date(), // תאריך התחלה
      endDate, // תאריך סיום
      isCompleted: false, // האם האתגר הושלם
    };

    updateUserDetails(currentUser.email, { weeklyGoals: [newWeeklyGoal] }); // עדכון פרטי המשתמש עם האתגר החדש
    setIsChoosingNewChallenge(false); // חזרה למסך פרטי האתגר
    navigation.navigate('ChallengeDetails', { goalType }); // ניווט למסך פרטי האתגר
  };

  // פונקציה להצגת אפשרויות האתגר
  const renderChallengeOptions = () => (
    <View>
      <Text style={styles.header}>Choose Your Weekly Challenge</Text>
      <Text style={styles.description}>
        Pick a challenge to motivate yourself this week. Whether it's fitness, sleep, or something new, stay active and reach your goals!
      </Text>

      <View style={styles.challengeGrid}>
        {challengeOptions.map((option) => (
          <TouchableOpacity
            key={option.goalType}
            style={styles.challengeCardWrapper}
            onPress={() => {
              const targetValue = option.goalType === 'workouts' ? 3 : 7; // קביעת ערך יעד לפי סוג האתגר
              selectChallenge(option.goalType, targetValue); // בחירת האתגר
            }}
            activeOpacity={0.9}
          >
            <View style={styles.challengeCard}>
              <Image source={option.image} style={styles.challengeImage} /> {/* תמונת האתגר */}
              <Text style={styles.challengeLabel}>{option.label}</Text> {/* תווית האתגר */}
              <Text style={styles.challengeDescription}>{option.description}</Text> {/* תיאור האתגר */}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // פונקציה להצגת האתגר הפעיל
  const renderActiveChallenge = () => {
    const activeChallenge = currentUser?.weeklyGoals?.[0];
    if (!activeChallenge) return null;

    const progress = activeChallenge.progressValue / activeChallenge.targetValue; // חישוב ההתקדמות

    return (
      <View style={styles.activeChallengeContainer}>
        <Text style={styles.changeChallengeButton}>going back to challenges...</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isChoosingNewChallenge ? renderChallengeOptions() : renderActiveChallenge()}
    </ScrollView>
  );
};

// עיצוב המסך וסגנונות
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E6613',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6B8E23',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  challengeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  challengeCardWrapper: {
    width: screenWidth * 0.42,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  challengeCard: {
    width: '100%',
    height: screenWidth * 0.7,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
    backgroundColor: '#9AB28B',
    paddingBottom: 20,
  },
  challengeImage: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
  },
  challengeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 5,
  },
  challengeDescription: {
    fontSize: 12,
    color: '#F0F0F0',
    textAlign: 'center',
    marginTop: 5,
  },
  activeChallengeContainer: {
    padding: 20,
    backgroundColor: '#9AB28B',
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  changeChallengeButton: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
});

export default WeeklyChallenge;
