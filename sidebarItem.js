// SidebarItem.js
import React, {useState} from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';

const SidebarItem = ({ onPress, isPressed, icon, label }) => {
    const [backgroundColor, setBackgroundColor] = useState('#EEF3F8');
    const [textColor, setTextColor] = useState('Black')
    const handlePressIn = () => {
      setBackgroundColor('#698FB4');
      setTextColor('#FFFFFF')
    };
  
    const handlePressOut = () => {
      setBackgroundColor('#EEF3F8');
      setTextColor('black')
      
    };
  
    const handlePress = () => {
      onPress(!isPressed);
    };
  
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.itemContainer, { backgroundColor }]}>
          <Image source={icon} style={styles.whale} />
          <Text style={[styles.sidebarItem, {color: textColor}]}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };
      
      

const styles = StyleSheet.create({
  // Styles for SidebarItem
  sidebarItem: {
    fontSize: 16,
    marginStart: 10, // Adjust as needed
    textAlign: 'left',
  },
  sidebarItemPressed: {
    color: '#FFFFFF', // Color when pressed
  },
  itemContainer: {
    margin: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    
  },
  itemPressed: {
    backgroundColor: '#698FB4', // Background color when pressed
    borderRadius: 20,
  },
  whale: {
    width: 30, // Adjust as needed
    height: 30, // Adjust as needed
    marginRight: 10, // Adjust as needed
  },
});



export default SidebarItem;
