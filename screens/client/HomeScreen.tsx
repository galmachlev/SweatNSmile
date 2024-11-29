import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView, Modal } from 'react-native';
import DailyGeminiChat from './DailyGeminiChat';
import { useUser } from '../../context/UserContext';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser, profileImage } = useUser();
  console.log(currentUser);
  const userName = currentUser ? `${currentUser.firstName}` : 'User';
  const startingWeight = currentUser?.startWeight || 0;
  const currentWeight = currentUser?.currentWeight || 0;
  const targetWeight = currentUser?.goalWeight || 0;
  const profile_img = currentUser?.profileImageUrl;
  const targetDate = new Date(currentUser?.targetDate || new Date());

  const [modalVisible, setModalVisible] = useState(false); // מצב למודל
  const [hasShownReminder, setHasShownReminder] = useState(false); // מצב לוודא שהמודל יוצג פעם אחת
  
  // Calculate weight progress percentage
  const totalWeightToLose = startingWeight - targetWeight;
  const weightLost = startingWeight - currentWeight;
  const progress = Math.min(Math.max((weightLost / totalWeightToLose) * 100, 0), 100);

  // Check if the target date has passed and if the user has not completed 100% progress
  useEffect(() => {
    const currentDate = new Date();
    if (currentDate > targetDate && progress < 100 && !hasShownReminder) {
      console.log('Target date passed and progress < 100%');
      setModalVisible(true); // מציג את המודל
      setHasShownReminder(true); // מכניס את המשתמש למצב שכבר הוצג לו המודל
    }
  }, [targetDate, progress, hasShownReminder]);

  // סגירת המודל
  const handleCloseModal = () => {
    setModalVisible(false); // נסגור את המודל לאחר לחיצה על OK
  };

  const handleNavigation = (componentName: string) => {
    navigation.navigate(componentName);
  };

  // PDF link "Open Training Progaram"
  const openPDF = () => {
    const pdfUrl = 'https://www.spinplus.co.il/wp-content/uploads/2019/03/%D7%AA%D7%9B%D7%A0%D7%99%D7%AA-%D7%90%D7%99%D7%9E%D7%95%D7%9F-%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D.pdf';
    Linking.openURL(pdfUrl);
  };

  return (
    <ScrollView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
        <Image source={profile_img ? { uri: profile_img } : require('../../Images/profile_img.jpg')} style={styles.profileImage} />
        <Text style={styles.greeting}>Hello, {userName}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressBarTextLeft}>Start: {startingWeight} kg</Text>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          <Text style={styles.progressBarTextRight}>Goal: {targetWeight} kg</Text>
        </View>

        <View style={styles.details}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.textbelow}>{progress.toFixed(0)}% completed</Text>
            <Text style={styles.textbelow}>
              Target Date: {targetDate instanceof Date ? targetDate.toLocaleDateString() : new Date().toLocaleDateString()}
            </Text>
            </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.GalleryButton]} onPress={() => handleNavigation('Gallery')}>
            <Image source={require('../../Images/GalleryIcon.png')} style={styles.iconImage} />
            <Text style={styles.btnText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.WeightButton]} onPress={() => handleNavigation('DailyDashboard')}>
            <Image source={require('../../Images/WeightIcon.png')} style={styles.iconImage} />
            <Text style={styles.btnText}>Track</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.MenuButton]} onPress={() => handleNavigation('AllMenusTable')}>
            <Image source={require('../../Images/MenuIcon.png')} style={styles.iconImage} />
            <Text style={styles.btnText}>Menus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.MoreButton]} onPress={() => handleNavigation('WeeklyChallenge')}>
            <Image source={require('../../Images/TargetIcon.png')} style={styles.iconImage} />
            <Text style={styles.btnText}>{'Challenge'}</Text>
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

        {/* Modal for target date reminder */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Your target date has passed, but you haven't completed your goal yet.
              </Text>
              <Text style={styles.modalTextBold}>
                Please set a new target date.
              </Text>
              <Text style={styles.modalText}>
                To do this, go to your profile and update your target date.
              </Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
};

// סטיילים
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
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
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9AB28B',
    height: 45,
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    backgroundColor: '#3E6613',
    height: '100%',
  },
  progressBarTextLeft: {
    fontSize: 14,
    color: '#FFFFFF',
    position: 'absolute',
    left: 10,
    top: 13,
    zIndex: 1,
  },
  progressBarTextRight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    position: 'absolute',
    right: 10,
    top: 13,
    zIndex: 1,
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
  btnText: {
    fontSize: 13,
    paddingTop: 5,
    fontWeight: '500',
  },
  iconImage: {
    width: 45,
    height: 45,
    marginBottom: 7,
  },
  GalleryButton: {
    backgroundColor: '#FFCE76',
    paddingVertical: 35,
  },
  WeightButton: {
    backgroundColor: '#FDE598',
    paddingVertical: 35,
  },
  MenuButton: {
    backgroundColor: '#F8D675',
    paddingVertical: 35,
  },
  MoreButton: {
    backgroundColor: '#E8A54B',
    paddingVertical: 35,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalTextBold: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#3E6613',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

});

export default HomeScreen;
