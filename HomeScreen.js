import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Animated, TextInput, FlatList, Modal, Button } from 'react-native';
import Sidebar from './Sidebar';

const HomeScreen = ({ navigation }) => {
  const [totalSeconds, setTotalSeconds] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [workDuration, setWorkDuration] = useState(1500);
  const [breakDuration, setBreakDuration] = useState(300);

  const [tempWorkDuration, setTempWorkDuration] = useState(25);
  const [tempBreakDuration, setTempBreakDuration] = useState(5);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer;
    if (isTimerRunning && totalSeconds > 0) {
      timer = setInterval(() => setTotalSeconds(prev => prev - 1), 1000);
    } else if (totalSeconds <= 0) {
      clearInterval(timer);
      setIsWorkSession(!isWorkSession);
      setTotalSeconds(isWorkSession ? breakDuration : workDuration);
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, totalSeconds, isWorkSession, workDuration, breakDuration]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  const saveNewDurations = () => {
    setWorkDuration(tempWorkDuration * 60);
    setBreakDuration(tempBreakDuration * 60);
    setEditModalVisible(false);
  };

  const handleTimerPress = () => {
    setTempWorkDuration(workDuration / 60);
    setTempBreakDuration(breakDuration / 60);
    toggleEditModal();
  };

  const handleStartButton = () => setIsTimerRunning(true);
  const handlePauseButton = () => setIsTimerRunning(false);
  const handleStopButton = () => {
    setIsTimerRunning(false);
    setTotalSeconds(workDuration);
    setIsWorkSession(true);
  };

  const handleAddTaskButton = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
    setModalVisible(false);
  };

  const handleCheckButton = (taskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteButton = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsSidebarVisible(!isSidebarVisible));
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E0F0FF" barStyle="dark-content" />

      <View style={styles.mainContent}>
        <Text style={styles.PomodoroText}>Pomodoro</Text>
        <TouchableOpacity style={styles.timeContainer} onPress={handleTimerPress}>
          <Text style={styles.timer}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
        </TouchableOpacity>

        <View style={styles.timeButtons}>
          <TouchableOpacity style={styles.Button} onPress={handleStartButton}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={handlePauseButton}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={handleStopButton}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskMainContainer}>
          <View style={styles.TaskView}>
            <Text style={styles.TaskMainTitle}>Tasks</Text>
            <TouchableOpacity style={styles.AddButton} onPress={toggleModal}>
              <Image source={require('./whale.png')} style={styles.AddIcon} />
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.flatList}
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text style={[styles.taskText, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>{item.text}</Text>
                <TouchableOpacity onPress={() => handleCheckButton(item.id)}>
                  <Text>{item.completed ? 'Uncheck' : 'Check'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteButton(item.id)}>
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} value={newTask} onChangeText={setNewTask} placeholder="Enter task..." />
            <TouchableOpacity style={styles.AddButton} onPress={handleAddTaskButton}>
              <Image source={require('./whale.png')} style={styles.AddIcon} />
            </TouchableOpacity>
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
 
      {/*Animation for SideBar*/}        
      <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 2], outputRange: [-300, 0] }) }] }]}>
    {   isSidebarVisible && <Sidebar navigation={navigation} />}
      </Animated.View>

      <TouchableOpacity style={styles.sidebarButton} onPress={toggleSidebar}>
        <Image source={require('./menu-icon.png')} style={styles.whale} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={toggleEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={tempWorkDuration.toString()}
              onChangeText={(text) => setTempWorkDuration(Number(text))}
              keyboardType="numeric"
              placeholder="Work Duration (minutes)"
            />
            <TextInput
              style={styles.input}
              value={tempBreakDuration.toString()}
              onChangeText={(text) => setTempBreakDuration(Number(text))}
              keyboardType="numeric"
              placeholder="Break Duration (minutes)"
            />
            <Button title="Save" onPress={saveNewDurations} />
            <Button title="Close" onPress={toggleEditModal} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F0FF',
    paddingTop: StatusBar.currentHeight,
  },
  mainContent: {
    flex: 1,
    marginTop: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  PomodoroText:{
    fontSize: 25,
    color:'#486B9A',
    marginBottom: 20
    
  },
  timer: {
    fontSize: 55,
    marginBottom: 16,
  },
  Button: {
    backgroundColor: '#72AEEA',
    borderRadius: 20,
    marginTop: 20,
    width: 100,
    alignItems: 'center',
    padding: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  timeContainer: {
    display: 'flex',
    width: 200,
    height: 200,
    borderWidth: 3,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: '#72AEEA',
    marginBottom: 30
  },
  sidebarButton: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#72AEEA',
    position: 'absolute',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    zIndex: 1,
  },
  sidebarContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    bottom: 0,
    right: 0,
    width: '70%', // Adjusted width to match the Sidebar width
  },
  taskMainContainer: {
    margin: 10,
    width: '70%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'left',
    justifyContent: 'flex-start',
    flex: 1
  },
  TaskMainTitle: {
    fontSize: 16,
    
  },
  TaskView:{
    borderBottomWidth: 1,
    borderColor: 'blue',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  AddIcon:{
    borderRadius:5,
    width: 30,
    height: 30
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 8,
    width: '100%'
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  taskText: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    width: '100%',
    marginBottom: '10%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: -300,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%'
    
  },
  
  
});

export default HomeScreen;
