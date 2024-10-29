import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const DonutChart: React.FC = () => {
  const [activityLevels, setActivityLevels] = useState({
    notVeryActive: 0,
    lightlyActive: 0,
    active: 0,
    veryActive: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivityLevels() {
      try {
        const response = await fetch('https://database-s-smile.onrender.com/api/users/activity-levels');
        const data = await response.json();
        setActivityLevels({
          notVeryActive: data.notVeryActive || 0,
          lightlyActive: data.lightlyActive || 0,
          active: data.active || 0,
          veryActive: data.veryActive || 0,
        });
      } catch (error) {
        console.error('Failed to fetch activity levels:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivityLevels();
  }, []);

  const data = [
    { name: 'Not Very Active', population: activityLevels.notVeryActive, color: '#FFCE76', legendFontColor: '#333', legendFontSize: 15 },
    { name: 'Lightly Active', population: activityLevels.lightlyActive, color: '#FDE598', legendFontColor: '#333', legendFontSize: 15 },
    { name: 'Active', population: activityLevels.active, color: '#F8D675', legendFontColor: '#333', legendFontSize: 15 },
    { name: 'Very Active', population: activityLevels.veryActive, color: '#E8A54B', legendFontColor: '#333', legendFontSize: 15 },
  ];

  if (loading) {
    return <ActivityIndicator size="large" color="#3E6613" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Activity Levels</Text>
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
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  header: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
});
