import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMess } from '../context/MessContext';
import CalendarGrid from '../components/CalendarGrid';
import SummaryCard from '../components/SummaryCard';
import { getMonthName, formatDate } from '../utils/dateUtils';
import { generateMonthlyReport } from '../utils/reportUtils';
import { captureRef } from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
    const { settings, attendance, updateAttendance } = useMess();
    const [currentDate, setCurrentDate] = useState(new Date());
    const viewShotRef = useRef();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDayPress = async (dateStr, currentStatus) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        const selectedDate = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day

        if (selectedDate > today) {
            Alert.alert("Future Date", "You cannot mark attendance for future dates.");
            return;
        }

        // Cycle: Absent -> Half -> Full -> Absent
        let nextStatus = 'absent';
        if (!currentStatus || currentStatus === 'absent') nextStatus = 'half';
        else if (currentStatus === 'half') nextStatus = 'full';
        else if (currentStatus === 'full') nextStatus = 'absent';

        await updateAttendance(dateStr, nextStatus);
    };

    const handleQuickMark = async (status) => {
        const today = new Date();
        const dateStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
        await updateAttendance(dateStr, status);
    };

    const handleShare = async () => {
        try {
            const report = generateMonthlyReport(year, month, attendance, settings.dailyFullCost, settings.messName);

            let uri = null;
            if (viewShotRef.current) {
                uri = await captureRef(viewShotRef, {
                    format: 'png',
                    quality: 0.9,
                    result: 'tmpfile'
                });
            }

            const shareOptions = {
                message: report,
            };

            if (uri) {
                shareOptions.url = uri; // iOS supports url + message
                // For Android, behavior varies. Some apps might only take the image or the text.
                // But providing both is the standard attempt.
            }

            await Share.share(shareOptions);

        } catch (error) {
            Alert.alert('Error', 'Failed to share report: ' + error.message);
        }
    };

    if (!settings) return null; // Should not happen if App.js handles routing

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.messName}>{settings.messName}</Text>
                    <Text style={styles.costInfo}>Full Day: ₹{settings.dailyFullCost}</Text>
                </View>

                {/* Month Navigation */}
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>{getMonthName(month)} {year}</Text>
                    <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                {/* Capture Area: Calendar Only */}
                <View ref={viewShotRef} collapsable={false} style={{ backgroundColor: '#f8f9fa' }}>
                    <CalendarGrid
                        year={year}
                        month={month}
                        attendanceData={attendance}
                        onDayPress={handleDayPress}
                    />
                </View>

                {/* Quick Mark Today */}
                <View style={styles.quickMarkContainer}>
                    <Text style={styles.sectionTitle}>Mark Today's Attendance</Text>
                    <View style={styles.quickButtons}>
                        <TouchableOpacity
                            style={[styles.quickButton, { backgroundColor: '#E0E0E0' }]}
                            onPress={() => handleQuickMark('absent')}
                        >
                            <Text style={styles.quickButtonText}>Absent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickButton, { backgroundColor: '#FFD700' }]}
                            onPress={() => handleQuickMark('half')}
                        >
                            <Text style={styles.quickButtonText}>Half</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickButton, { backgroundColor: '#4CD964' }]}
                            onPress={() => handleQuickMark('full')}
                        >
                            <Text style={[styles.quickButtonText, { color: '#fff' }]}>Full</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Summary */}
                <SummaryCard
                    year={year}
                    month={month}
                    attendanceData={attendance}
                    dailyFullCost={settings.dailyFullCost}
                />

                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Text style={styles.shareButtonText}>Share Monthly Report</Text>
                </TouchableOpacity>

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
        padding: 16,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    messName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    costInfo: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        elevation: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    navButton: {
        padding: 10,
    },
    navButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    quickMarkContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginTop: 20, // Added margin top since it's after the capture view
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    quickButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    quickButtonText: {
        fontWeight: 'bold',
        color: '#333',
    },
    shareButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default HomeScreen;
