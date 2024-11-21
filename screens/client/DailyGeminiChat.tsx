/*
 * קומפוננטה DailyGeminiChat
 * 
 * תיאור:
 * קומפוננטה זו משמשת כמסך אינטראקטיבי לשיחה עם ה-AI "Gemini".
 * המשתמש יכול ליזום יצירת הודעה חדשה בלחיצה על כפתור "רענון".
 * ה-AI מייצר טיפ תזונתי, עצת בריאות מוטיבציונית, או עובדה על דיאטות,
 * והן מוצגות בממשק גלילה. מנוהלים מצבים של טעינה ושגיאות לשיפור חוויית המשתמש.
 * 
 * ספריות בשימוש:
 * - `@google/generative-ai` ליצירת תוכן בעזרת AI.
 * - `react-native-flash-message` להצגת הודעות שגיאה או התראות.
 * - `react-native-vector-icons` להצגת אייקונים.
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import FlashMessage from "react-native-flash-message";
import { MaterialIcons } from '@expo/vector-icons';

// הגדרת הממשק של הודעה בודדת
interface Message {
  text: string; // תוכן ההודעה
  user: boolean; // האם ההודעה נשלחה על ידי המשתמש
}

const DailyGeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); // מצב להודעות
  const [loading, setLoading] = useState(true); // מצב לטעינה ראשונית
  const [reloading, setReloading] = useState(false); // מצב לרענון הודעה חדשה

  const API_KEY = "AIzaSyAEG-hwBmhVBOIz8t7BQRpGOyPhcr3tWiU"; // מפתח API לגישה ל-AI

  // פונקציה ליצירת עובדה יומית בעזרת Google Generative AI
  const generateDailyFact = async () => {
    try {
      setReloading(true); // מעדכנים למצב רענון
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY); // יצירת אובייקט גישה ל-AI
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // בחירת מודל AI

      // מערך של הנחיות מותאמות אישית ל-AI
      const prompts = [
        "Share a quick tip for healthy eating", // טיפ קצר על אכילה בריאה
        "Give a motivational quote about staying on track with a diet", // עצה מוטיבציונית לשמירה על דיאטה
        "What’s a fun fact about the benefits of certain foods?", // עובדה מעניינת על יתרונות של מאכלים מסוימים
        "Tell a surprising fact about nutrition or dieting", // עובדה מפתיעה על תזונה או דיאטה
      ];

      // בחירה אקראית של הנחיה מתוך המערך
      const prompt = "Limit your response to 2-3 lines and add an emoji at the end: " + prompts[Math.floor(Math.random() * prompts.length)];

      // בקשה ליצירת תוכן מ-AI על בסיס ההנחיה שנבחרה
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text(); // חילוץ הטקסט מהתשובה

      // עדכון מצב ההודעות עם תשובת ה-AI
      setMessages([{ text, user: false }]);
      setLoading(false); // סיום מצב טעינה
      setReloading(false); // סיום מצב רענון
    } catch (error) {
      console.error("Error fetching daily fact:", error); // טיפול בשגיאות
      setLoading(false);
      setReloading(false);
    }
  };

  // שימוש ב-useEffect ליצירת עובדה יומית בזמן עליית הקומפוננטה
  useEffect(() => {
    generateDailyFact();
  }, []); // פועל רק בפעם הראשונה

  return (
    <View style={styles.container}>
      {/* כותרת המסך וכפתור רענון */}
      <View style={styles.header}>
        <Text style={styles.title}>Brain Boost</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={generateDailyFact}>
          <MaterialIcons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {/* הצגת תוכן בהודעה או מצבים של טעינה */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text>Loading Quick Fact 🌟...</Text>
        ) : reloading ? (
          <Text>Reloading...</Text>
        ) : (
          <View>
            {/* הצגת ההודעות שנוצרו */}
            {messages.map((message, index) => (
              <View key={index} style={styles.messageContainer}>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))}
            {messages.length === 0 && <Text>No messages</Text>}
          </View>
        )}
      </ScrollView>
      
      {/* רכיב להצגת הודעות פלאש */}
      <FlashMessage position="top" />
    </View>
  );
};

// סטיילים 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5, // Adjust padding as needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 5, // Ensure some space between header and content
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  messageContainer: {
    padding: 5,
    alignSelf: "flex-start",
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  refreshButton: {
    padding: 10,
  },
});

export default DailyGeminiChat;
