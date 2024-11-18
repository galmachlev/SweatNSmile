import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Icon, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

interface ProfileImage {
  uri: string | null;
  cloudinaryUrl?: string;
}

// Picker gender select options
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

// Picker activity level select options
const activityLevelOptions = [
  { label: 'Not Very Active', value: 'notVeryActive' },
  { label: 'Lightly Active', value: 'lightlyActive' },
  { label: 'Active', value: 'active' },
  { label: 'Very Active', value: 'veryActive' },
];

export default function Profile() {
  const { currentUser, updateUserDetails } = useUser();
  const { updateProfileImage } = useUser();
  const defaultProfileImage = require('../../Images/profile_img.jpg');
  const [profileImage, setProfileImage] = useState({
    uri: currentUser?.profileImageUrl || defaultProfileImage,
  });
  const [fullSizeImageUri, setFullSizeImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // State variables for each field's edit mode
  const [isEditingField, setIsEditingField] = useState({
    fullName: false,
    gender: false,
    activityLevel: false,
    startWeight: false,
    currentWeight: false,
    goalWeight: false,
    height: false,
  });

  // State variables for field values
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [gender, setGender] = useState(currentUser?.gender || '');
  const [activityLevel, setActivityLevel] = useState(currentUser?.activityLevel || '');
  const [startWeight, setStartWeight] = useState(currentUser?.startWeight?.toString() || '');
  const [currentWeight, setCurrentWeight] = useState(currentUser?.currentWeight?.toString() || '');
  const [goalWeight, setGoalWeight] = useState(currentUser?.goalWeight?.toString() || '');
  const [height, setHeight] = useState(currentUser?.height?.toString() || '');
  const [isProfileImageChanged, setIsProfileImageChanged] = useState(false);

  

  const navigation = useNavigation();

  // Function to load profile image
  useEffect(() => {
    const loadProfileImage = async () => {
      const userId = currentUser ? currentUser.email : 'defaultUserEmail';
      try {
        const savedProfileImage = await AsyncStorage.getItem(`profileImage_${userId}`);
        setProfileImage(savedProfileImage ? JSON.parse(savedProfileImage) : { uri: defaultProfileImage });
      } catch (error) {
        console.error('Error loading profile image', error);
      }
    };
    loadProfileImage();
  }, [currentUser]);

  // Function to handle image result
  const pickImage = async () => {
    Alert.alert(
      'Choose Image Source',
      'Do you want to take a new photo or pick from gallery?',
      [
        { text: 'Take a new photo', onPress: takePhoto },
        { text: 'Upload from Gallery', onPress: pickFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    handleImageResult(result);
  };
  
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    handleImageResult(result);
  };
  
  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
      if (cloudinaryUrl) {
        const newProfileImage = { uri: cloudinaryUrl };
        setProfileImage(newProfileImage);
        saveProfileImage(newProfileImage);
        updateProfileImage(cloudinaryUrl); // Update profile image in user context
        setIsProfileImageChanged(true); // Mark profile image as changed
      }
    }
  };
  
  const uploadImageToCloudinary = async (imageUri: string) => {
    const cloudName = 'duiifdn9s';
    const uploadPreset = 'GALMACH';
  
    const formData = new FormData();
    formData.append('file', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' });
    formData.append('upload_preset', uploadPreset);
  
    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Upload failed', 'Could not upload the image to Cloudinary.');
      return null;
    }
  };
  
  const saveProfileImage = async (image: ProfileImage) => {
    const userId = currentUser ? currentUser.email : 'defaultUserEmail';
    try {
      await AsyncStorage.setItem(`profileImage_${userId}`, JSON.stringify(image));
    } catch (error) {
      console.error('Error saving profile image', error);
    }
  };
  

  // Function to handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ],
      { cancelable: false }
    );
  };

  // Function to handle field edit toggle
  const handleFieldEdit = (fieldName: string) => {
    setIsEditingField((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Function to save all changes
  const handleSaveChanges = () => {
    if (currentUser) {
      const updates: Partial<User> = {
        firstName,
        lastName,
        gender,
        activityLevel,
        startWeight: parseFloat(startWeight),
        currentWeight: parseFloat(currentWeight),
        goalWeight: parseFloat(goalWeight),
        height: parseFloat(height),
        profileImageUrl: isProfileImageChanged ? profileImage.uri : currentUser.profileImageUrl,
      };
  
      updateUserDetails(currentUser.email, updates);
      setIsProfileImageChanged(false); // Reset the profile image change flag
      Alert.alert('Success', 'Profile updated successfully.');
    }
  };  

  // Check if any field is being edited
  const isAnyFieldEditing = Object.values(isEditingField).some((editing) => editing) || isProfileImageChanged;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Profile Settings</Text>
            <Button title="Logout" type="clear" titleStyle={styles.logoutButton} onPress={handleLogout} />
          </View>
          <View style={styles.profileSection}>
            <Avatar
              rounded
              size="xlarge"
              source={profileImage}
              containerStyle={styles.avatar}
            >
              <Avatar.Accessory size={35} onPress={pickImage} />
            </Avatar>
          </View>

          <View style={styles.inputContainer}>
            {/* Full Name */}
            <View style={styles.fieldRow}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TouchableOpacity onPress={() => handleFieldEdit('fullName')}>
                <Icon name="edit" type="font-awesome" color="#517fa4" size={20} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                isEditingField.fullName && styles.inputEditing,
              ]}
              placeholder="Enter your full name"
              value={`${firstName} ${lastName}`}
              editable={isEditingField.fullName}
              onChangeText={(text) => {
                const [first, ...last] = text.split(' ');
                setFirstName(first);
                setLastName(last.join(' '));
              }}
            />

            {/* Gender */}
            <View style={styles.fieldRow}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TouchableOpacity onPress={() => handleFieldEdit('gender')}>
                <Icon name="edit" type="font-awesome" color="#517fa4" size={20} />
              </TouchableOpacity>
            </View>
            <RNPickerSelect
              onValueChange={(value) => setGender(value)}
              items={genderOptions}
              value={gender}
              placeholder={{ label: 'Select your gender', value: null }}
              style={{
                ...pickerSelectStyles,
                inputIOS: [
                  pickerSelectStyles.inputIOS,
                  isEditingField.gender && pickerSelectStyles.inputEditing,
                ],
                inputAndroid: [
                  pickerSelectStyles.inputAndroid,
                  isEditingField.gender && pickerSelectStyles.inputEditing,
                ],
              }}
              disabled={!isEditingField.gender}
            />

            {/* Activity Level */}
            <View style={styles.fieldRow}>
              <Text style={styles.inputLabel}>Activity Level</Text>
              <TouchableOpacity onPress={() => handleFieldEdit('activityLevel')}>
                <Icon name="edit" type="font-awesome" color="#517fa4" size={20} />
              </TouchableOpacity>
            </View>
            <RNPickerSelect
              onValueChange={(value) => setActivityLevel(value)}
              items={activityLevelOptions}
              value={activityLevel}
              placeholder={{ label: 'Select your activity level', value: null }}
              style={{
                ...pickerSelectStyles,
                inputIOS: [
                  pickerSelectStyles.inputIOS,
                  isEditingField.activityLevel && pickerSelectStyles.inputEditing,
                ],
                inputAndroid: [
                  pickerSelectStyles.inputAndroid,
                  isEditingField.activityLevel && pickerSelectStyles.inputEditing,
                ],
              }}
              disabled={!isEditingField.activityLevel}
            />

            {/* Start Weight */}
            <View style={styles.fieldRow}>
              <Text style={styles.inputLabel}>Start Weight</Text>
              <TouchableOpacity onPress={() => handleFieldEdit('startWeight')}>
                <Icon name="edit" type="font-awesome" color="#517fa4" size={20} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                isEditingField.startWeight && styles.inputEditing,
              ]}
              placeholder="Enter your start weight"
              value={startWeight}
              keyboardType="numeric"
              editable={isEditingField.startWeight}
              onChangeText={setStartWeight}
            />

            {/* Current Weight */}
            <View style={styles.fieldRow}>
              <Text style={styles.inputLabel}>Current Weight</Text>
              <TouchableOpacity onPress={() => handleFieldEdit('currentWeight')}>
                <Icon name="edit" type="font-awesome" color="#517fa4" size={20} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                isEditingField.currentWeight && styles.inputEditing,
              ]}
              placeholder="Enter your current weight"
              value={currentWeight}
              keyboardType="numeric"
              editable={isEditingField.currentWeight}
              onChangeText={setCurrentWeight}
            />

            {/* Goal Weight */}
            <View style={styles.fieldRow}>
              <Text style={styles.inputLabel}>Goal Weight</Text>
              <TouchableOpacity onPress={() => handleFieldEdit('goalWeight')}>
                <Icon name="edit" type="font-awesome" color="#517fa4" size={20} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                isEditingField.goalWeight && styles.inputEditing,
              ]}
              placeholder="Enter your goal weight"
              value={goalWeight}
              keyboardType="numeric"
              editable={isEditingField.goalWeight}
              onChangeText={setGoalWeight}
            />

            {/* Height */}
            <View style={styles.fieldRow}>
              <Text style={styles.inputLabel}>Height</Text>
              <TouchableOpacity onPress={() => handleFieldEdit('height')}>
                <Icon name="edit" type="font-awesome" color="#517fa4" size={20} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                isEditingField.height && styles.inputEditing,
              ]}
              placeholder="Enter your height (cm)"
              value={height}
              keyboardType="numeric"
              editable={isEditingField.height}
              onChangeText={setHeight}
            />
          </View>

          {/* Save Changes Button */}
          {isAnyFieldEditing && (
            <Button
              title="Save Changes"
              onPress={handleSaveChanges}
              buttonStyle={styles.saveButton}
              containerStyle={styles.saveButtonContainer}
            />
          )}
        </View>

        {/* Modal for Full Size Image */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {fullSizeImageUri && (
              <Image source={{ uri: fullSizeImageUri }} style={styles.fullSizeImage} resizeMode="contain" />
            )}
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    color: '#4caf50',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputEditing: {
    backgroundColor: '#FDE598', // Light blue background to indicate editing
  },
  saveButton: {
    backgroundColor: '#3E6613',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 1000,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  inputEditing: {
    backgroundColor: '#FDE598',
  },
});
