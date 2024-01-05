import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Image, Animated, StatusBar } from 'react-native';
import Sidebar from './Sidebar';

const NoteItem = ({ note, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.noteItem}>
        <Text style={styles.noteText}>{note.text}</Text>
    </TouchableOpacity>
);

const NotesScreen = ({ navigation }) => {
    const [notes, setNotes] = useState([{ id: '1', text: 'Sample Note' }]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editText, setEditText] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;

    const addNewNote = () => {
        const newNote = {
            id: Date.now().toString(),
            text: 'New Note'
        };
        setNotes([...notes, newNote]);
    };

    const handleNotePress = (note) => {
        setSelectedNote(note);
        setEditText(note.text);
        setModalVisible(true);
    };

    const handleSave = () => {
        setNotes(notes.map(note => 
            note.id === selectedNote.id ? { ...note, text: editText } : note
        ));
        setModalVisible(false);
    };

    const toggleSidebar = () => {
        const toValue = isSidebarVisible ? 0 : 1;

        Animated.timing(slideAnim, {
            toValue,
            duration: 100,
            useNativeDriver: false,
        }).start(() => {
            setIsSidebarVisible(prev => !prev);
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#E0F0FF" barStyle="dark-content" />
            <FlatList
                data={notes}
                renderItem={({ item }) => <NoteItem note={item} onPress={() => handleNotePress(item)} />}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatList}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            multiline
                            value={editText}
                            onChangeText={setEditText}
                            placeholder="Edit note..."
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.addButton} onPress={addNewNote}>
                <Text>Add Note</Text>
            </TouchableOpacity>

            <Animated.View style={[
                styles.sidebarContainer, 
                { transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] }) }] }
            ]}>
                {isSidebarVisible && <Sidebar navigation={navigation} />}
            </Animated.View>

            <TouchableOpacity style={styles.sidebarButton} onPress={toggleSidebar}>
                <Image source={require('./menu-icon.png')} style={styles.whale} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F0FF',
        paddingTop: StatusBar.currentHeight + 50,
    },
    noteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    noteText: {
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '30%'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        padding: 8,
        width: '100%'
    },
    addButton: {
        backgroundColor: '#72AEEA',
        borderRadius: 20,
        marginTop: 20,
        padding:10,
        alignItems: 'center',
    },
    sidebarButton: {
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#72AEEA',
        position: 'absolute',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginLeft: 10,
        zIndex: 3,
    },
    sidebarContainer: {
        position: 'absolute',
        top: StatusBar.currentHeight,
        bottom: 0,
        left: 0,
        width: '65%',
        backgroundColor: '#fff',
        zIndex: 2,
    },
    whale: {
        width: 30,
        height: 30,
    },
});

export default NotesScreen;
