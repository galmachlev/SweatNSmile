import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
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

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brain Boost</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={generateDailyFact}>
          <MaterialIcons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {loading ? (
          <Text>Loading Quick Fact 🌟...</Text>
        ) : reloading ? (
          <Text>Reloading...</Text>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text>No messages</Text>}
          />
        )}
      </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  messageContainer: {
    padding: 5,
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
  },
  refreshButton: {
    padding: 10,
  },
});

export default DailyGeminiChat;
