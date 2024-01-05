import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';

const API_URL = "http://192.168.100.88/ict132/api/v3/index.php";

const NoteItem = ({ note, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.noteItem}>
        <Text style={styles.noteText}>{note.text}</Text>
    </TouchableOpacity>
);

const NotesScreen = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editText, setEditText] = useState('');

    const addNewNote = () => {
        setSelectedNote(null);
        setEditText('');
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const updatedNotes = notes.map(note =>
                note === selectedNote ? { ...note, text: editText } : note
            );

            setNotes(updatedNotes);

            if (!selectedNote) {
                // Creating a new note
                const newNote = {
                    text: editText || 'New Note', // Use editText or a default value
                };

                const response = await fetch(`${API_URL}/notes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ note_text: newNote.text }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Assuming the server responds with the created note, update the local state
                const createdNote = await response.json();
                setNotes([...updatedNotes, createdNote]);
            }

            setModalVisible(false);
        } catch (error) {
            console.error('Error handling save:', error.message);
        }
    };

    const handleNotePress = (note) => {
        setSelectedNote(note);
        setEditText(note.text);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                renderItem={({ item }) => <NoteItem note={item} onPress={() => handleNotePress(item)} />}
                keyExtractor={(item, index) => index.toString()} // Using index as the key for simplicity
                numColumns={2}
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

            <View style={styles.modalView}>
                <TouchableOpacity style={styles.addButton} onPress={addNewNote}>
                    <Text>Add Note</Text>
                </TouchableOpacity>
            </View>
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
    addButton: {
        backgroundColor: 'green',
        padding: 10,
        margin: 10,
        alignItems: 'center',
    },
});

export default NotesScreen;
