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
      color: '#3E6613',
      legendFontColor: '#3E6613',
      legendFontSize: 14,
    },
    {
      name: `Remaining`,
      population: remainingPercentage,
      color: '#d9d9d9',
      legendFontColor: '#666666',
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.chartContainer}>
      <Text style={styles.title}>Progress to Goal Weight</Text>
        <PieChart
          data ={data}
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
    backgroundColor: '#f9f9f9',
    padding: 13,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4d4d4d',
    padding: 15,
    textAlign: 'center',
    letterSpacing: 1.1,
    
  },
  progressText: {
    fontSize: 14,
    color: '#4d4d4d',
    fontWeight: '700',
    marginTop: 10, // Adjust space between chart and text
    textAlign: 'center',
  },
});

export default ProgressBar;
