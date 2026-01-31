import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CalendarGrid from "./CalendarGrid";
import { getMonthName } from "../utils/dateUtils";

const DateSelectionModal = ({
  visible,
  onClose,
  onDateSelected,
  title = "Select Date",
  initDate,
  otherDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (visible) {
      // 1. Set selected date if provided (editing)
      if (initDate) {
        setSelectedDate(initDate);
      } else {
        setSelectedDate(null);
      }

      // 2. Set calendar view (currentDate)
      // Priority: initDate > otherDate > Today
      if (initDate) {
        const [y, m, d] = initDate.split("-").map(Number);
        setCurrentDate(new Date(y, m - 1, 1));
      } else if (otherDate) {
        const [y, m, d] = otherDate.split("-").map(Number);
        setCurrentDate(new Date(y, m - 1, 1));
      } else {
        setCurrentDate(new Date());
      }
    }
  }, [visible, initDate, otherDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayPress = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelected(selectedDate);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.monthNav}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={styles.navButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                  {getMonthName(month)} {year}
                </Text>
                <TouchableOpacity
                  onPress={handleNextMonth}
                  style={styles.navButton}
                >
                  <Ionicons name="chevron-forward" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>

              <CalendarGrid
                year={year}
                month={month}
                attendanceData={{}}
                onDayPress={handleDayPress}
                selectedDate={selectedDate}
                otherDate={otherDate}
                containerWidth={Dimensions.get("window").width * 0.9 - 40} // 90% width - 40 padding
              />

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !selectedDate && styles.disabledButton,
                ]}
                onPress={handleConfirm}
                disabled={!selectedDate}
              >
                <Text style={styles.saveButtonText}>Confirm Date</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#B0C4DE",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DateSelectionModal;
