import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMess } from '../context/MessContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SetupScreen = ({ navigation }) => {
    const { updateSettings } = useMess();
    const [messName, setMessName] = useState('');
    const [dailyCost, setDailyCost] = useState('');

    const handleSave = async () => {
        if (!messName.trim()) {
            Alert.alert('Error', 'Please enter a Mess Name.');
            return;
        }
        const cost = parseFloat(dailyCost);
        if (isNaN(cost) || cost <= 0) {
            Alert.alert('Error', 'Please enter a valid daily cost greater than 0.');
            return;
        }

        await updateSettings({
            messName: messName.trim(),
            dailyFullCost: cost,
        });

        // Navigation will be handled by App.js based on settings existence, 
        // or we can explicitly navigate if using a stack that allows it.
        // But usually App.js switches the root navigator.
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to TrackMess</Text>
                <Text style={styles.subtitle}>Please enter your mess details to get started.</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mess Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Hostel - 1"
                        placeholderTextColor="#999"
                        value={messName}
                        onChangeText={setMessName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Daily Full Day Cost (₹)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 100"
                        placeholderTextColor="#999"
                        value={dailyCost}
                        onChangeText={setDailyCost}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SetupScreen;
