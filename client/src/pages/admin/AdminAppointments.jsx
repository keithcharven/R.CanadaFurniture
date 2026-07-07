import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { loadData(); }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/appointments/admin/all${params}`);
      setAppointments(data.appointments || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/appointments/admin/${id}`, { status }); loadData(); } catch(e) { alert('Failed'); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 0 }}>Design Appointments</h2>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select" style={{ width: 'auto' }}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Client</th><th>Email</th><th>Date</th><th>Type</th><th>Project</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.client_full_name}</td>
                <td>{a.email}</td>
                <td>{a.preferred_date || 'TBD'}</td>
                <td style={{ textTransform: 'capitalize' }}>{a.meeting_type?.replace('_',' ')}</td>

                <td>{a.project_type || '—'}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                <td>
                  <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)} className="form-select" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <div className="admin-empty"><p>No appointments found.</p></div>}
      </div>
    </div>
  );
}
