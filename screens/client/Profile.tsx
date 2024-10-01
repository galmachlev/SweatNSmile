/*
 * This component renders a profile screen for the user.
 * It displays a username, a profile image, and a button to select a new profile image.
 * The component also renders a text input for the user to change their username.
 * The component will update the user's profile image and username in the UserContext
 * when the user presses the "Save" button.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Modal, TouchableOpacity, SafeAreaView, Image, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Icon, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../context/userContext'; // Import the useUser hook

const FullSizeImage = ({ visible, image, onClose }: any) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" type="material" color="#fff" size={30} />
        </TouchableOpacity>
        <Image source={image} style={styles.fullSizeImage} resizeMode="contain" />
      </SafeAreaView>
    </Modal>
  );
};

export default function Profile() {
  const { currentUser } = useUser();
  const [profileImage, setProfileImage] = useState(require('../../Images/profile_img.jpg'));
  const [fullSizeVisible, setFullSizeVisible] = useState(false);
  const navigation = useNavigation();

  // Update profile image if user has a profile image URL
  useEffect(() => {
    if (currentUser?.img) {
      setProfileImage({ uri: currentUser.img });
    }
  }, [currentUser]);

  const handleImageOptions = async () => {
    Alert.alert(
      'Profile Picture Options',
      'Choose an option',
      [
        {
          text: 'View full size',
          onPress: () => viewFullSize(),
        },
        {
          text: 'Choose from gallery',
          onPress: () => pickImage(),
        },
        {
          text: 'Take a photo',
          onPress: () => takePhoto(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const viewFullSize = () => {
    setFullSizeVisible(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
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
              source={profileImage}
              containerStyle={styles.avatar}
            >
              <Avatar.Accessory size={35} onPress={handleImageOptions} />
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
            
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              value={currentUser?.birthDate ? `${new Date().getFullYear() - new Date(currentUser.birthDate).getFullYear()}` : ''}
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Current Weight</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your current weight"
              value={currentUser?.currentWeight ? `${currentUser.currentWeight} KG` : ''}
              keyboardType="numeric"
            />
          </View>
          <FullSizeImage
            visible={fullSizeVisible}
            image={profileImage}
            onClose={() => setFullSizeVisible(false)}
          />
        </View>
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
  }
});
