import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


interface GalleryImage {
  uri: string | null;
}

// Calculate the item size based on the screen width
const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 20) / numColumns; // 20 is the total padding (10 on each side)

const GalleryScreen: React.FC = () => {
  const defaultImage = require('../../Images/gallery_img.png'); // Define your default image here
  const [galleryImg, setGalleryImg] = useState<GalleryImage[]>(
    Array(50).fill({ uri: Image.resolveAssetSource(defaultImage).uri }) // Initialize 50 images with the default image URI
  );

  const pickImage = async (index: number) => {
    Alert.alert(
      'Choose Image Source',
      'Do you want to take a new photo or pick from gallery?',
      [
        {
          text: 'Camera',
          onPress: () => takePhoto(index),
        },
        {
          text: 'Gallery',
          onPress: () => pickFromGallery(index),
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

  const handleImageResult = (result: ImagePicker.ImagePickerResult, index: number) => {
    if (!result.canceled && result.assets.length > 0) {
      let newGalleryImg = [...galleryImg];
      newGalleryImg[index] = { uri: result.assets[0].uri };
      setGalleryImg(newGalleryImg);
    }
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
    </View>
  );
};

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
    borderRadius: 15, // Half of width and height to make it circular
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default GalleryScreen;
