import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMess } from "../context/MessContext";
import { formatDate, formatDateReadable } from "../utils/dateUtils";

const HolidayList = ({ onEdit }) => {
  const { attendance, removeHolidayRange } = useMess();

  const holidays = useMemo(() => {
    // 1. Filter all entries where status is 'holiday'
    const entries = Object.entries(attendance)
      .filter(([_, data]) => data.status === "holiday")
      .sort((a, b) => new Date(a[0]) - new Date(b[0])); // Sort by date ascending

    // 2. Group consecutive dates into ranges
    const ranges = [];
    if (entries.length === 0) return ranges;

    let currentRange = {
      start: entries[0][0],
      end: entries[0][0],
      note: entries[0][1].note,
    };

    for (let i = 1; i < entries.length; i++) {
      const currentDateStr = entries[i][0];
      const prevDateStr = entries[i - 1][0];
      const currentData = entries[i][1];

      const curr = new Date(currentDateStr);
      const prev = new Date(prevDateStr);
      const diffTime = Math.abs(curr - prev);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1 && currentData.note === currentRange.note) {
        currentRange.end = currentDateStr;
      } else {
        ranges.push(currentRange);
        currentRange = {
          start: currentDateStr,
          end: currentDateStr,
          note: currentData.note,
        };
      }
    }
    ranges.push(currentRange);

    return ranges;
  }, [attendance]);

  const handleDelete = (range) => {
    Alert.alert(
      "Delete Holiday",
      `Are you sure you want to delete the holiday from ${formatDateReadable(range.start)} to ${formatDateReadable(range.end)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeHolidayRange(range.start, range.end);
          },
        },
      ],
    );
  };

  if (holidays.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No holidays scheduled.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {holidays.map((range, index) => (
        <View key={`${range.start}-${index}`} style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.dateRange}>
              {range.start === range.end
                ? formatDateReadable(range.start)
                : `${formatDateReadable(range.start)}  ➜  ${formatDateReadable(range.end)}`}
            </Text>
            {range.note ? <Text style={styles.note}>{range.note}</Text> : null}
          </View>

          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(range)}
                style={styles.actionBtn}
              >
                <Ionicons name="create-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleDelete(range)}
              style={styles.actionBtn}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  info: {
    flex: 1,
  },
  dateRange: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 4,
  },
  note: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  deleteBtn: {
    padding: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
  },
});

export default HolidayList;
