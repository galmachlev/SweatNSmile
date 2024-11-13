/*
 * רכיב זה מציג גרף של מספר הצעדים של המשתמש ב-5 השעות האחרונות.
 * בלחיצה על עמודה כלשהי בגרף, המשתמש רואה את מספר הצעדים באותה שעה ספצפית שנלחצה.
 * (יממה)בעת לחיצה על הכפתור "סיכום" יוצג מודל המפרט: כמות צעדים שנמדדו בשעה האחרונה, כמות צעדים שנמדדו מ00 בלילה(יום) וכמות הצעדים שנמדדו ב-24 השעות האחרונות
 * הוא משתמש ב-Expo Pedometer API כדי לקבל את נתוני הצעדים.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Pedometer } from 'expo-sensors';

interface HourlyStep {
  hour: number; // שעה שבה נמדדו הצעדים
  steps: number; // מספר הצעדים שנעשו בשעה זו
}

const HealthGraph = () => {
  const { width } = Dimensions.get('window');
  const [showModal, setShowModal] = useState(false); // משתנה למעקב אם המודל מוצג או לא
  const [hourlySteps, setHourlySteps] = useState<HourlyStep[]>([]); // נתוני הצעדים של כל שעה
  const [summaryData, setSummaryData] = useState({
    lastHour: 0, // מספר הצעדים בשעה האחרונה
    today: 0, // מספר הצעדים היום
    last24Hours: 0, // מספר הצעדים ב-24 השעות האחרונות
  });
  const [selectedHour, setSelectedHour] = useState<HourlyStep | null>(null); // המשתנה ששומר את השעה הנבחרת מתוך 5 השעות האחרונות
  const [error, setError] = useState<string | null>(null); // משתנה לניהול שגיאות
  const barWidth = 15; // רוחב כל עמודה בגרף
  const barSpacing = 10; // רווח בין העמודות
  const graphHeight = 190; // גובה הגרף
  const graphWidth = (barWidth + barSpacing) * 5; // רוחב הגרף הכולל (5 עמודות)

  useEffect(() => {
    // פונקציה טוענת ומציגה נתונים בזמן אמת - שליפת נתונים ממקורות חיצוניים וקבלת תשובות בצורה אסינכרונית
    const fetchData = async () => {
      const end = new Date(); // השורה הזו מקבלת את הזמן הנוכחי, כלומר את התאריך והשעה הנוכחיים ברגע הריצה של הקוד.
      const startLast24Hours = new Date(end.getTime() - 24 * 60 * 60 * 1000); // זמן התחלה ל-24 השעות האחרונות
      const startSince00Today = new Date(end); // זמן התחלה להיום בשעה 00:00
      startSince00Today.setHours(0, 0, 0, 0); // הגדרת השעה 00:00 - מוודא שהשעה, הדקה, השנייה והמילישנייה יוגדרו לאפס.

      const hourlyData: HourlyStep[] = [];
      // לולאה לאיסוף נתוני צעדים בכל אחת מחמש השעות האחרונות
      for (let i = 4; i >= 0; i--) {
        const hourStart = new Date(end.getTime() - i * 60 * 60 * 1000); // תחילת השעה
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000); // סיום השעה
        try {
          // קבלת נתוני הצעדים - ממתינים עד לסיום ביצוע הפעולה האסינכרונית לפני שממשיכים לקוד הבא
          const result = await Pedometer.getStepCountAsync(hourStart, hourEnd); 
          hourlyData.push({ hour: hourStart.getHours(), steps: result.steps });
        } catch (error) {
          setError('Error reading step data.'); // טיפול בשגיאה
        }
      }
      setHourlySteps(hourlyData); // עדכון נתוני הצעדים השעתיים

      try {
        // איסוף סיכום נתוני צעדים עבור 24 שעות אחרונות, היום והשעה האחרונה
        // פונקציה שמורה שמקבלת 2 תאריכים ומחזירה כמות צעדים בטווח הזה 
        const past24HoursResult = await Pedometer.getStepCountAsync(startLast24Hours, end);
        const todayResult = await Pedometer.getStepCountAsync(startSince00Today, end);
        const lastHourResult = await Pedometer.getStepCountAsync(new Date(end.getTime() - 60 * 60 * 1000), end);

        setSummaryData({
          lastHour: lastHourResult.steps, // עדכון מספר הצעדים בשעה האחרונה
          today: todayResult.steps, // עדכון מספר הצעדים היום
          last24Hours: past24HoursResult.steps, // עדכון מספר הצעדים ב-24 שעות אחרונות
        });
      } catch (error) {
        setError('Error reading step data.'); // טיפול בשגיאה
      }
    };

    fetchData();
  }, []); // פעולה זו תקרה פעם אחת לאחר טעינת הרכיב

  const maxSteps = Math.max(...hourlySteps.map(item => item.steps)); // חישוב מספר הצעדים הגבוה ביותר
  const maxBarHeight = graphHeight * 0.9; // גובה מקסימלי לעמודה (90% מגובה הגרף)

  // פונקציה שמציירת את העמודות בגרף
  const renderBars = () => {
    return hourlySteps.map((item, index) => (
      <React.Fragment key={index}>
        <Defs>
          <LinearGradient id={`grad${index}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FDE598" stopOpacity="1" />
            <Stop offset="100%" stopColor="#E8A54B" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x={index * (barWidth + barSpacing) + barSpacing / 2} // חישוב המיקום של כל עמודה
          y={graphHeight - (item.steps / maxSteps) * maxBarHeight} // חישוב הגובה של כל עמודה
          width={barWidth} // רוחב העמודה
          height={(item.steps / maxSteps) * maxBarHeight} // גובה העמודה תלוי במספר הצעדים
          fill={`url(#grad${index})`} // צבע עבור כל עמודה
          stroke="#D89E4E"
          strokeWidth="1"
          onPress={() => setSelectedHour(item)} // לחיצה תציג את הכמות צעדים באותה שעה
        />
        <SvgText
          // מיקום הטקסט תחת כל עמודה
          x={index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2} 
          y={graphHeight + 15}
          fontSize="10"
          fill="#333"
          textAnchor="middle"
        >
          {item.hour}
        </SvgText>
      </React.Fragment>
    ));
  };

  return (
    <View style={[styles.container, { width: width * 0.4 }]}>
      
      {/* כותרת של הקומפוננטה */}
      <Text style={styles.title}>Hourly Steps</Text>

      {/* גרף 5 עמודות של השעות */}
      <Svg height={graphHeight + 30} width={graphWidth} style={styles.svg}>
        <Line x1="0" y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="#ccc" strokeWidth="1" /> 
        {renderBars()}{/* קריאה לפונקציה לציור העמודות */}
      </Svg>

      {selectedHour ? (
        <Text style={styles.selectedHourText}>
          {`${selectedHour.hour}:00 - ${selectedHour.steps} steps`}{/* מציג את הצעדים בשעה הנבחרת */}
        </Text>
      ) : (
        <Text style={styles.selectedHourText}>
          {`${new Date().getHours()}:00 - ${hourlySteps.find(item => item.hour === new Date().getHours())?.steps ?? 0} steps`}{/* אחרת מציג את הצעדים בשעה הנוכחית או 0 אם אין נתון זמין */}
        </Text>
      )}
      {error ? (
        <Text style={styles.errorMessage}>{error}{/* במידה ויש שגיאה בהצגת הנתונים הצגת השגיאה, אחרת הצגת כפתור הסיכום */}</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Show Summary</Text>
        </TouchableOpacity>
      )}

      {/* מודל הצגת מסך הסיכום של נתוני הצעדים */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Step Count Summary</Text>
            <Text style={styles.modalText}>{`Last Hour: ${summaryData.lastHour} steps`}</Text>
            <Text style={styles.modalText}>{`Today: ${summaryData.today} steps`}</Text>
            <Text style={styles.modalText}>{`Last 24 Hours: ${summaryData.last24Hours} steps`}</Text>
            <Button title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>

    </View>
  );
};

// סטיילים
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E8A54B',
    marginBottom: 10,
    textAlign: 'center',
  },
  svg: {
    marginBottom: 0,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#E8A54B',
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
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  modalText: {
    fontSize: 14,
    color: '#6c757d',
    marginVertical: 8,
    textAlign: 'center',
  },
  selectedHourText: {
    fontSize: 12,
    color: '#6c757d',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    padding: 15,
  },
});

export default HealthGraph;
