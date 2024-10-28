import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface ProgressBarProps {
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
}

const screenWidth = Dimensions.get('window').width;

const ProgressBar: React.FC<ProgressBarProps> = ({ startWeight, currentWeight, goalWeight }) => {
  const validStartWeight = startWeight || 1;
  const validCurrentWeight = currentWeight || validStartWeight;
  const validGoalWeight = goalWeight || validStartWeight;

  const totalWeightToLose = validStartWeight - validGoalWeight;
  const weightLost = validStartWeight - validCurrentWeight;

  const progressPercentage = Math.min(Math.max((weightLost / totalWeightToLose) * 100, 0), 100);
  const remainingPercentage = 100 - progressPercentage;

  const data = [
    {
      name: `Achieved`,
      population: progressPercentage,
      color: '#4CAF50',
      legendFontColor: '#4CAF50',
      legendFontSize: 15,
    },
    {
      name: `Remaining`,
      population: remainingPercentage,
      color: '#d9d9d9',
      legendFontColor: '#666666',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.widgetContainer}>
      <Text style={styles.title}>Progress to Goal Weight</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={screenWidth - 80}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 5,
            barPercentage: 0.5,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        <Text style={styles.progressText}>{Math.round(progressPercentage)}% towards your goal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  chartContainer: {
    backgroundColor: '#f0f4f8',
    padding: 25,
    borderRadius: 30,
    borderColor: '#d1d1d1',
    borderWidth: 2,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center', // Center align the percentage text
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  progressText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '700',
    marginTop: 15, // Adjust space between chart and text
    textAlign: 'center',
  },
});

export default ProgressBar;
