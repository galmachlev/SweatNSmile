import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';

export default function AddUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAddUser = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('https://database-s-smile.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          isAdmin,
          currentWeight: parseFloat(currentWeight),
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        Alert.alert('Success', 'User added successfully');
        // Optionally reset form fields
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setBirthDate('');
        setCurrentWeight('');
      } else {
        Alert.alert('Error', data.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.screenContainer}>
        <View style={styles.screenTitleContainer}>
          <Text style={styles.screenPageTitle1}>Add New User</Text>
          <Text style={styles.screenPageTitle2}>Please fill out the information below</Text>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Current Weight</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter current weight"
          value={currentWeight}
          keyboardType="numeric"
          onChangeText={setCurrentWeight}
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleAddUser}>
          <Text style={styles.nextButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 90,
  },
  screenTitleContainer: {
    marginTop: 10,
    marginBottom: 50,
  },
  screenPageTitle1: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#696B6D',
  },
  screenPageTitle2: {
    fontSize: 14,
    textAlign: 'center',
    color: '#696B6D',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#696B6D',
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  nextButton: {
    marginTop: 25,
    backgroundColor: '#3E6613',
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

