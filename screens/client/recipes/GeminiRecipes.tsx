import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  text: string;
  user: boolean;
}

const RecipeChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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
        ? `Based on the user's current input: ${inputText}, create a detailed and easy-to-follow recipe.`
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
    setMessages([]);
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
          <Text style={styles.newConversationText}>Start New Conversation</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onScroll={() => Keyboard.dismiss()} // Dismiss keyboard on scroll
      >
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : (
          <View>
            {messages.map((message, index) => (
              <View key={index} style={[styles.message, message.user ? styles.userMessage : styles.aiMessage]}>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))}
            {messages.length === 0 && !loading && <Text style={styles.startMessage}>Hey! What ingredients do you have?</Text>}
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
  message: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: "#E0E0E0",
  },
  aiMessage: {
    alignSelf: 'flex-end',
    backgroundColor: "#FFCE76",
  },
  messageText: {
    fontSize: 16,
  },
  startMessage: {
    fontSize: 18,
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
