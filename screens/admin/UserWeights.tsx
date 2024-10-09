import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

export default function UserWeights() {
  const [weights, setWeights] = useState<{ name: string; weight: number }[]>([]);
  const [avgWeight, setAvgWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch user weight data from the backend
  const fetchUserWeights = async () => {
    try {
      const response = await fetch('https://database-s-smile.onrender.com/api/users/weights');
      const data = await response.json();

      if (data && data.weights) {
        setWeights(data.weights);
        setAvgWeight(data.avgWeight);
      } else {
        console.error('No weight data returned from the API.');
      }
    } catch (error) {
      console.error('Failed to fetch user weights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWeights();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Weights</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3E6613" />
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

          {/* Custom Bar Chart */}
          <View style={styles.chartContainer}>
            {weights.map((user, index) => {
              // Ensure the height is a valid number, fallback to 1 if weight is invalid
              const barHeight = user.weight ? user.weight * 3 : 1;

              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barLabel}>{user.name}</Text>
                  <View style={[styles.bar, { height: barHeight }]}>
                    <Text style={styles.barText}>{user.weight} kg</Text>
                  </View>
                </View>
              );
            })}
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
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  countBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    minWidth: 100,
    minHeight: 100,
  },
  countText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3E6613',
  },
  countLabel: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 50,
  },
  bar: {
    backgroundColor: '#3E6613',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  barLabel: {
    marginBottom: 4,
    fontSize: 14,
    textAlign: 'center',
  },
});
