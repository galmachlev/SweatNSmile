import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import DailyGeminiChat from './DailyGeminiChat'; // Adjust the path as per your project structure
import { useUser } from '../../context/UserContext';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../stack/Register';

const Stack = createStackNavigator<RootStackParamList>();

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser } = useUser();  // Use context directly
  const { profileImage } = useUser();

  console.log('currentUser ==> ', currentUser);

  const userName = currentUser?.firstName;
  const startDate = new Date('2024-02-07'); // Example start date
  const currentDate = new Date(); // Current date
  const estimatedDate = new Date('2024-09-08'); // Example target date

  // Calculate progress in percentage based on start and current date
  const totalDays = Math.ceil((estimatedDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const passedDays = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  // Fetch startingWeight and targetWeight from currentUser
  const startingWeight = currentUser?.currentWeight || 0;
  const targetWeight = currentUser?.goalWeight || 0;

  // Calculate progress in percentage based on starting and target weight
  const totalWeightLoss = startingWeight - targetWeight;
  const currentWeight = currentUser?.currentWeight || 0; // Replace this with the actual current weight if available
  const weightLost = startingWeight - currentWeight;

  // Calculate progress percentage
  let progress = (weightLost / totalWeightLoss) * 100;

  // Limit progress to 100% if current weight is at or below target weight
  if (currentWeight <= targetWeight) {
      progress = 100;
  } else {
      progress = Math.max(progress, 0); // Ensure progress does not go below 0%
  }

  // Ensure progress does not exceed 100%
  progress = Math.min(progress, 100);

  const handleNavigation = (componentName: string) => {
    navigation.navigate(componentName);
  };

  const openPDF = () => {
    const pdfUrl = 'https://www.spinplus.co.il/wp-content/uploads/2019/03/%D7%AA%D7%9B%D7%A0%D7%99%D7%AA-%D7%90%D7%99%D7%9E%D7%95%D7%9F-%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D.pdf'; // Replace with the actual PDF URL
    Linking.openURL(pdfUrl);
  };

  useEffect(() => {
    console.log("Profile image updated in HomeScreen:", profileImage);
  }, [profileImage]); // Image will auto-update when it changes

  return (
    <ScrollView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={require('../../Images/profile_img.jpg')} style={styles.profileImage} /> // Placeholder image
          )}
          <Text style={styles.greeting}>Hello, {userName}</Text>
        </View>

        <View style={styles.progressBarContainer}>
          {/* Show the starting weight and target weight */}
          <Text style={styles.progressBarTextLeft}>Starting Weight: {startingWeight} kg</Text>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]}></View>
          <Text style={styles.progressBarTextRight}>Target Weight: {targetWeight} kg</Text>
        </View>

        <View style={styles.details}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.textbelow}>{progress.toFixed(0)}% completed</Text>
            <Text style={styles.textbelow}>Target Date: {estimatedDate.toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.GalleryButton]} onPress={() => handleNavigation('Gallery')}>
            <Image source={require('../../Images/GalleryIcon.png')} style={styles.iconImage} />
            <Text>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.WeightButton]} onPress={() => handleNavigation('DailyDashboard')}>
            <Image source={require('../../Images/WeightIcon.png')} style={styles.iconImage} />
            <Text>Track</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.MenuButton]} onPress={() => handleNavigation('DailyMenu')}>
            <Image source={require('../../Images/MenuIcon.png')} style={styles.iconImage} />
            <Text>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.MoreButton]} onPress={() => handleNavigation('More')}>
            <Image source={require('../../Images/MoreIcon.png')} style={styles.iconImage} />
            <Text>More</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chatContainer}>
          <View style={styles.chatBox}>
            <DailyGeminiChat />
          </View>
        </View>

        <TouchableOpacity style={styles.pdfButton} onPress={openPDF}>
          <Text style={styles.pdfButtonText}>Open Training Program</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 150,
    borderColor: '#9AB28B',
    borderWidth: 3,
  },
  greeting: {
    fontSize: 20,
    marginTop: 25,
    marginBottom: 30,
  },
  details: {
    marginTop: 20,
  },
  textbelow: {
    fontSize: 13,
    paddingHorizontal: 8,
    marginTop: -15,
    marginBottom: 30,
  },
  progressBarContainer: {
    backgroundColor: '#9AB28B',
    height: 45,
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
  },
  progressBarFill: {
    backgroundColor: '#3E6613',
  },
  progressBarTextLeft: {
    fontSize: 14,
    color: '#FFFFFF',
    position: 'absolute',
    left: 20,
    top: 13,
    zIndex: 1,
  },
  progressBarTextRight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    position: 'absolute',
    right: 20,
    top: 13,
    zIndex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: '#F0F0F0',
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '111%',
    marginLeft: -20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  iconImage: {
    width: 45,
    height: 45,
    marginBottom: 7,
  },
  GalleryButton: {
    backgroundColor: '#FFCE76',
    paddingVertical: 35,
    paddingHorizontal: 23,
  },
  WeightButton: {
    backgroundColor: '#FDE598',
    paddingVertical: 35,
    paddingHorizontal: 23,
  },
  MenuButton: {
    backgroundColor: '#F8D675',
    paddingVertical: 35,
    paddingHorizontal: 23,
  },
  MoreButton: {
    backgroundColor: '#E8A54B',
    paddingVertical: 15,
    paddingHorizontal: 1,
  },
  chatContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
  },
  chatBox: {
    minHeight: 140,
  },
  pdfButton: {
    backgroundColor: '#CB783B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  pdfButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default HomeScreen;
