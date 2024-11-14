/*
 * רכיב זה הוא מסך צ'אט למשתמש לתקשורת עם Gemini AI.
 * המשתמש יכול להכניס טקסט וללחוץ על כפתור "Send" כדי לשלוח הודעה ל-AI.
 * ה-AI יגיב עם הודעה, והרכיב יציג את השיחה המלאה.
 * הרכיב משתמש בספריית 'react-native-gifted-chat' להצגת השיחה.
 * כמו כן, הרכיב משתמש בספריית 'react-native-flash-message' להצגת הודעות שגיאה.
 */

import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Image, Linking} from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "../../../context/UserContext";
import { handleUserInputForQuantityAndIngredient, handleUserInputForRecipe } from "../../client/Menus/edamamApi";

// הגדרת טייפ של מי ההודעה שמוצגת
interface Message {
  text: string;
  user: boolean;
}

const RecipeChat: React.FC = () => {
  const { currentUser } = useUser(); // שליפת פרטי משתמש מהקונטקסט
  // הודעת ברוכים הבאים והצגת האפשרויות שהיוזר יכול לשאול את הבינה המלאכותית
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `🌟 Hello ${currentUser?.firstName}! 🌟\n\nYou can use me for two things:\n1. If you want to get detailed nutritional information about a food item, just type the quantity and the ingredient in the format 'quantity ingredient' (e.g., '2 bananas'). 🍌\n2. If you're unsure what to cook, just list the ingredients you have (e.g., 'tomato, cheese, pasta') and I'll suggest a delicious recipe! 🍲\n\nWhat would you like to do today?`,
      user: false,
    },
  ]);
  const [inputText, setInputText] = useState(""); // שדה קלט עבור המשתמש
  const [loading, setLoading] = useState(false); // בודק אם יש טעינה בתהליך
  const [isFirstMessage, setIsFirstMessage] = useState(true); // דגל לבדיקה האם ההודעה הראשונה
  const scrollViewRef = useRef<ScrollView>(null); // כל פעם שהצאט יפיק תשובה זה יגלול את הצ'אט לסוף כל הודעה חדשה
  const API_KEY = "AIzaSyAEG-hwBmhVBOIz8t7BQRpGOyPhcr3tWiU";  // מפתח API עבור Google Generative AI
  const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY); // יצירת אינסטנס של Google Generative AI 
  const [displayedRecipes, setDisplayedRecipes] = useState<string[]>([]); // סטייט המנהל רשימה של מתכונים שהוצגו כבר, כדי למנוע הצגת מתכונים חוזרים למשתמש
  const urlPattern = /(https?:\/\/[^\s]+)/g; // רגולר לחיפוש קישורים בטקסט - עבור ההודעות שגימיני מחזיר מתכונים עם קישור חיצוני

  // פונקציה לשליחת פרומפט ל-Gemini וקבלת תגובה
  const getGeminiResponse = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = await response.text(); // חילוץ טקסט מהתגובה

      return text; // החזרת הטקסט
    } catch (error) {
      console.error("Error trying get a response from Gemini: ", error);
      return "Something went wrong, please try again."; // הודעת שגיאה במקרה של כשל
    }
  };

  const handleChat = async () => {

    if (!inputText.trim()) return; // בדיקה אם הקלט ריק או מכיל רק רווחים, אם כן, לא שולחים הודעה
    setLoading(true); // הגדרת מצב טעינה כאשר מתחילים לעבד את הקלט
    
    try {
      let responseText: string = ""; // משתנה שיאחסן את התגובה שתישלח לאחר עיבוד הקלט

      // הגדרת תבניות רגולריות (regex) להבחנה בין סוגי הקלטים השונים
      const ingredientPattern = /^\d+\s+\w+/; // תבנית שמתאימה למחרוזת כמו 'כמות רכיב' (למשל '2 apples')
      const recipePattern = /^[\w\s,]+$/; // תבנית שמתאימה לרשימה מופרדת בפסיקים של רכיבים (למשל 'tomato, cheese, pasta')
      const generalGreetingPattern = /^(hello|hi|hey|help|what can you do|how are you)/i; // תבנית לברכות כלליות (למשל 'hello')
      const nutritionalRequestPattern = /^(give me|what is|tell me) (the )?calories? (of|for)? (\d+)\s+(\w+)/i; // תבנית לשאילתות על קלוריות של רכיב מסוים (למשל 'give me the calories of 2 apples')
  
      // אם הקלט תואם לברכה כללית או שאלה לא קשורה
      if (generalGreetingPattern.test(inputText)) {
        responseText = "Hi there! 👋 I'm here to help you with nutritional information or recipe suggestions!";
      } 

      // אם הקלט מכיל בתוכו את הבקשה לכמות + שם מרכיב (שאילתת מידע תזונתי) - למשל: Give me calories of 2 apples
      else if (nutritionalRequestPattern.test(inputText)) {
        const matches = inputText.match(nutritionalRequestPattern);
        if (matches) {
          const quantity = matches[4]; // חילוץ הכמות מהקלט
          const ingredient = matches[5]; // חילוץ הרכיב מהקלט
          const nutritionalInfo = await handleUserInputForQuantityAndIngredient(`${quantity} ${ingredient}`); // Call nutritional info function
          if (nutritionalInfo) {
            // יצירת התגובה עם פרטי המידע התזונתי
            responseText = `Nutritional Information for ${quantity} ${ingredient}:\n- Calories: ${nutritionalInfo.calories}\n- Protein: ${nutritionalInfo.protein}\n- Fat: ${nutritionalInfo.fat}\n- Carbs: ${nutritionalInfo.carbs}\n- Sodium: ${nutritionalInfo.sodium}`;
          } else {
            // הודעה שהקלט לא זוהה כמו שצריך בתבנית הנדרשת
            responseText = "Input not recognized. Please enter in the format 'quantity ingredient' in English.";
          }
        }
      } 

      // אם הקלט תואם לפורמט של רכיב
      else if (ingredientPattern.test(inputText)) {
        const nutritionalInfo = await handleUserInputForQuantityAndIngredient(inputText);
        if (nutritionalInfo) {
          responseText = `Nutritional Information for ${inputText}:\n- Calories: ${nutritionalInfo.calories}\n- Protein: ${nutritionalInfo.protein}\n- Fat: ${nutritionalInfo.fat}\n- Carbs: ${nutritionalInfo.carbs}\n- Sodium: ${nutritionalInfo.sodium}`;
        } else {
          responseText = "Input not recognized. Please enter in the format 'quantity ingredient' in English.";
        }
      } 

      // אם הקלט תואם לפורמט של רשימת רכיבים (מתכון)
      else if (recipePattern.test(inputText)) {
        const recipeSuggestions = await handleUserInputForRecipe(inputText, displayedRecipes);
        
        // הוספת המתכון שהוצג להיסטוריה של המתכונים
        if (recipeSuggestions.startsWith('🍽️ Recipe:')) {
          const recipeTitle = recipeSuggestions.split('\n')[0].replace('🍽️ Recipe: ', ''); // חילוץ שם המתכון
          setDisplayedRecipes(prev => [...prev, recipeTitle]); // עדכון רשימת המתכונים שהוצגו
        }
        
        // הצגת התגובה המתאימה
        responseText = typeof recipeSuggestions === 'string' ? recipeSuggestions : "Input not recognized. Please enter a list of ingredients.";
      }

      // אם הקלט לא תואם לאף תבנית, מציע למשתמש איך להשתמש
      else {
        responseText = `Sorry, I can assist you with two things:\n1. For detailed nutritional information about a food item, type 'quantity ingredient' (e.g., '2 bananas'). 🍌\n2. To get recipe suggestions, list the ingredients you have (e.g., 'tomato, cheese, pasta'). 🍲\n\nWhat would you like to do today?`;
      }
  
    // עדכון רשימת ההודעות בהודעות החדשות
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, user: true }, // הוספת הודעת המשתמש
        { text: responseText, user: false }, // הוספת תגובת גימיני
      ]);
      setInputText(""); // ניקוי שדה הקלט אחרי שליחה
      setIsFirstMessage(false); // עדכון מצב לשליחת ההודעה הראשונה
    } 
    catch (error) {
      console.error("Error handling chat:", error); // טיפול בשגיאות אם יש
    } 
    finally {
      setLoading(false); // סיום תהליך הטעינה
    }
  };      
  

  const startNewConversation = () => {
    // אם זו השיחה הראשונה, נעדכן את הודעות המשתמש עם הודעה ברירת מחדל
    setMessages([
      {
        // הודעה שמברכת את המשתמש עם המידע על מה אפשר לעשות עם הבוט
        text: `🌟 Hello ${currentUser?.firstName}! 🌟\n\nYou can use me for two things:\n1. If you want to get detailed nutritional information about a food item, just type the quantity and the ingredient in the format 'quantity ingredient' (e.g., '2 bananas'). 🍌\n2. If you're unsure what to cook, just list the ingredients you have (e.g., 'tomato, cheese, pasta') and I'll suggest a delicious recipe! 🍲\n\nWhat would you like to do today?`,
        user: false, // קובע שזו לא הודעה של המשתמש (היא של הבינה המלאכותית)
      },
    ]);
    setIsFirstMessage(true); // מכוון את הסטייט שמציין שזו הודעה ראשונה
    setInputText(""); // מאפס את הטקסט שנכתב בשדה הקלט
  };

  // כל פעם שההודעות משתנות, נוודא שהרשימה תגלול לתחתית
  useEffect(() => {
    // פונקציה שגורמת ל-scroll להגיע לתחתית (לשלוח את המשתמש לאזור ההודעות האחרונות)
    const scrollToBottom = () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    // נדחה את פעולתה ב-100 מילישניות כדי למנוע גלילה בזמן הוספת ההודעה
    const timer = setTimeout(scrollToBottom, 100);
    
    // מחזירים פונקציה שתנקה את הטיימר במקרה שהקומפוננטה תימחק או השתנה
    return () => clearTimeout(timer);
  }, [messages]); // הגלילה תתבצע כל פעם שההודעות משתנות


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // מווסת את התנהגות המקלדת לפי המערכת (iOS / אנדרואיד)
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // מתאים את המיקום של התצוגה בעת הצגת המקלדת (לפי גובה הכותרת ב-iOS)
    >

      {/* החלק העליון של הדף - כותרת וכפתור */}
      <View style={styles.header}>
        {/* כותרת המסך */}
        <Text style={styles.title}>Recipe Chat</Text>
        {/* כפתור לחיצה על שיחה חדשה לאיפוס כל ההודעות בדף */}
        <TouchableOpacity style={styles.newConversationButton} onPress={startNewConversation}>
          <Text style={styles.newConversationText}>New Conversation</Text>
        </TouchableOpacity>
      </View>

      {/* תוכן המסך והתכתבויות בצאט */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled" // שומר את מצב המקלדת גם לאחר הקשה על מסך
        onScroll={() => Keyboard.dismiss()} // מסלק את המקלדת כאשר גוללים
      >
        {loading ? (
          <ActivityIndicator size="large" color="#3E6613" /> // מציג אינדיקטור של טעינה אם הנתונים בטעינה
        ) : (
          <View>
            {messages.map((message, index) => (
              <View key={index} style={styles.messageContainer}>
                {/* האם מדובר בתגובה של המשתמש או של הגימיני */}
                {message.user ? (
                  // תגובה של המשתמש
                  <View style={styles.userMessageContainer}>
                    <View style={styles.userMessageBubble}>
                      <Text style={styles.messageText}>
                        {message.text}
                      </Text>
                      <View style={styles.speechBubbleTailUser} />
                    </View>
                    <Image
                      source={currentUser?.profileImageUrl ? { uri: currentUser.profileImageUrl } : require('../../../Images/profile_img.jpg')}
                      style={styles.profileImage} // תמונת פרופיל של המשתמש
                    />
                  </View>
                ) : (
                  // תגובה של גימיני - כאן יהיה טיפול בקישורים
                  <View style={styles.aiMessageContainer}>
                    <Image
                      source={{ uri: 'https://images.assetsdelivery.com/compings_v2/vasilyrosca/vasilyrosca1902/vasilyrosca190200036.jpg' }}
                      style={styles.profileImage} // תמונת פרופיל של גימיני
                    />
                    <View style={styles.aiMessageBubble}>
                      <Text style={styles.messageText}>
                        {message.text.split(urlPattern).map((part, partIndex) => {
                          // אם החלק הוא קישור, ניצור Text לחיץ
                          if (urlPattern.test(part)) {
                            return (
                              <Text
                                key={partIndex}
                                style={styles.linkText} // סגנון נפרד לקישור
                                onPress={() => Linking.openURL(part)} // פותח את הקישור במכשיר
                              >
                                {part}
                              </Text>
                            );
                          }
                          // אם החלק אינו קישור, פשוט נציגו בטקסט רגיל
                          return part;
                        })}
                      </Text>
                      <View style={styles.speechBubbleTailAi} />
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
          
      {/* החלק התחתון - שורת ההקלדה ואייקון שליחה */}          
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText} // מעדכן את הטקסט שהמשתמש מקליד
          placeholder="Enter ingredients..."
          onSubmitEditing={handleChat} // מפעיל את פונקציית יצירת המתכון כשלוחצים על 'שליחה'
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleChat}>
          <MaterialIcons name="send" size={24} color="white" />{/* אייקון שליחת הודעה */}
        </TouchableOpacity>
      </View>
  
    </KeyboardAvoidingView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: "#3E6613",
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: 'bold',
  },
  newConversationButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  newConversationText: {
    color: "black",
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginLeft: 'auto',
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  userMessageBubble: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: '75%',
    position: 'relative',
    marginRight: 10,
  },
  linkText: {
    color: 'blue', // צבע לקישור
    textDecorationLine: 'underline', // קו תחתון
  },
  speechBubbleTailUser: {
    position: 'absolute',
    bottom: 5,
    right: -18,
    width: 0,
    height: 0,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 0,
    borderRightWidth: 25,
    borderLeftWidth: 0,
    borderTopWidth: 20,
  },
  aiMessageBubble: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: '75%',
    marginLeft: 10,
  },
  speechBubbleTailAi: {
    position: 'absolute',
    bottom: 5,
    left: -18, 
    width: 0,
    height: 0,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: '#FFFFFF',
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 25,
    borderTopWidth: 20,
  },

  messageText: {
    fontSize: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 15,
    marginRight: 20,
    paddingLeft: 15,
  },
  sendButton: {
    backgroundColor: "#3E6613",
    borderRadius: 50,
    padding: 15,
  },
});

export default RecipeChat;
