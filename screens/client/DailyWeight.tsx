import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import ProgressBar from './weight/progressBar'; // Ensure the path is correct
import WaterConsumption from './weight/WaterConsumption';
import StepsCounter from './weight/StepsCounter';

const DailyWeight = () => {
  const screenWidth = Dimensions.get('window').width;
  const componentWidth = (screenWidth - 60) / 2; // 60 for padding and spacing

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daily Weight</Text>
      <ProgressBar />
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Current weight</Text>
        <Text style={styles.infoValue}>82.1 KG</Text>
      </View>
      {/* Use flexWrap to handle component sizing */}
      <View style={styles.row}>

        {/* Use flex: 1 to ensure components take equal space */}
        <View style={[styles.componentContainer, { width: componentWidth }]}>
          <WaterConsumption />
        </View>
        <View style={[styles.componentContainer, { width: componentWidth }]}>
          <StepsCounter />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    margin: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // Handle wrapping of components
    width: '100%',
  },
  componentContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Ensure equal sizing of components
  },
});

export default DailyWeight;
