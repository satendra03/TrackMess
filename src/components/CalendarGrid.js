import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from '../utils/dateUtils';

const STATUS_COLORS = {
    absent: '#E0E0E0', // Gray
    half: '#FFD700',   // Gold/Yellow
    full: '#4CD964',   // Green
    default: '#FFFFFF',
};

const STATUS_LABELS = {
    absent: 'A',
    half: 'H',
    full: 'F',
};

const CalendarGrid = ({ year, month, attendanceData, onDayPress }) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year); // 0 = Sunday, 1 = Monday, etc.

    const days = [];

    // Empty slots for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
        days.push({ key: `empty-${i}`, empty: true });
    }

    // Actual days
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const currentDay = today.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = formatDate(year, month, d);
        const status = attendanceData[dateStr]?.status;
        days.push({
            key: dateStr,
            day: d,
            status: status,
            isToday: isCurrentMonth && d === currentDay,
            dateStr: dateStr,
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Text key={day} style={styles.headerText}>{day}</Text>
                ))}
            </View>
            <View style={styles.grid}>
                {days.map((item) => {
                    if (item.empty) {
                        return <View key={item.key} style={styles.cell} />;
                    }

                    const backgroundColor = item.status ? STATUS_COLORS[item.status] : STATUS_COLORS.default;

                    return (
                        <TouchableOpacity
                            key={item.key}
                            style={[
                                styles.cell,
                                { backgroundColor },
                                item.isToday && styles.todayCell
                            ]}
                            onPress={() => onDayPress(item.dateStr, item.status)}
                        >
                            <Text style={styles.dayText}>{item.day}</Text>
                            {item.status && (
                                <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 7; // 40 for padding

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        color: '#666',
        width: CELL_SIZE,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#eee',
    },
    todayCell: {
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    dayText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    statusText: {
        fontSize: 10,
        color: '#555',
        marginTop: 2,
        fontWeight: 'bold',
    }
});

export default CalendarGrid;
