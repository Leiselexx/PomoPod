import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SidebarItem from './sidebarItem'; // Adjust the path based on your file structure



const Sidebar = ({ navigation }) => {
  const [isPressedHome, setIsPressedHome] = useState(false);
  const [isPressedLogin, setIsPressedLogin] = useState(false);

  const handleSidebarItemPress = (screenName) => {
    if (screenName === 'HomeScreen') {
      setIsPressedHome(true);
      setIsPressedLogin(false); // Reset the other button
    } else if (screenName === 'LoginScreen') {
      setIsPressedHome(false); // Reset the other button
      setIsPressedLogin(true);
    }

    navigation.navigate(screenName);
  };

  

  return (
    <View style={styles.sidebar}>
      <SidebarItem
        onPress={() => handleSidebarItemPress('HomeScreen')}
        isPressed={isPressedHome}
        icon={require('./menu-icon.png')}
        label="Study Timer"
      />

      <SidebarItem
        onPress={() => handleSidebarItemPress('LoginScreen')}
        isPressed={isPressedLogin}
        icon={require('./whale.png')}
        label="Log Out"
      />

      {/* Add more SidebarItems as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    padding: 40,
    backgroundColor: '#EEF3F8',
  },
  
});

export default Sidebar;
