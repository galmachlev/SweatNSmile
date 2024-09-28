/*
 * This component renders a line chart that displays the user's weight
 * measurements over time. It receives a callback function as a prop that
 * is called when the component mounts, and passes the last weight measurement
 * to it.
 *
 * The chart is rendered using the 'react-native-chart-kit' library.
 * The data for the chart is hardcoded for now, but it will be replaced with
 * actual data from the user's weight measurements in the future.
 */

import React, { useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet } from 'react-native';

interface ProgressBarProps {
  onLastValueChange: (value: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ onLastValueChange }) => {
  const data = [82.1, 81.8, 81.5, 81.2, 80.9, 80.5, 80.7, 80.6];

  useEffect(() => {
    // Notify parent component about the last value
    onLastValueChange(data[data.length - 1]);
  }, [onLastValueChange]);

  return (
    <LineChart
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: data,
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