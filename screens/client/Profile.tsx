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
import { useUser } from '../../context/userContext'; // Import the useUser hook
import axios from 'axios'; // Import axios
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

interface ProfileImage {
  uri: string | null;
  cloudinaryUrl?: string;
}

export default function Profile() {
  const { currentUser } = useUser();
  const { updateProfileImage } = useUser();
  const defaultProfileImage = require('../../Images/profile_img.jpg');
  const [profileImage, setProfileImage] = useState({ uri: defaultProfileImage });
  const [fullSizeImageUri, setFullSizeImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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

  const pickImage = async () => {
    Alert.alert(
      'Choose Image Source',
      'Do you want to take a new photo or pick from gallery?',
      [
        { text: 'Take a new photo', onPress: takePhoto },
        { text: 'Upload from Gallery', onPress: pickFromGallery },
        { text: 'View Full Size', onPress: () => viewFullSize(profileImage.uri) },
        { text: 'Delete Image', onPress: deleteImage },
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
      updateProfileImage(imageUri); 
      console.log('Current profile image:', profileImage);
      const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
      if (cloudinaryUrl) {
        const newProfileImage = { uri: cloudinaryUrl };
        setProfileImage(newProfileImage);
        saveProfileImage(newProfileImage);
      }
    }
  };

  const uploadImageToCloudinary = async (imageUri: string) => {
    const cloudName = 'duiifdn9s';
    const uploadPreset = 'GALMACH';
    const userId = currentUser ? currentUser.email : 'defaultUserEmail';

    const formData = new FormData();
    formData.append('file', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' });
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `user_images/${userId}`);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Upload failed', 'Could not upload the image to Cloudinary.');
      return null;
    }
  };

  const viewFullSize = (uri: string | null) => {
    setFullSizeImageUri(uri);
    setModalVisible(true);
  };

  const deleteImage = () => {
    Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this image?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: async () => {
                    setProfileImage(defaultProfileImage);
                    updateProfileImage(defaultProfileImage);
                    await AsyncStorage.removeItem(`profileImage_${currentUser ? currentUser.email : 'defaultUserEmail'}`);
                },
            },
        ]
    );
};
  
  const saveProfileImage = async (image: ProfileImage) => {
    const userId = currentUser ? currentUser.email : 'defaultUserEmail';
    try {
      await AsyncStorage.setItem(`profileImage_${userId}`, JSON.stringify(image));
    } catch (error) {
      console.error('Error saving profile image', error);
    }
  };

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Profile settings</Text>
            <Button title="Logout" type="clear" titleStyle={styles.logoutButton} onPress={handleLogout} />
          </View>
          <View style={styles.profileSection}>
          <Avatar
            rounded
            size="xlarge"
            source={profileImage} // This should be an object with uri
            containerStyle={styles.avatar}
          >
            <Avatar.Accessory size={35} onPress={pickImage} />
          </Avatar>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="language" type="font-awesome" color="#517fa4" />
              <Text style={styles.infoText}>Language: {currentUser?.language || 'English'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="balance-scale" type="font-awesome" color="#517fa4" />
              <Text style={styles.infoText}>Weight unit: {currentUser?.weightUnit || 'KG'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="lock" type="font-awesome" color="#517fa4" />
              <Text style={styles.infoText}>Change password</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={currentUser?.email || ''}
              keyboardType="email-address"
            />
            <Text style={styles.inputLabel}>Current Weight</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your current weight"
              value={currentUser?.currentWeight?.toString() || ''}
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Goal Weight</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your goal weight"
              value={currentUser?.goalWeight?.toString() || ''}
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Height</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your height (cm)"
              value={currentUser?.height?.toString() || ''}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Modal for Full Size Image */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
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
