/*
 * רכיב זה מציג את ההתקדמות של המשתמש לעבר יעד המשקל שלו, באמצעות תרשים עוגה (Pie Chart).
 * התרשים מציג את האחוז שהמשתמש הצליח לרדת במשקל מתוך היעד שלו (Achieved) ואת האחוז שנותר (Remaining).
 * החישוב מתבצע על פי המשקל ההתחלתי, המשקל הנוכחי ויעד המשקל.
 * בנוסף, מוצגת הודעה טקסטואלית שתעדכן את המשתמש בכמה אחוזים הוא נמצא בדרך ליעד שלו.
 * התרשים מציג את ההתקדמות בצורה ויזואלית וכולל עיצוב מותאם אישית.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

// הגדרת טיפוס (Type) של הקומפוננטה, פרמטרים שמגיעים אליה - משקל התחלתי, נוכחי ויעד
interface ProgressBarProps {
  startWeight: number; // משקל התחלתי
  currentWeight: number; // משקל נוכחי
  goalWeight: number; // משקל יעד
}

const screenWidth = Dimensions.get('window').width; // רוחב המסך של המכשיר

// הקומפוננטה שמקבלת את המשקלים ומחשבת את ההתקדמות
const ProgressBar: React.FC<ProgressBarProps> = ({ startWeight, currentWeight, goalWeight }) => {
  // שליפת נתוני המשקל(התחלתי, נוכחי ויעד) מהיוזר המחובר - אם לא קיים, הגדרת ערך ברירת מחדל
  const validStartWeight = startWeight || 1;
  const validCurrentWeight = currentWeight || validStartWeight;
  const validGoalWeight = goalWeight || validStartWeight;

  // חישוב המשקל שהמשתמש ירד (ההתקדמות) והמשקל שצריך לרדת עד ליעד
  const totalWeightToLose = validStartWeight - validGoalWeight;
  const weightLost = validStartWeight - validCurrentWeight;

  // חישוב אחוז ההתקדמות (כמה ירד מתוך המשקל שיש לרדת)
  const progressPercentage = Math.min(Math.max((weightLost / totalWeightToLose) * 100, 0), 100);
  const remainingPercentage = 100 - progressPercentage;

  // נתונים לתרשים העוגה (Pie Chart), צבעים וסימונים לכל חלק בעוגה
  const data = [
    {
      name: `Achieved`, //החלק שהושג
      population: progressPercentage, //כמות משקל שירד מההתחלה עד כה באחוזים
      color: '#3E6613',
      legendFontColor: '#3E6613',
      legendFontSize: 14,
    },
    {
      name: `Remaining`, //החלק שנותר
      population: remainingPercentage, //כמות משקל שנותר לירידה עד ליעד באחוזים
      color: '#d9d9d9',
      legendFontColor: '#666666',
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.chartContainer}>

      {/* כותרת של הקומפוננטה */}
      <Text style={styles.title}>Progress to Goal Weight</Text>
        
        {/* הצגת תרשים העוגה (Pie Chart) עם הנתונים שמחשבים את ההתקדמות */}
        <PieChart
          data={data} // נתונים של התקדמות בתהליך הירידה במשקל - נותר והושג
          width={screenWidth - 80} // רוחב התרשים מותאם לגודל המסך
          height={220} // גובה התרשים
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // צבעים למרכיבים של התרשים
            strokeWidth: 5, // עובי הקו של התרשים
            barPercentage: 0.5, // אחוז הצגת כל "פיסת עוגה"
          }}
          accessor="population" // נתון שנחלק בעוגה (במקרה הזה אחוזים)
          backgroundColor="transparent" // צבע רקע שקוף
          paddingLeft="15" // ריווח משמאל
        />

        {/* הצגת טקסט עם אחוז ההתקדמות שנותר */}
        <Text style={styles.progressText}>{Math.round(remainingPercentage)}% towards your goal</Text>

      </View>
    </View>
  );
};

// סטיילים
const styles = StyleSheet.create({
  widgetContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  chartContainer: {
    backgroundColor: '#f9f9f9',
    padding: 13,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4d4d4d',
    padding: 15,
    textAlign: 'center',
    letterSpacing: 1.1,
    
  },
  progressText: {
    fontSize: 14,
    color: '#4d4d4d',
    fontWeight: '700',
    marginTop: 10, // Adjust space between chart and text
    textAlign: 'center',
  },
});

export default ProgressBar;
