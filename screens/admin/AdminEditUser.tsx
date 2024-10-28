import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const activityLevelOptions = [
  { label: 'Not Very Active', value: 'notVeryActive' },
  { label: 'Lightly Active', value: 'lightlyActive' },
  { label: 'Active', value: 'active' },
  { label: 'Very Active', value: 'veryActive' },
];

export default function AdminEditUser() {
  const { params } = useRoute();
  const { updateUserDetails } = useUser();
  const navigation = useNavigation();

  const user = params?.user;
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || '');
  const [startWeight, setStartWeight] = useState(user?.startWeight?.toString() || '');
  const [currentWeight, setCurrentWeight] = useState(user?.currentWeight?.toString() || '');
  const [goalWeight, setGoalWeight] = useState(user?.goalWeight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');

  const handleSaveChanges = () => {
    const updates = {
      firstName,
      lastName,
      gender,
      activityLevel,
      startWeight: parseFloat(startWeight),
      currentWeight: parseFloat(currentWeight),
      goalWeight: parseFloat(goalWeight),
      height: parseFloat(height),
    };

    updateUserDetails(user.email, updates);
    Alert.alert('Success', 'User details updated successfully.');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit User</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Gender</Text>
        <RNPickerSelect onValueChange={setGender} items={genderOptions} value={gender} style={pickerSelectStyles} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Activity Level</Text>
        <RNPickerSelect onValueChange={setActivityLevel} items={activityLevelOptions} value={activityLevel} style={pickerSelectStyles} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Start Weight</Text>
        <TextInput style={styles.input} value={startWeight} keyboardType="numeric" onChangeText={setStartWeight} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Current Weight</Text>
        <TextInput style={styles.input} value={currentWeight} keyboardType="numeric" onChangeText={setCurrentWeight} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Goal Weight</Text>
        <TextInput style={styles.input} value={goalWeight} keyboardType="numeric" onChangeText={setGoalWeight} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Height</Text>
        <TextInput style={styles.input} value={height} keyboardType="numeric" onChangeText={setHeight} />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#3E6613', marginBottom: 20 },
  fieldContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 10, fontSize: 16, borderColor: '#ddd', borderWidth: 1 },
  saveButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, color: 'black' },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 0.5, borderColor: '#ddd', borderRadius: 10, color: 'black' },
});
