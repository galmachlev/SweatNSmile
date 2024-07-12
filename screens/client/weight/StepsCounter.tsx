import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { Pedometer } from 'expo-sensors';

interface HourlyStep {
  hour: number;
  steps: number;
}

const HealthGraph = () => {
  const [showModal, setShowModal] = useState(false);
  const [hourlySteps, setHourlySteps] = useState<HourlyStep[]>([]);
  const [summaryData, setSummaryData] = useState({
    lastHour: 0,
    today: 0,
    last24Hours: 0,
  });
  const [selectedHour, setSelectedHour] = useState<HourlyStep | null>(null);

  const barWidth = 25;
  const barSpacing = 20;
  const graphHeight = 190;
  const graphWidth = (barWidth + barSpacing) * 5; // Changed to 5 columns

  const barColors = ['#FFCE76', '#E8A54B', '#FDE598', '#FFFA63', '#E8A54B'];

  useEffect(() => {
    const fetchData = async () => {
      const end = new Date();
      const startLast24Hours = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      const startSince00Today = new Date(end);
      startSince00Today.setHours(0, 0, 0, 0);

      const hourlyData: HourlyStep[] = [];
      for (let i = 4; i >= 0; i--) { // Changed to fetch data for 5 hours
        const hourStart = new Date(end.getTime() - i * 60 * 60 * 1000);
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
        const result = await Pedometer.getStepCountAsync(hourStart, hourEnd);
        hourlyData.push({ hour: hourStart.getHours(), steps: result.steps });
      }
      setHourlySteps(hourlyData);

      const past24HoursResult = await Pedometer.getStepCountAsync(startLast24Hours, end);
      const todayResult = await Pedometer.getStepCountAsync(startSince00Today, end);
      const lastHourResult = await Pedometer.getStepCountAsync(new Date(end.getTime() - 60 * 60 * 1000), end);

      setSummaryData({
        lastHour: lastHourResult.steps,
        today: todayResult.steps,
        last24Hours: past24HoursResult.steps,
      });
    };

    fetchData();
  }, []);

  const maxSteps = Math.max(...hourlySteps.map(item => item.steps));

  const renderBars = () => {
    return hourlySteps.map((item, index) => (
      <React.Fragment key={index}>
        <Rect
          x={index * (barWidth + barSpacing) + barSpacing / 2}
          y={graphHeight - (item.steps / maxSteps) * graphHeight}
          width={barWidth}
          height={(item.steps / maxSteps) * graphHeight}
          fill={barColors[index % barColors.length]}
          onPress={() => setSelectedHour(item)}
        />
        <SvgText
          x={index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2}
          y={graphHeight + 15}
          fontSize="13"
          fill="#333"
          textAnchor="middle"
          origin={`${index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2}, ${graphHeight + 15}`}
        >
          {item.hour}
        </SvgText>
      </React.Fragment>
    ));
  };

  return (
    <View style={styles.container}>
      <Svg height={graphHeight + 40} width={graphWidth}>
        <Line x1="0" y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="#ccc" strokeWidth="1" />
        {renderBars()}
      </Svg>
      {selectedHour && (
        <Text style={styles.selectedHourText}>
          {`${selectedHour.hour}:00 - ${selectedHour.steps} steps`}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Show Summary</Text>
      </TouchableOpacity>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Step Count Summary</Text>
            <Text style={styles.modalText}>{`Last Hour: ${summaryData.lastHour} steps`}</Text>
            <Text style={styles.modalText}>{`Today: ${summaryData.today} steps`}</Text>
            <Text style={styles.modalText}>{`Last 24 Hours: ${summaryData.last24Hours} steps`}</Text>
            <Button title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: 300,
    height: 340,
    marginVertical: 20, // Added margin for spacing
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 10,
  },
  button: {
    marginTop: 15,
    backgroundColor: '#3b5998',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  selectedHourText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6c757d',
  },
});

export default HealthGraph;
