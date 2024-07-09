import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import FlashMessage, { showMessage } from "react-native-flash-message";
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

  const generateDailyFact = async () => {
    try {
      setReloading(true);
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "write the user a fact or advice about food or sport or healthy lifestyle around 25 words. include relative emojis at the end.";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setMessages([{ text, user: false }]);
      setLoading(false);
      setReloading(false);
    } catch (error) {
      console.error("Error fetching daily fact:", error);
      setLoading(false);
      setReloading(false);
    }
  };

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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10, // Adjust padding as needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10, // Ensure some space between header and content
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
