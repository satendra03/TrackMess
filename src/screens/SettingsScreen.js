import React, { useState, useEffect } from "react";
import { version } from "../../package.json";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Keyboard,
} from "react-native";
import { useMess } from "../context/MessContext";
import { SafeAreaView } from "react-native-safe-area-context";

import DateSelectionModal from "../components/DateSelectionModal";
import HolidayList from "../components/HolidayList";

const SettingsScreen = () => {
  const { settings, updateSettings, markHolidayRange, removeHolidayRange } =
    useMess();
  const [messName, setMessName] = useState("");
  const [dailyCost, setDailyCost] = useState("");

  // Holiday Mode State
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [holidayNote, setHolidayNote] = useState("");
  // 'start' | 'end' | null
  const [activeDateInput, setActiveDateInput] = useState(null);

  const [manageHolidaysVisible, setManageHolidaysVisible] = useState(false);
  const [editingRange, setEditingRange] = useState(null);

  useEffect(() => {
    if (settings) {
      setMessName(settings.messName);
      setDailyCost(settings.dailyFullCost.toString());
    }
  }, [settings]);

  const openDatePicker = (type) => {
    Keyboard.dismiss();
    setActiveDateInput(type);
  };

  const handleDateSelected = (date) => {
    if (activeDateInput === "start") {
      setStartDate(date);
    } else if (activeDateInput === "end") {
      setEndDate(date);
    }
    setActiveDateInput(null);
  };

  const handleSave = async () => {
    if (!messName.trim()) {
      Alert.alert("Error", "Please enter a Mess Name.");
      return;
    }
    const cost = parseFloat(dailyCost);
    if (isNaN(cost) || cost <= 0) {
      Alert.alert("Error", "Please enter a valid daily cost greater than 0.");
      return;
    }

    await updateSettings({
      ...settings,
      messName: messName.trim(),
      dailyFullCost: cost,
    });
    Alert.alert("Success", "Settings saved successfully.");
  };

  const handleApplyHoliday = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select both Start and End dates.");
      return;
    }

    const [sY, sM, sD] = startDate.split("-").map(Number);
    const [eY, eM, eD] = endDate.split("-").map(Number);
    const sDate = new Date(sY, sM - 1, sD);
    const eDate = new Date(eY, eM - 1, eD);

    if (eDate < sDate) {
      Alert.alert("Error", "End Date must be after Start Date.");
      return;
    }

    if (editingRange) {
      // If editing, first remove the old range
      await removeHolidayRange(editingRange.start, editingRange.end);
    }

    await markHolidayRange(startDate, endDate, holidayNote || "Vacation");

    Alert.alert(
      "Success",
      editingRange
        ? "Holiday updated successfully!"
        : "Holiday marked successfully!",
    );

    // Reset State
    setStartDate(null);
    setEndDate(null);
    setHolidayNote("");
    setEditingRange(null);
  };

  const handleEditHoliday = (range) => {
    setManageHolidaysVisible(false); // Close list
    setStartDate(range.start);
    setEndDate(range.end);
    setHolidayNote(range.note || "");
    setEditingRange(range);
  };

  const cancelEdit = () => {
    setStartDate(null);
    setEndDate(null);
    setHolidayNote("");
    setEditingRange(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
          <Text style={styles.sectionTitle}>Vacation Mode</Text>
          <Text style={styles.helperText}>
            Mark a range of dates as holiday.
          </Text>

          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => openDatePicker("start")}
            >
              <Text style={styles.label}>Start Date</Text>
              <Text style={styles.dateText}>{startDate || "Select"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => openDatePicker("end")}
            >
              <Text style={styles.label}>End Date</Text>
              <Text style={styles.dateText}>{endDate || "Select"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reason / Note</Text>
            <TextInput
              style={styles.input}
              value={holidayNote}
              onChangeText={setHolidayNote}
              placeholder="e.g. Going Home"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.holidayButton}
            onPress={handleApplyHoliday}
          >
            <Text style={styles.holidayButtonText}>
              {editingRange ? "Update Holiday" : "Apply Holiday"}
            </Text>
          </TouchableOpacity>

          {editingRange && (
            <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Edit</Text>
            </TouchableOpacity>
          )}

          {!editingRange && (startDate || endDate || holidayNote) ? (
            <TouchableOpacity onPress={cancelEdit} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear Form</Text>
            </TouchableOpacity>
          ) : null}

          {!editingRange && (
            <TouchableOpacity
              style={styles.viewHolidaysButton}
              onPress={() => setManageHolidaysVisible(true)}
            >
              <Text style={styles.viewHolidaysText}>
                View Upcoming Holidays
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.version}>v{version}</Text>
      </ScrollView>

      <Modal
        animationType="slide"
        visible={manageHolidaysVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => setManageHolidaysVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upcoming Holidays</Text>
            <TouchableOpacity onPress={() => setManageHolidaysVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <HolidayList onEdit={handleEditHoliday} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <DateSelectionModal
        visible={!!activeDateInput}
        onClose={() => setActiveDateInput(null)}
        onDateSelected={handleDateSelected}
        title={
          activeDateInput === "start" ? "Select Start Date" : "Select End Date"
        }
        initDate={activeDateInput === "start" ? startDate : endDate}
        otherDate={activeDateInput === "start" ? endDate : startDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  version: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  helperText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  holidayButton: {
    backgroundColor: "#9C27B0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  holidayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  viewHolidaysButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  viewHolidaysText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  cancelButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  clearButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
    borderStyle: "dashed",
  },
  clearButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default SettingsScreen;
