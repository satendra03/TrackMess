export const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

export const formatDate = (year, month, day) => {
  // Returns YYYY-MM-DD
  const m = month + 1;
  const mm = m < 10 ? `0${m}` : m;
  const dd = day < 10 ? `0${day}` : day;
  return `${year}-${mm}-${dd}`;
};

export const getMonthName = (monthIndex) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
};

export const formatDateReadable = (dateStr) => {
  // Input: YYYY-MM-DD
  // Output: DD Mon, YYYY (e.g., 02 Feb, 2026)
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
