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
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
};
