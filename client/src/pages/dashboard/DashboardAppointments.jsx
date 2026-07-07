import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function DashboardAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments/my').then(({ data }) => setAppointments(data.appointments || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <div className="dash-empty">
          <p>You haven't booked any design consultations yet.</p>
          <Link to="/design-services" className="btn btn-primary">Book Free Consultation</Link>
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr><th>Date</th><th>Time</th><th>Meeting Type</th><th>Project</th><th>Status</th></tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.preferred_date || 'TBD'}</td>
                <td>{a.preferred_time || 'TBD'}</td>
                <td style={{ textTransform: 'capitalize' }}>{a.meeting_type?.replace('_', ' ')}</td>

                <td>{a.project_type || '—'}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
