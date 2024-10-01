/*
 * This component is a chat screen for the user to communicate with the Gemini AI.
 * The user can input text and press the "Send" button to send a message to the AI.
 * The AI will respond with a message and the component will display the entire conversation.
 * The component uses the 'react-native-gifted-chat' library to display the conversation.
 * The component also uses the 'react-native-flash-message' library to display error messages.
 */

import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Image } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from "../../../context/userContext";

interface Message {
  text: string;
  user: boolean;
}

const RecipeChat: React.FC = () => {
  const { currentUser } = useUser();  // Use context directly
  const userName = currentUser?.firstName;
  const [messages, setMessages] = useState<Message[]>([
    { text: `🌟 Hello ${userName}! 🌟\n\nGot some ingredients in your kitchen and not sure what to make? 🥕🍅\n\nJust list the ingredients you have, and we'll send you a detailed and delicious recipe that perfectly matches what you have on hand!`, user: false }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // Ref to the ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  const API_KEY = "AIzaSyAEG-hwBmhVBOIz8t7BQRpGOyPhcr3tWiU";

  const generateRecipe = async () => {
    if (!inputText.trim()) return; // Avoid sending empty input

    setLoading(true);
    try {
      const prompt = isFirstMessage 
        ? `Based on the user's current input: ${inputText}, create a detailed and easy-to-follow recipe with detailed calorie intake.`
        : `You have previously received the following information: ${messages.filter((msg) => !msg.user).map((msg) => msg.text).join(" ")} Now, based on the user's current input: ${inputText}, create a detailed and easy-to-follow recipe.`;

      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = await response.text();

      // Remove markdown-like formatting such as ## headings and **bold**
      const cleanText = text
        .replace(/^\#{1,6}\s+/gm, '') // Remove headings like ## Heading
        .replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold** markdown

      setMessages([...messages, { text: inputText, user: true }, { text: cleanText, user: false }]);
      setInputText("");
      setIsFirstMessage(false); // Set flag to false after the first message
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([
      { text: `🌟 Hello ${userName}! 🌟\n\nGot some ingredients in your kitchen and not sure what to make? 🥕🍅\n\nJust list the ingredients you have, and we'll send you a detailed and delicious recipe that perfectly matches what you have on hand!`, user: false }
    ]);
    setIsFirstMessage(true);
    setInputText("");
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    // Delay the scroll to ensure content is rendered
    const scrollToBottom = () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const timer = setTimeout(scrollToBottom, 100); // Adjust delay if necessary

    return () => clearTimeout(timer); // Cleanup the timer
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
                    <Text style={styles.messageText}>{message.text}</Text>
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
                    <Text style={styles.messageText}>{message.text}</Text>
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
          onSubmitEditing={generateRecipe} // Trigger recipe generation on submit
        />
        <TouchableOpacity style={styles.sendButton} onPress={generateRecipe}>
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
