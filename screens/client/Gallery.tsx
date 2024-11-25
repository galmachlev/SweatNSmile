import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Alert, Dimensions, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GalleryImage {
  uri: string | null;
  cloudinaryUrl?: string;
}

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 20) / numColumns;

const GalleryScreen: React.FC = () => {
  const { currentUser } = useUser();
  const { updateUserDetails } = useUser();  
  const defaultImage = require('../../Images/gallery_img.png');
  const [fullSizeImageUri, setFullSizeImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


  // קריאת תמונות מ-AsyncStorage
  const loadImages = async () => {
    const userId = currentUser ? currentUser.email : 'defaultUserEmail'; // משתמש באימייל או כתובת ברירת מחדל
    try {
      const savedImages = await AsyncStorage.getItem(`galleryImages_${userId}`);
      if (savedImages !== null) {
        return JSON.parse(savedImages);
      }
    } catch (error) {
      console.error('Error loading images', error);
    }
    return Array(50).fill({ uri: Image.resolveAssetSource(defaultImage).uri });
  };

  const [galleryImg, setGalleryImg] = useState<GalleryImage[]>([]);

-  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Camera Permission', 'Permission to access the camera is required!');
      }
      if (mediaLibraryStatus !== 'granted') {
        Alert.alert('Library Permission', 'Permission to access the photo library is required!');
      }
    };

    requestPermissions();
    loadImages().then(images => setGalleryImg(images));
  }, [currentUser]); // הוסף את currentUser כתלות

  const saveImages = async (images: GalleryImage[]) => {
    const userId = currentUser ? currentUser.email : 'defaultUserEmail'; // משתמש באימייל או כתובת ברירת מחדל
    try {
      await AsyncStorage.setItem(`galleryImages_${userId}`, JSON.stringify(images));
    } catch (error) {
      console.error('Error saving images', error);
    }
  };

  const pickImage = async (index: number) => {
    Alert.alert(
      'Choose Image Source',
      'Do you want to take a new photo or pick from gallery?',
      [
        {
          text: 'Take a new photo',
          onPress: () => takePhoto(index),
        },
        {
          text: 'Upload from Gallery',
          onPress: () => pickFromGallery(index),
        },
        {
          text: 'View Full Size',
          onPress: () => viewFullSize(galleryImg[index].uri),
        },
        {
          text: 'Delete Image',
          onPress: () => deleteImage(index),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },

      ],
      { cancelable: true }
    );
  };

  const takePhoto = async (index: number) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImageResult(result, index);
  };

  const pickFromGallery = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImageResult(result, index);
  };

  const handleImageResult = async (result: ImagePicker.ImagePickerResult, index: number) => {
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
      let newGalleryImg = [...galleryImg];
      newGalleryImg[index] = { uri: imageUri, cloudinaryUrl };
      setGalleryImg(newGalleryImg);
      saveImages(newGalleryImg); // שמירה של התמונות ב-AsyncStorage
    }
  };

  const uploadImageToCloudinary = async (imageUri: string) => {
    const cloudName = 'duiifdn9s';
    const uploadPreset = 'GALMACH';
    const userId = currentUser ? currentUser.email : 'defaultUserEmail'; // משתמש באימייל

    const formData = new FormData();
    formData.append('file', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' });
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `user_images/${userId}`);
    formData.append('resource_type', 'image');

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      await updateUserDetails (currentUser?.email, { ...currentUser, gallery:[...currentUser?.gallery, response.data.secure_url] });
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

  const deleteImage = (index: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const newGalleryImg = [...galleryImg];
            newGalleryImg.splice(index, 1); // Remove the image
            setGalleryImg(newGalleryImg);
            saveImages(newGalleryImg); // Save updated images
          },
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={galleryImg}
        numColumns={numColumns}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.gridItem} onPress={() => pickImage(index)}>
            {item.uri !== null ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
                <View style={styles.numberOverlay}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Text>{index + 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

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

    </View>
  );
};

// סטיילים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  flatList: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: itemSize,
    height: itemSize,
    margin: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  numberOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#9AB28B',
    borderRadius: 15,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#fff',
    fontSize: 12,
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 1000,
    padding: 10,
    zIndex: 1
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

});

export default GalleryScreen;
