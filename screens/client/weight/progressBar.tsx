import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet } from 'react-native';

const ProgressBar = () => {
  return (
    <LineChart
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [82.1, 81.8, 81.5, 81.2, 80.9, 80.5],
          },
        ],
      }}
      width={Dimensions.get('window').width - 40} // from react-native
      height={220}
      yAxisSuffix=" kg"
      chartConfig={{
        backgroundColor: '#FFFFFF',
        backgroundGradientFrom: '#FFFFFF',
        backgroundGradientTo: '#FFFFFF',
        decimalPlaces: 1,
        color: (opacity = 1) => `#C6CAD0`,
        labelColor: (opacity = 1) => `#808387`,
      }}
      bezier
      style={styles.chart}
    />
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingVertical: 20, 
  },
});

export default ProgressBar;
