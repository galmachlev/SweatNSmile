/*
 * קומפוננטה DailyGeminiChat
 * 
 * קומפוננטה זו מהווה מסך צ'אט אינטראקטיבי שבו משתמשים יכולים ליצור אינטראקציה עם מודל Gemini AI.
 * משתמשים יכולים ללחוץ על כפתור "רענן" כדי לקבל הודעה חדשה.
 * המודל מציג טיפ תזונתי, עצה מוטיבציונית או עובדה על דיאטה, שמוצגות באזור גלילה.
 * ניהול מצבי טעינה ורענון נעשה כדי לשפר את חוויית המשתמש.
*/

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import FlashMessage from "react-native-flash-message";
import { MaterialIcons } from '@expo/vector-icons';

// מבנה נתונים להודעות: טקסט ומשתנה המייצג האם ההודעה של המשתמש
interface Message {
  text: string;
  user: boolean;
}

const DailyGeminiChat: React.FC = () => {
  // סטייט להודעות, מצבי טעינה ורענון
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true); // רענון ראשון אוטומטי בעת פתיחת הדף בפעם הראשונה
  const [reloading, setReloading] = useState(false); // רענון של ההודעה במכוון על ידי המשתמש 

  const API_KEY = "AIzaSyAEG-hwBmhVBOIz8t7BQRpGOyPhcr3tWiU"; // מפתח API של Google Generative AI

  // פונקציה ליצירת עובדה יומית באמצעות Google Generative AI
  const generateDailyFact = async () => {
    try {
      setReloading(true); // עדכון מצב לרענון
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY); // חיבור למודל
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // טעינת המודל הרצוי

      // מערך פרומפטים רנדומליים ליצירת תגובות מגוונות
      const prompts = [
        "Share a quick tip for healthy eating",
        "Give a motivational quote about staying on track with a diet",
        "Share fact about some healthy foods",
        "Tell a surprising fact about nutrition or dieting",
        "Explain the benefits of staying hydrated",
        "Provide a tip for managing portion sizes",
        "Give advice on how to balance macronutrients in a meal",
        "Share a myth about dieting and debunk it",
        "What is the importance of eating fiber-rich foods?",
        "Share a creative way to include more vegetables in meals",
        "Explain the impact of sugar on energy levels",
        "Provide a simple idea for a healthy snack",
        "Share a fact about vitamins and their role in the body",
        "Explain the importance of having a consistent eating schedule",
        "Give tips for meal prepping to save time and stay healthy",
        "Explain how sleep affects weight management and health",
        "Share an interesting fact about superfoods",
        "Provide advice on how to stay motivated during a weight loss journey",
        "Explain the role of exercise in boosting metabolism",
        "Share a fun fact about a fruit or vegetable",
        "Explain the benefits of eating seasonal and local produce",
        "Give a tip for reducing cravings for unhealthy foods",
        "Share advice on how to read nutrition labels effectively",
        "Provide an idea for a simple, healthy dessert",
        "Explain the benefits of reducing processed food intake",
        "Share a fun fact about a specific cuisine and its health benefits",
        "Explain why breakfast is important for energy and metabolism",
        "Provide advice on how to reduce stress eating",
        "Share the importance of mindful eating and how to practice it",
        "Explain how probiotics support gut health",
      ];

      // בחירת פרומפט רנדומלי עם תוספת קבועה להוספת קונטקסט ברור לתגובה
      const prompt = "Limit your response to maximum 2-3 lines and add an emoji at the end: " + prompts[Math.floor(Math.random() * prompts.length)];

      // שליחת הפרומפט למודל וקבלת תגובה
      const result = await model.generateContent(prompt); // שליחת הפרומפט למודל גימיני וקבלת תוצאה
      const response = result.response;
      const text = response.text(); // חילוץ הטקסט מהתגובה

      // עדכון הודעה חדשה בלבד
      setMessages([{ text, user: false }]);
      setLoading(false);
      setReloading(false);
    } catch (error) {
      console.error("Error fetching daily fact:", error); // טיפול בשגיאות
      setLoading(false);
      setReloading(false);
    }
  };

  // ביצוע טעינה ראשונית בעת הרינדור הראשון של הקומפוננטה
  useEffect(() => {
    generateDailyFact();
  }, []);

  return (
    <View style={styles.container}>
      {/* כותרת העמוד עם כפתור רענון */}
      <View style={styles.header}>
        <Text style={styles.title}>Brain Boost</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={generateDailyFact}>
          <MaterialIcons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* אזור התוכן - הודעות נטענות או מוצגות */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text>Loading Quick Fact 🌟...</Text> // הודעת טעינה
        ) : reloading ? (
          <Text>Reloading...</Text> // הודעת רענון
        ) : (
          <View>
            {messages.map((message, index) => (
              <View key={index} style={styles.messageContainer}>
                <Text style={styles.messageText}>{message.text}</Text> {/* הצגת ההודעה */}
              </View>
            ))}
            {messages.length === 0 && <Text>No messages</Text>} {/* במקרה שאין הודעות */}
          </View>
        )}
      </ScrollView>

      {/* הודעות פלאש לשגיאות */}
      <FlashMessage position="top" />
    </View>
  );
};


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
