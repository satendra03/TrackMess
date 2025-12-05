import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useMess } from '../context/MessContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
    const { settings, updateSettings, resetAllData, resetAttendance } = useMess();
    const [messName, setMessName] = useState('');
    const [dailyCost, setDailyCost] = useState('');

    useEffect(() => {
        if (settings) {
            setMessName(settings.messName);
            setDailyCost(settings.dailyFullCost.toString());
        }
    }, [settings]);

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
            ...settings,
            messName: messName.trim(),
            dailyFullCost: cost,
        });
        Alert.alert('Success', 'Settings saved successfully.');
    };

    const handleClearCurrentMonth = () => {
        Alert.alert(
            "Clear Attendance",
            "Are you sure you want to clear all attendance records? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear", style: "destructive", onPress: async () => {
                        await resetAttendance();
                        Alert.alert("Cleared", "All attendance data has been cleared.");
                    }
                }
            ]
        );
    };

    const handleResetApp = () => {
        Alert.alert(
            "Reset App",
            "Are you sure you want to clear ALL data including settings? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        await resetAllData();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mess Details</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mess Name</Text>
                        <TextInput
                            style={styles.input}
                            value={messName}
                            onChangeText={setMessName}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Daily Full Day Cost (₹)</Text>
                        <TextInput
                            style={styles.input}
                            value={dailyCost}
                            onChangeText={setDailyCost}
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>

                    <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleClearCurrentMonth}>
                        <Text style={styles.dangerButtonText}>Clear All Attendance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleResetApp}>
                        <Text style={styles.dangerButtonText}>Reset App (Clear All Data)</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.version}>v1.1.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    actionButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dangerButton: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF0F0',
    },
    dangerButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});

export default SettingsScreen;
