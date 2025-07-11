import React, { useState } from 'react';
import './AppointmentForm.css';

function AppointmentForm({ selectedDate, onSave, onClose, patients, doctors, initialData }) {
  const [patient, setPatient] = useState(() => initialData?.patient || '');
  const [doctor, setDoctor] = useState(() => initialData?.doctor || '');
  const [time, setTime] = useState(() => initialData?.time || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (patient && doctor && time) {
      const appointment = {
        title: `${patient} with ${doctor}`,
        start: new Date(`${selectedDate}T${time}`),
        end: new Date(`${selectedDate}T${time}`),
        patient,
        doctor,
        time
      };
      onSave(appointment);
      onClose();
    } else {
      alert('Please fill all fields!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-modal">
        <h3>Book Appointment</h3>
        <form onSubmit={handleSubmit}>
          <label>Patient:</label>
          <select value={patient} onChange={(e) => setPatient(e.target.value)} required>
            <option value="">Select</option>
            {patients.map((p, index) => (
              <option key={index} value={p}>{p}</option>
            ))}
          </select>

          <label>Doctor:</label>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
            <option value="">Select</option>
            {doctors.map((d, index) => (
              <option key={index} value={d}>{d}</option>
            ))}
          </select>

          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm;
