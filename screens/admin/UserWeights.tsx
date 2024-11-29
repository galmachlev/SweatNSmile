import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

export default function UserWeights() {
  const [weights, setWeights] = useState<number[]>([]);
  const [avgWeight, setAvgWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserWeights = async () => {
    try {
      const response = await fetch('https://database-s-smile.onrender.com/api/users/weights');
      const data = await response.json();

      if (data && data.weights) {
        const allWeights = data.weights.map((user: { weight: number }) => user.weight);
        setWeights(allWeights);

        const totalWeight = allWeights.reduce((sum, weight) => sum + weight, 0);
        setAvgWeight(totalWeight / allWeights.length);
      } else {
        console.error('No weight data returned from the API.');
      }
    } catch (error) {
      console.error('Failed to fetch user weights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeightDistribution = () => {
    if (weights.length === 0) return {};

    const ranges = [
      { label: 'Less than 50 kg', min: 0, max: 50 },
      { label: '50 - 70 kg', min: 50, max: 70 },
      { label: '70 - 90 kg', min: 70, max: 90 },
      { label: '90 - 110 kg', min: 90, max: 110 },
      { label: 'Above 110 kg', min: 110, max: Infinity },
    ];

    const distribution = ranges.map((range) => {
      const count = weights.filter((weight) => weight >= range.min && weight < range.max).length;
      return { label: range.label, percentage: ((count / weights.length) * 100).toFixed(2) };
    });

    return distribution;
  };

  useEffect(() => {
    fetchUserWeights();
  }, []);

  const distribution = getWeightDistribution();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Weight Distribution</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          {/* Average Weight */}
          {avgWeight !== null && (
            <View style={styles.boxContainer}>
              <View style={styles.countBox}>
                <Text style={styles.countText}>{avgWeight.toFixed(2)} kg</Text>
                <Text style={styles.countLabel}>Average Weight</Text>
              </View>
            </View>
          )}

          {/* General Weight Distribution */}
          <View style={styles.chartContainer}>
            {distribution.map((range, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.label}>{range.label}</Text>
                <View style={styles.percentageBarContainer}>
                  <View
                    style={[styles.percentageBar, { width: `${range.percentage}%` }]}
                  />
                  <Text style={styles.percentageText}>{range.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F4F8',
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    color: '#2E3B4E',
    textAlign: 'center',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  countBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
    minWidth: 140,
    minHeight: 140,
  },
  countText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  countLabel: {
    fontSize: 20,
    color: '#ffffff',
    marginTop: 12,
  },
  chartContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: '#2E3B4E',
    fontWeight: '600',
  },
  percentageBarContainer: {
    flex: 4,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
  },
  percentageBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  percentageText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#2E3B4E',
    fontWeight: '600',
  },
});