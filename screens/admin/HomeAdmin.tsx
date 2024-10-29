import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigationTypes';
import { DonutChart } from './DonutChart'; // Import DonutChart as named export

type AdminPageNavigationProp = StackNavigationProp<RootStackParamList, 'HomeAdmin'>;

export default function AdminPage() {
  const navigation = useNavigation<AdminPageNavigationProp>();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('https://database-s-smile.onrender.com/api/users/countUsers');
      const data = await response.json();
      setUserCount(data.userCount);
    } catch (error) {
      console.error('Failed to fetch user count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, []);

  const handleAddUser = () => {
    navigation.navigate('AddUser');
  };

  const handleViewUsers = () => {
    navigation.navigate('UserTable');
  };

  const handleViewUserWeights = () => {
    navigation.navigate('UserWeights');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      <View style={styles.boxContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#3E6613" />
        ) : (
          <View style={styles.countBox}>
            <Text style={styles.countText}>{userCount}</Text>
            <Text style={styles.countLabel}>Registered Users</Text>
          </View>
        )}
      </View>

      {/* Display the DonutChart for user activity levels */}
      <DonutChart />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleViewUsers}>
          <Text style={styles.buttonText}>View All Users</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleViewUserWeights}>
          <Text style={styles.buttonText}>View User Weights</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
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
  buttonContainer: {
    marginVertical: 15,
    width: '80%',
  },
  button: {
    backgroundColor: '#3E6613', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3, 
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
