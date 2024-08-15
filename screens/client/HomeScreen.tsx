import React, {useContext, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList } from 'react-native';
import DailyGeminiChat from './DailyGeminiChat'; // Adjust the path as per your project structure
import { ScrollView } from 'react-native-gesture-handler';
import { useUser } from '../../context/UserContext';
import { User } from '../../types/user';

const HomeScreen: React.FC = () => {
  const {currentUser} = useUser();
  console.log('currentUser ==> ', currentUser)
  const [user, setUser] = useState<User | null>(currentUser)

  const userName = currentUser?.email;
  const startDate = new Date('2024-02-07'); // Example start date, one month ago
  const currentDate = new Date(); // Current date
  const estimatedDate = new Date('2024-09-08'); // Example target date

  // Calculate progress in percentage based on start and current date
  const totalDays = Math.ceil((estimatedDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const passedDays = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  // Calculate progress percentage
  let progress = (passedDays / totalDays) * 100;

  // Limit progress to 100% if current date is beyond or exactly estimatedDate
  if (currentDate >= estimatedDate) {
    progress = 100;
  } else {
    progress = Math.min(progress, 100); // Ensure progress does not exceed 100%
  }

  const handleNavigation = (screenName: string) => {
    console.log(`Navigating to ${screenName}`);
  };

  const openPDF = () => {
    const pdfUrl = 'https://www.spinplus.co.il/wp-content/uploads/2019/03/%D7%AA%D7%9B%D7%A0%D7%99%D7%AA-%D7%90%D7%99%D7%9E%D7%95%D7%9F-%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D.pdf'; // Replace with the actual PDF URL
    Linking.openURL(pdfUrl);
  };

  return (
    <ScrollView style={styles.page}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../Images/profile_img.jpg')} style={styles.profileImage} />
        <Text style={styles.greeting}>Hello, {user? user.email : 'User'}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <Text style={styles.progressBarTextLeft}>Starting weight</Text>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]}></View>
        <Text style={styles.progressBarTextRight}>Target weight</Text>
      </View>

      <View style={styles.details}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.textbelow}>{progress.toFixed(0)}% completed</Text>
          <Text style={[styles.textbelow]}>Target Date: {estimatedDate.toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.GalleryButton]} onPress={() => handleNavigation('Gallery')}>
          <Image source={require('../../Images/GalleryIcon.png')} style={styles.iconImage} />
          <Text>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.WeightButton]} onPress={() => handleNavigation('Weight')}>
          <Image source={require('../../Images/WeightIcon.png')} style={styles.iconImage} />
          <Text>Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.MenuButton]} onPress={() => handleNavigation('Menu')}>
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
        <Text style={styles.pdfButtonText}>Training Program</Text>
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
    marginBottom: 30
  },
  details: {
    marginTop: 20,
  },
  textbelow: {
    fontSize: 13,
    paddingHorizontal: 8,
    marginTop: -15,
    marginBottom: 30
  },
  progressBarContainer: {
    backgroundColor: '#9AB28B',
    height: 45,
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative', // Ensure proper stacking of child elements
  },
  progressBarFill: {
    backgroundColor: '#3E6613', // Green color for passed progress
  },
  progressBarTextLeft: {
    fontSize: 14,
    color: '#FFFFFF',
    position: 'absolute',
    left: 20,
    top: 13,
    zIndex: 1
  },
  progressBarTextRight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    position: 'absolute',
    right: 20,
    top: 13,
    zIndex: 1
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: '#F0F0F0',
    paddingVertical: 30,
    paddingHorizontal: 20, // Added paddingHorizontal to maintain inner content spacing
    width: '111%', // Ensure full width of the parent container
    marginLeft: -20, // Compensate for the main container padding
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
    marginBottom: 7
  },
  GalleryButton: {
    backgroundColor: '#FFCE76',
    paddingVertical: 35,
    paddingHorizontal: 23
  },
  WeightButton: {
    backgroundColor: '#FDE598',
    paddingVertical: 35,
    paddingHorizontal: 23
  },
  MenuButton: {
    backgroundColor: '#F8D675',
    paddingVertical: 35,
    paddingHorizontal: 23
  },
  MoreButton: {
    backgroundColor: '#E8A54B',
    paddingVertical: 15,
    paddingHorizontal: 1
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
    backgroundColor: '#FBF783', // Yellow color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  pdfButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default HomeScreen;
