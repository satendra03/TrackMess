import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDaysInMonth, formatDate } from '../utils/dateUtils';

const SummaryCard = ({ year, month, attendanceData, dailyFullCost }) => {
    const daysInMonth = getDaysInMonth(month, year);

    let fullDays = 0;
    let halfDays = 0;
    let absentDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = formatDate(year, month, d);
        const status = attendanceData[dateStr]?.status;

        if (status === 'full') fullDays++;
        else if (status === 'half') halfDays++;
        else if (status === 'absent') absentDays++;
    }

    const totalMeals = fullDays + (halfDays * 0.5);
    const totalCost = (fullDays * dailyFullCost) + (halfDays * (dailyFullCost / 2));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Monthly Summary</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Full Days (2 meals):</Text>
                <Text style={styles.value}>{fullDays}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Half Days (1 meal):</Text>
                <Text style={styles.value}>{halfDays}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Absent Days:</Text>
                <Text style={styles.value}>{absentDays}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <Text style={styles.label}>Total Full-Day Equivalents:</Text>
                <Text style={styles.value}>{totalMeals}</Text>
            </View>

            <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount Due:</Text>
                <Text style={styles.totalValue}>₹{totalCost.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },
    totalRow: {
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
});

export default SummaryCard;
