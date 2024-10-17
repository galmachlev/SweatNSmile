/*
 * This component is a chat screen for the user to communicate with the Gemini AI.
 * The user can input text and press the "Send" button to send a message to the AI.
 * The AI will respond with a message and the component will display the entire conversation.
 * The component uses the 'react-native-gifted-chat' library to display the conversation.
 * The component also uses the 'react-native-flash-message' library to display error messages.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "../../../context/userContext";
import { handleUserInputForQuantityAndIngredient, handleUserInputForRecipe } from "../../client/Menus/edamamApi"; // Import your utility functions

interface Message {
  text: string;
  user: boolean;
}

const RecipeChat: React.FC = () => {
  const { currentUser } = useUser(); // Use context directly
  const userName = currentUser?.firstName;
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `🌟 Hello ${userName}! 🌟\n\nYou can use me for two things:\n1. If you want to get detailed nutritional information about a food item, just type the quantity and the ingredient in the format 'quantity ingredient' (e.g., '2 bananas'). 🍌\n2. If you're unsure what to cook, just list the ingredients you have (e.g., 'tomato, cheese, pasta') and I'll suggest a delicious recipe! 🍲\n\nWhat would you like to do today?`,
      user: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // Ref to the ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  const API_KEY = "AIzaSyAEG-hwBmhVBOIz8t7BQRpGOyPhcr3tWiU"; // Your API key

  const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);

  const getGeminiResponse = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = await response.text(); // Extract text from response

      return text; // Return the text
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      return "Sorry, I couldn't fetch a response. Please try again."; // Error message
    }
  };

  const [previousIngredients, setPreviousIngredients] = useState<string[]>([]); // State to store previous ingredients
  const [ingredientHistory, setIngredientHistory] = useState<string[]>([]); // היסטוריית המרכיבים
  const [displayedRecipes, setDisplayedRecipes] = useState<string[]>([]);

  const handleChat = async () => {
    // Avoid sending empty input
    if (!inputText.trim()) return; 
    setLoading(true);
    
    try {
      let responseText: string = ""; // Ensure responseText is a string
  
      // Define regex patterns
      const ingredientPattern = /^\d+\s+\w+/; // Matches 'quantity ingredient'
      const recipePattern = /^[\w\s,]+$/; // Matches a comma-separated list of ingredients
      const generalGreetingPattern = /^(hello|hi|hey|help|what can you do|how are you)/i; // Matches general greetings
      const nutritionalRequestPattern = /^(give me|what is|tell me) (the )?calories? (of|for)? (\d+)\s+(\w+)/i; // Matches phrases like "give me the calories of 2 apples"
  
      // Check for general greetings or unrelated questions
      if (generalGreetingPattern.test(inputText)) {
        responseText = "Hi there! 👋 I'm here to help you with nutritional information or recipe suggestions!";
      } 
      // Check if input matches the nutritional request pattern
      else if (nutritionalRequestPattern.test(inputText)) {
        const matches = inputText.match(nutritionalRequestPattern);
        if (matches) {
          const quantity = matches[4]; // Extract quantity
          const ingredient = matches[5]; // Extract ingredient
          const nutritionalInfo = await handleUserInputForQuantityAndIngredient(`${quantity} ${ingredient}`); // Call nutritional info function
          if (nutritionalInfo) {
            responseText = `Nutritional Information for ${quantity} ${ingredient}:\n- Calories: ${nutritionalInfo.calories}\n- Protein: ${nutritionalInfo.protein}\n- Fat: ${nutritionalInfo.fat}\n- Carbs: ${nutritionalInfo.carbs}\n- Sodium: ${nutritionalInfo.sodium}`;
          } else {
            responseText = "Input not recognized. Please enter in the format 'quantity ingredient' in English.";
          }
        }
      } 
      // Check if input matches the ingredient pattern
      else if (ingredientPattern.test(inputText)) {
        const nutritionalInfo = await handleUserInputForQuantityAndIngredient(inputText);
        if (nutritionalInfo) {
          // Add the ingredient to history
          setIngredientHistory(prev => [...prev, inputText]); // שמירת המרכיב להיסטוריה
          responseText = `Nutritional Information for ${inputText}:\n- Calories: ${nutritionalInfo.calories}\n- Protein: ${nutritionalInfo.protein}\n- Fat: ${nutritionalInfo.fat}\n- Carbs: ${nutritionalInfo.carbs}\n- Sodium: ${nutritionalInfo.sodium}`;
        } else {
          responseText = "Input not recognized. Please enter in the format 'quantity ingredient' in English.";
        }
      } 
      // Check if input matches the recipe pattern
      else if (recipePattern.test(inputText)) {
        const recipeSuggestions = await handleUserInputForRecipe(inputText, displayedRecipes);
        setPreviousIngredients(inputText.split(',').map(ingredient => ingredient.trim()));
        
        // הוספת המתכון שהוצג להיסטוריה
        if (recipeSuggestions.startsWith('🍽️ Recipe:')) {
          const recipeTitle = recipeSuggestions.split('\n')[0].replace('🍽️ Recipe: ', '');
          setDisplayedRecipes(prev => [...prev, recipeTitle]); // הוספת המתכון שהוצג
        }
        
        responseText = typeof recipeSuggestions === 'string' ? recipeSuggestions : "Input not recognized. Please enter a list of ingredients.";
      }
            // If the input doesn't match any pattern, guide the user
      else {
        responseText = `Sorry, I can assist you with two things:\n1. For detailed nutritional information about a food item, type 'quantity ingredient' (e.g., '2 bananas'). 🍌\n2. To get recipe suggestions, list the ingredients you have (e.g., 'tomato, cheese, pasta'). 🍲\n\nWhat would you like to do today?`;
      }
  
      // Update messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, user: true },
        { text: responseText, user: false },
      ]);
      setInputText(""); // Clear input after sending
      setIsFirstMessage(false); // Update first message state
    } 
    catch (error) {
      console.error("Error handling chat:", error);
    } 
    finally {
      setLoading(false); // Reset loading state
    }
  };      
    
  
  // הוסף את זה בתחילת הקובץ או בתוך הרכיב שלך
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  const startNewConversation = () => {
    setMessages([
      {
        text: `🌟 Hello ${userName}! 🌟\n\nYou can use me for two things:\n1. If you want to get detailed nutritional information about a food item, just type the quantity and the ingredient in the format 'quantity ingredient' (e.g., '2 bananas'). 🍌\n2. If you're unsure what to cook, just list the ingredients you have (e.g., 'tomato, cheese, pasta') and I'll suggest a delicious recipe! 🍲\n\nWhat would you like to do today?`,
        user: false,
      },
    ]);
    setIsFirstMessage(true);
    setInputText("");
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const scrollToBottom = () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);
  


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust this value based on your header height
    >
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Chat</Text>
        <TouchableOpacity style={styles.newConversationButton} onPress={startNewConversation}>
          <Text style={styles.newConversationText}>New Conversation</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onScroll={() => Keyboard.dismiss()} // Dismiss keyboard on scroll
      >
        {loading ? (
          <ActivityIndicator size="large" color="#3E6613" />
        ) : (
        <View>
{messages.map((message, index) => (
  <View key={index} style={styles.messageContainer}>
    {message.user ? (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMessageBubble}>
          <Text style={styles.messageText}>
            {message.text.split(urlPattern).map((part, partIndex) => {
              // אם החלק הוא קישור, ניצור Text לחיץ
              if (urlPattern.test(part)) {
                return (
                  <Text
                    key={partIndex}
                    style={styles.linkText} // סגנון נפרד לקישור
                    onPress={() => Linking.openURL(part)}
                  >
                    {part}
                  </Text>
                );
              }
              // אם החלק אינו קישור, פשוט נציגו בטקסט רגיל
              return part;
            })}
          </Text>
          <View style={styles.speechBubbleTailUser} />
        </View>
        <Image
          source={currentUser?.img ? { uri: currentUser.img } : require('../../../Images/profile_img.jpg')}
          style={styles.profileImage}
        />
      </View>
    ) : (
      <View style={styles.aiMessageContainer}>
        <Image
          source={{ uri: 'https://images.assetsdelivery.com/compings_v2/vasilyrosca/vasilyrosca1902/vasilyrosca190200036.jpg' }}
          style={styles.profileImage}
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
                    onPress={() => Linking.openURL(part)}
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
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter ingredients..."
          onSubmitEditing={handleChat} // Trigger recipe generation on submit
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleChat}>
          <MaterialIcons name="send" size={24} color="white" />
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
