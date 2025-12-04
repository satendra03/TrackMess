import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { loadSettings, saveSettings, loadAttendance, saveAttendance, clearAllData, clearAttendanceData } from '../storage/storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { formatDate } from '../utils/dateUtils';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const MessContext = createContext();

export const useMess = () => useContext(MessContext);

export const MessProvider = ({ children }) => {
    const [settings, setSettings] = useState(null); // { messName, dailyFullCost }
    const [attendance, setAttendance] = useState({}); // { "YYYY-MM-DD": { status } }
    const [loading, setLoading] = useState(true);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        requestNotificationPermissions();
        scheduleDailyNotification();
        loadData();

        return () => {
            if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
            if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const loadData = async () => {
        console.log('MessContext: Starting loadData...');
        setLoading(true);

        const timeoutId = setTimeout(() => {
            console.warn('MessContext: loadData timed out!');
            setLoading(false);
        }, 5000);

        try {
            const loadedSettings = await loadSettings();
            const loadedAttendance = await loadAttendance();

            setSettings(loadedSettings);

            // Auto-mark logic
            const updatedAttendance = await autoFillAttendance(loadedAttendance);
            setAttendance(updatedAttendance);

        } catch (e) {
            console.error('MessContext: Error in loadData:', e);
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const autoFillAttendance = async (currentAttendance) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        // Start from the 1st of the current month
        const startDate = new Date(currentYear, currentMonth, 1);

        let newAttendance = { ...currentAttendance };
        let hasChanges = false;

        // Iterate from start of month until yesterday
        for (let d = new Date(startDate); d < today; d.setDate(d.getDate() + 1)) {
            // Stop if we reach today (handled separately below)
            if (d.getDate() === currentDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear) break;

            const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
            if (!newAttendance[dateStr]) {
                newAttendance[dateStr] = { status: 'full' };
                hasChanges = true;
                console.log(`Auto-marked ${dateStr} as Full`);
            }
        }

        // Check Today: if it's past 9 PM (21:00) and not marked, mark as full
        if (today.getHours() >= 21) {
            const todayStr = formatDate(currentYear, currentMonth, currentDay);
            if (!newAttendance[todayStr]) {
                newAttendance[todayStr] = { status: 'full' };
                hasChanges = true;
                console.log(`Auto-marked Today (${todayStr}) as Full (Time > 9PM)`);
            }
        }

        if (hasChanges) {
            await saveAttendance(newAttendance);
        }
        return newAttendance;
    };

    const scheduleDailyNotification = async () => {
        try {
            // Cancel all existing to avoid duplicates
            await Notifications.cancelAllScheduledNotificationsAsync();

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Mess Attendance",
                    body: "Have you marked your attendance today? If not, it will be marked as Full.",
                },
                trigger: {
                    hour: 21,
                    minute: 0,
                    repeats: true,
                },
            });
            console.log("Daily notification scheduled for 9 PM");
        } catch (e) {
            console.error("Error scheduling notification:", e);
        }
    };

    const requestNotificationPermissions = async () => {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get notification permissions!');
                return;
            }
        } else {
            console.log('Must use physical device for Notifications');
        }
    };

    const updateSettings = async (newSettings) => {
        setSettings(newSettings);
        await saveSettings(newSettings);
    };

    const updateAttendance = async (date, status) => {
        const newAttendance = { ...attendance, [date]: { status } };
        setAttendance(newAttendance);
        await saveAttendance(newAttendance);
    };

    const resetAllData = async () => {
        await clearAllData();
        setSettings(null);
        setAttendance({});
    };

    const resetAttendance = async () => {
        await clearAttendanceData();
        setAttendance({});
    }

    return (
        <MessContext.Provider
            value={{
                settings,
                attendance,
                loading,
                updateSettings,
                updateAttendance,
                resetAllData,
                resetAttendance,
                loadData
            }}
        >
            {children}
        </MessContext.Provider>
    );
};
