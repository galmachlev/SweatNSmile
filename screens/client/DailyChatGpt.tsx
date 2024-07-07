import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios, { AxiosError } from 'axios';

const DailyFact = () => {
  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDailyFact = async () => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
            messages: [
              { role: 'user', content: 'Provide a daily fact related to sports or healthy food.' },
            ],
          },
          {
            headers: {
              Authorization: `Bearer sk-proj-f09oE2vrxyPbmWLzLFdZT3BlbkFJbwZDGa7xpvCHlZmt3UWZ`,
              'Content-Type': 'application/json',
            },
          }
        );

        const assistantMessage = response.data.choices[0].message.content;
        setFact(assistantMessage);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle AxiosError
          if (error.response && error.response.status === 429) {
            console.log('Too many requests. Please wait and try again later.');
            // Implement retry logic here if needed
          } else {
            console.error('Error fetching daily fact:', error.message);
          }
        } else {
          // Handle other errors
          console.error('Error fetching daily fact:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDailyFact();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Fact</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.factText}>{fact}</Text>
          <Image
            source={require('../../Images/avocado.png')}
            style={styles.image}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  factText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default DailyFact;
