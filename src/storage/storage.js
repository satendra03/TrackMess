import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    MESS_SETTINGS: 'mess_settings',
    ATTENDANCE_DATA: 'attendance_data',
};

// Settings: { messName: string, dailyFullCost: number, themeMode: 'light' | 'dark' }
export const saveSettings = async (settings) => {
    try {
        const jsonValue = JSON.stringify(settings);
        await AsyncStorage.setItem(KEYS.MESS_SETTINGS, jsonValue);
    } catch (e) {
        console.error('Error saving settings:', e);
    }
};

export const loadSettings = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.MESS_SETTINGS);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Error loading settings:', e);
        return null;
    }
};

// Attendance Data: { "YYYY-MM-DD": { status: "full" | "half" | "absent" } }
export const saveAttendance = async (attendanceData) => {
    try {
        const jsonValue = JSON.stringify(attendanceData);
        await AsyncStorage.setItem(KEYS.ATTENDANCE_DATA, jsonValue);
    } catch (e) {
        console.error('Error saving attendance:', e);
    }
};

export const loadAttendance = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.ATTENDANCE_DATA);
        return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
        console.error('Error loading attendance:', e);
        return {};
    }
};

export const clearAllData = async () => {
    try {
        await AsyncStorage.multiRemove([KEYS.MESS_SETTINGS, KEYS.ATTENDANCE_DATA]);
    } catch (e) {
        console.error('Error clearing data:', e);
    }
};

export const clearAttendanceData = async () => {
    try {
        await AsyncStorage.removeItem(KEYS.ATTENDANCE_DATA);
    } catch (e) {
        console.error('Error clearing attendance data:', e);
    }
}
