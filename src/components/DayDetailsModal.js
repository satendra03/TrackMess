import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DayDetailsModal = ({
  visible,
  date,
  initialStatus,
  initialNote,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = useState(initialStatus || "absent");
  const [note, setNote] = useState(initialNote || "");

  useEffect(() => {
    if (visible) {
      setStatus(initialStatus || "absent");
      setNote(initialNote || "");
    }
  }, [visible, initialStatus, initialNote]);

  const handleSave = () => {
    onSave(status, note);
    onClose();
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toDateString();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalView}
            >
              <View style={styles.header}>
                <Text style={styles.modalTitle}>{formatDateDisplay(date)}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Attendance Status</Text>
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    status === "absent" && styles.statusButtonSelected,
                    status === "absent" && {
                      backgroundColor: "#ffebee",
                      borderColor: "#ffcdd2",
                    },
                  ]}
                  onPress={() => setStatus("absent")}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === "absent" && {
                        color: "#c62828",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    Absent
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    status === "half" && styles.statusButtonSelected,
                    status === "half" && {
                      backgroundColor: "#fff8e1",
                      borderColor: "#ffecb3",
                    },
                  ]}
                  onPress={() => setStatus("half")}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === "half" && {
                        color: "#f57f17",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    Half
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    status === "full" && styles.statusButtonSelected,
                    status === "full" && {
                      backgroundColor: "#e8f5e9",
                      borderColor: "#c8e6c9",
                    },
                  ]}
                  onPress={() => setStatus("full")}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === "full" && {
                        color: "#2e7d32",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    Full
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Note</Text>
              <TextInput
                style={styles.input}
                placeholder="Add a reason or mini note..."
                placeholderTextColor="#999"
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={100}
              />
              <Text style={styles.charCount}>{note.length}/100</Text>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Details</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
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
    width: "85%",
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  statusButtonSelected: {
    borderWidth: 2,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    height: 80,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DayDetailsModal;
