// DailyWeight.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ProgressBar from './weight/progressBar'; // Ensure the path is correct

const DailyWeight = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daily Weight</Text>
      <ProgressBar />
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Current weight</Text>
        <Text style={styles.infoValue}>82.1 KG</Text>
      </View>
      {/* Add other components here as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DailyWeight;
