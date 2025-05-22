import React, { useState, useEffect } from "react";
import GenericTable from "../../components/GenericTable";

type AttendanceEntry = {
  date: string;
  loginTime: string;
  logoutTime: string | null;
};

const STORAGE_KEY = "employee_attendance";

const MyAttendance = () => {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [currentLoginTime, setCurrentLoginTime] = useState<string | null>(null);

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: AttendanceEntry[] = JSON.parse(stored);
      setEntries(parsed);
      const lastEntry = parsed[parsed.length - 1];
      if (lastEntry && !lastEntry.logoutTime) {
        setCurrentLoginTime(lastEntry.loginTime);
      }
    }
  }, []);

  // Save entries to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleLogin = () => {
    const now = new Date();
    const loginTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString();

    setCurrentLoginTime(loginTime);

    setEntries(prev => [
      ...prev,
      { date, loginTime, logoutTime: null }
    ]);
  };

  const handleLogout = () => {
    const now = new Date();
    const logoutTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updated = [...entries];
    const lastIndex = updated.length - 1;
    if (lastIndex >= 0 && !updated[lastIndex].logoutTime) {
      updated[lastIndex].logoutTime = logoutTime;
      setEntries(updated);
      setCurrentLoginTime(null);
    }
  };

  return (
    <div>
      <GenericTable
        columns={[
          { key: "date", title: "Date" },
          { key: "loginTime", title: "Login Time" },
          {
            key: "logoutTime",
            title: "Logout Time",
            render: (row: AttendanceEntry) => row.logoutTime || "--",
          },
        ]}
        btnTitle={currentLoginTime ? "LogOut" : "LogIn"}
        onAdd={currentLoginTime ? handleLogout : handleLogin}
        styleTitle={{
          ...styles.button,
          backgroundColor: currentLoginTime ? "red" : "#4CAF50",
        }}
        data={entries}
        rowsPerPage={5}
        searchKeys={["date"]}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "10px",
  },
};

export default MyAttendance;
