import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';
import jsPDF from 'jspdf';
import { appointments as initialAppointments, patients, doctors } from '../data/data';
import AppointmentForm from './AppointmentForm';

const localizer = momentLocalizer(moment);

function CalendarView() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month');
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);



useEffect(() => {
  const savedAppointments = localStorage.getItem('appointments');
  if (savedAppointments) {
    const parsedAppointments = JSON.parse(savedAppointments).map(app => ({
      ...app,
      start: new Date(app.start),
      end: new Date(app.end),
    }));
    setAppointments(parsedAppointments);
  } else {
    setAppointments(initialAppointments);
  }
}, []);


  const handleSelectSlot = ({ start }) => {
    const selectedDateISO = start.toISOString().split('T')[0];
    setSelectedDate(selectedDateISO);
    setShowForm(true);
  };

const handleSaveAppointment = (appointment) => {
  let updatedAppointments;

  if (editingAppointment) {
    updatedAppointments = appointments.map((app) =>
      app === editingAppointment ? appointment : app
    );
    setEditingAppointment(null);
  } else {
    updatedAppointments = [...appointments, appointment];
  }

  setAppointments(updatedAppointments);
  localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
};


 const handleSelectEvent = (event) => {
  const action = window.prompt(`Type "edit" to edit or "delete" to remove this appointment: "${event.title}"`);
  if (action === 'delete') {
    const updatedAppointments = appointments.filter(
      (app) => app.start !== event.start || app.title !== event.title
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  } else if (action === 'edit') {
    setEditingAppointment(event);
    const selectedDateISO = new Date(event.start).toISOString().split('T')[0];
    setSelectedDate(selectedDateISO);
    setShowForm(true);
  }
};

const handleExportAppointmentsPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('Clinic Appointments', 20, 20);

  let y = 30;
  appointments.forEach((app, index) => {
    doc.text(
      `${index + 1}. ${app.title} | ${app.start.toLocaleString()}`,
      20,
      y
    );
    y += 10;
  });

  doc.save('appointments.pdf');
};

const handleExportAppointments = () => {
  const data = localStorage.getItem('appointments');
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'appointments.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="calendar-container">
      <h2>Clinic Appointments Calendar</h2>
      <button onClick={() => navigate('/')} className="back-button">Back to Home</button>
<div className="search-container">
  <input
    type="text"
    placeholder="Search appointments..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
</div>


    <div className="darkmode-toggle">
  <button onClick={() => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  }}>
    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
  </button>
</div>
<div className="export-container">
  <button onClick={() => handleExportAppointmentsPDF()}>
    Export Appointments 📄 (PDF)
  </button>
</div>


<div className="filter-container">
  <label>Filter by Patient:</label>
  <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
    <option value="">All</option>
    {patients.map((p, index) => (
      <option key={index} value={p}>{p}</option>
    ))}
  </select>

  <label>Filter by Doctor:</label>
  <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
    <option value="">All</option>
    {doctors.map((d, index) => (
      <option key={index} value={d}>{d}</option>
    ))}
  </select>
</div>


<Calendar
  localizer={localizer}
events={appointments.filter((app) => {
  const matchesPatient = selectedPatient === '' || app.title.includes(selectedPatient);
  const matchesDoctor = selectedDoctor === '' || app.title.includes(selectedDoctor);
  const matchesSearch = searchText === '' || app.title.toLowerCase().includes(searchText.toLowerCase());
  return matchesPatient && matchesDoctor && matchesSearch;
})}

  startAccessor="start"
  endAccessor="end"
  selectable
  onSelectSlot={handleSelectSlot}
onSelectEvent={handleSelectEvent}
  views={['month', 'week', 'day', 'agenda']}
  view={view}
  onView={(newView) => setView(newView)}
  date={currentDate}
  onNavigate={(newDate) => setCurrentDate(newDate)}
  style={{ height: 600, margin: '50px' }}
/>

    
      {showForm && (
        <AppointmentForm
          selectedDate={selectedDate}
          onSave={handleSaveAppointment}
          onClose={() => setShowForm(false)}
          patients={patients}
          doctors={doctors}
        />
      )}
    </div>
  );
}

export default CalendarView;
