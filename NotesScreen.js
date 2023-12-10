import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import Sidebar from './Sidebar';

const NoteItem = ({ note, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.noteItem}>
        <Text style={styles.noteText}>{note.text}</Text>
    </TouchableOpacity>
);

const NotesScreen = () => {
    const [notes, setNotes] = useState([{ id: '1', text: 'Sample Note' }]); // Sample data
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editText, setEditText] = useState('');

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

    // Add a function to create new notes if needed

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                renderItem={({ item }) => <NoteItem note={item} onPress={() => handleNotePress(item)} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // For a grid layout
            />

            <Modal
                animationType="slide"
                transparent={false}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        value={editText}
                        onChangeText={setEditText}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Add a button or method to create new notes */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    noteItem: {
        flex: 1,
        margin: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteText: {
        fontSize: 16,
        color: 'black',
    },
    modalView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    textInput: {
        width: '100%',
        minHeight: 200,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
    },
    saveButton: {
        backgroundColor: 'lightblue',
        padding: 10,
        marginTop: 20,
    },
});

export default NotesScreen;
