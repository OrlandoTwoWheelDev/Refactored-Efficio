import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { DateTime } from "luxon"; 
import "react-calendar/dist/Calendar.css";
import "./CalendarPage.css"; 


const CalendarPage = () => {
  const [nextTask, setNextTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(DateTime.now());
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [username, setUsername] = useState(null);

  // Get and decode token
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username);
        console.log("Extracted username:", payload.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  // Fetch tasks when `username` is set
  const fetchTasks = async () => {
    if (!username) {
      console.warn("No username found.");
      return;
    }
  
    try {
      const response = await fetch(`/api/tasks/byowner/${username}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched tasks:", data);
  
      const formattedTasks = data.map((task) => ({
        ...task,
        endDate: task.end_date ? DateTime.fromISO(task.end_date).toISODate() : null,
      }));
  
      setTasks(formattedTasks);
  
      // Find the soonest upcoming task
      const upcomingTask = formattedTasks
        .filter(task => task.endDate) // Ensure task has a due date
        .sort((a, b) => DateTime.fromISO(a.endDate) - DateTime.fromISO(b.endDate)) // Sort by soonest
        [0]; // Get the first task (soonest due)
  
      setNextTask(upcomingTask || null);
  
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  // Fetch tasks when `username` is set
  useEffect(() => {
    if (username) {
      fetchTasks();
    }
  }, [username]);
  
  // Handle date selection
  const handleDateChange = (date) => {
    const luxonDate = DateTime.fromJSDate(date);
    setSelectedDate(luxonDate);
    setSelectedTasks(tasks.filter(task => task.endDate === luxonDate.toISODate()));
  };

  // Highlight calendar dates with tasks
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      return tasks.some(task => task.endDate === DateTime.fromJSDate(date).toISODate()) ? "highlight" : null;
    }
  };

  return (
    <div className="calendar-container">
      <h2>Task Calendar</h2>
      <Calendar onChange={handleDateChange} value={selectedDate.toJSDate()} tileClassName={tileClassName} />
      <p>Selected Date: {selectedDate.toFormat("DDDD")} (Weekday: {selectedDate.weekdayLong})</p>

      {selectedTasks.length > 0 ? (
        <div className="task-list">
          <h3>Tasks Due on {selectedDate.toFormat("DDDD")}:</h3>
          <ul>
            {selectedTasks.map((task) => (
              <li key={task.id}>
                <strong>{task.subject}</strong> - Due: {task.endDate ? DateTime.fromISO(task.endDate).toFormat("MMM dd, yyyy") : "No Date Set"}
                <br />
                <small>Status: {task.status} | Priority: {task.priority}</small>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tasks due on this date.</p>
      )}
    </div>
  );
};

export default CalendarPage;
