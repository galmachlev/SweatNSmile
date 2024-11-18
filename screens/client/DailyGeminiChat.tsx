/*
 * DailyGeminiChat Component
 * 
 * This component serves as an interactive chat screen for users to engage with the Gemini AI.
 * Users can trigger a new message generation by tapping the "Refresh" button.
 * The AI generates a nutrition tip, motivational health advice, or dieting facts, which are displayed 
 * in a scrollable view. Loading states are managed to enhance user experience.
 * 
 * Libraries utilized:
 * - `@google/generative-ai` for content generation.
 * - `react-native-flash-message` for displaying potential error notifications.
 * - `react-native-vector-icons` for icon representation.
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import FlashMessage from "react-native-flash-message";
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  text: string;
  user: boolean;
}

const DailyGeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  const API_KEY = "AIzaSyAEG-hwBmhVBOIz8t7BQRpGOyPhcr3tWiU";

  // Function to generate a daily fact using Google Generative AI
  const generateDailyFact = async () => {
    try {
      setReloading(true);
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Array of customizable prompts for the AI
      const prompts = [
        "Share a quick tip for healthy eating",
        "Give a motivational quote about staying on track with a diet",
        "What’s a fun fact about the benefits of certain foods?",
        "Tell a surprising fact about nutrition or dieting",
      ];

      // Randomly select a prompt from the array
      const prompt = "Limit your response to 2-3 lines and add an emoji at the end: " + prompts[Math.floor(Math.random() * prompts.length)];

      // Request the AI to generate content based on the chosen prompt
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Update messages state with the AI's response
      setMessages([{ text, user: false }]);
      setLoading(false);
      setReloading(false);
    } catch (error) {
      console.error("Error fetching daily fact:", error);
      setLoading(false);
      setReloading(false);
    }
  };

  // useEffect to trigger daily fact generation on component mount
  useEffect(() => {
    generateDailyFact();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brain Boost</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={generateDailyFact}>
          <MaterialIcons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text>Loading Quick Fact 🌟...</Text>
        ) : reloading ? (
          <Text>Reloading...</Text>
        ) : (
          <View>
            {messages.map((message, index) => (
              <View key={index} style={styles.messageContainer}>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))}
            {messages.length === 0 && <Text>No messages</Text>}
          </View>
        )}
      </ScrollView>
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
