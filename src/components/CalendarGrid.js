import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
} from "../utils/dateUtils";

const STATUS_COLORS = {
  absent: "#E0E0E0", // Gray
  half: "#FFD700", // Gold/Yellow
  full: "#4CD964", // Green
  holiday: "#CE93D8", // Light Purple
  default: "#FFFFFF",
};

const STATUS_LABELS = {
  absent: "A",
  half: "H",
  full: "F",
  holiday: "V", // Vacation
};

const CalendarGrid = ({
  year,
  month,
  attendanceData,
  onDayPress,
  selectedDate,
  otherDate,
  containerWidth,
}) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year); // 0 = Sunday, 1 = Monday, etc.

  const days = [];

  // Empty slots for days before the 1st of the month
  for (let i = 0; i < firstDay; i++) {
    days.push({ key: `empty-${i}`, empty: true });
  }

  // Actual days
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(year, month, d);
    const status = attendanceData[dateStr]?.status;
    const note = attendanceData[dateStr]?.note;
    days.push({
      key: dateStr,
      day: d,
      status: status,
      note: note,
      isToday: isCurrentMonth && d === currentDay,
      dateStr: dateStr,
    });
  }

  // Calculate dynamic cell size
  const { width } = Dimensions.get("window");
  // Default to window width minus padding if no custom width provided
  // 60 = 20 (container padding) + 20 (screen padding) + safety
  // If containerWidth is provided, subtract 20 for the internal padding of CalendarGrid
  const finalWidth = containerWidth ? containerWidth - 20 : width - 60;
  const CELL_SIZE = finalWidth / 7;

  // Clone styles to inject dynamic width
  const dynamicStyles = {
    headerText: { width: CELL_SIZE },
    cell: { width: CELL_SIZE, height: CELL_SIZE },
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text key={day} style={[styles.headerText, dynamicStyles.headerText]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((item) => {
          if (item.empty) {
            return (
              <View key={item.key} style={[styles.cell, dynamicStyles.cell]} />
            );
          }

          const isSelected = selectedDate === item.dateStr;
          const isOther = otherDate === item.dateStr;

          let backgroundColor = isSelected ? "#007AFF" : STATUS_COLORS.default;

          if (!isSelected) {
            if (isOther) {
              backgroundColor = "#E3F2FD"; // Light Blue
            } else if (item.status) {
              backgroundColor = STATUS_COLORS[item.status];
            }
          }

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.cell,
                dynamicStyles.cell,
                { backgroundColor },
                isOther && styles.otherDateCell,
                item.isToday && !isSelected && styles.todayCell,
              ]}
              onPress={() => onDayPress(item.dateStr, item.status)}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isOther && styles.otherDayText,
                ]}
              >
                {item.day}
              </Text>
              {/* Status Label */}
              {item.status && !isSelected && !isOther && (
                <Text style={styles.statusText}>
                  {STATUS_LABELS[item.status]}
                </Text>
              )}
              {/* Note Indicator */}
              {item.note ? <View style={styles.noteIndicator} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#eee",
  },
  todayCell: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  statusText: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
    fontWeight: "bold",
  },
  noteIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6200ea", // Deep Purple
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  otherDateCell: {
    borderWidth: 1.5,
    borderColor: "#2196F3",
  },
  otherDayText: {
    color: "#1976D2",
    fontWeight: "bold",
  },
});

export default CalendarGrid;
