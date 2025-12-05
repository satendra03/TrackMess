# TrackMess 🍽️

**TrackMess** is a smart, user-friendly React Native application designed to help hostel residents track their daily mess attendance and manage monthly expenses effortlessly.

Built with **Expo** and **React Native**, it offers a seamless experience for marking attendance, viewing monthly summaries, and sharing reports.

---

## 🚀 Features

### 📅 Smart Attendance Tracking
- **Interactive Calendar**: Tap dates to cycle through statuses:
  - 🟢 **Full Day**: 2 Meals (Green)
  - 🟡 **Half Day**: 1 Meal (Yellow)
  - ⚪ **Absent**: 0 Meals (Gray)
- **Quick Mark**: Dedicated buttons to instantly mark attendance for "Today".
- **Future Date Protection**: Prevents accidental marking of future dates.

### 📊 Monthly Insights
- **Real-time Summary**: Instantly view total Full Days, Half Days, and Absent Days.
- **Cost Calculation**: Automatically calculates the total amount due based on your daily mess rate.

### 🔔 Smart Notifications & Automation
- **Daily Reminders**: Get a friendly nudge at **9:00 PM** to mark your attendance.
- **Auto-Mark**: Forgot to mark? The app automatically marks past unmarked days as "Full" to ensure your records are complete.

### 📤 Sharing & Reports
- **Share Monthly Report**: Generate and share a detailed text report via WhatsApp, Telegram, etc.
- **Visual Snapshot**: Shares a beautiful image of your monthly calendar along with the text report.

### ⚙️ Customizable
- **Mess Name**: Personalize the app with your hostel/mess name.
- **Daily Cost**: Set your specific daily full-day meal cost.
- **Data Management**: Easily clear attendance or reset the app if needed.

---

## 📱 Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/TrackMess.git
    cd TrackMess
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the App**
    ```bash
    npx expo start
    ```

4.  **Run on Device**
    - Download **Expo Go** on your Android/iOS device.
    - Scan the QR code shown in the terminal.

---

## 🛠️ Technologies Used

- **React Native** (Expo SDK 52)
- **React Navigation** (Stack & Tabs)
- **AsyncStorage** (Local Data Persistence)
- **Expo Notifications** (Local Reminders)
- **React Native View Shot** (Image Capture)
- **Expo Sharing** (Social Sharing)

---

## 📂 Project Structure

```
TrackMess/
├── assets/              # Icons and splash screens
├── src/
│   ├── components/      # Reusable UI (CalendarGrid, SummaryCard)
│   ├── context/         # Global State (MessContext)
│   ├── navigation/      # App Navigation (AppNavigator)
│   ├── screens/         # App Screens (Home, Settings, Setup)
│   ├── storage/         # Local Storage Logic
│   └── utils/           # Helpers (Date formatting, Reports)
├── App.js               # Entry Point
└── app.json             # Expo Configuration
```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for Hostel Life.
