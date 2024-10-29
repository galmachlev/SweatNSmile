// AverageWeightBox.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AverageWeightBoxProps {
  avgWeight: number;
}

const AverageWeightBox: React.FC<AverageWeightBoxProps> = ({ avgWeight }) => (
  <View style={styles.boxContainer}>
    <View style={styles.countBox}>
      <Text style={styles.countText}>{avgWeight.toFixed(2)} kg</Text>
      <Text style={styles.countLabel}>Average Weight</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  countBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    minWidth: 100,
    minHeight: 100,
  },
  countText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  countLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 8,
  },
});

export default AverageWeightBox;
