import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, [search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/admin/customers${params}`);
      setCustomers(data.customers || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 0 }}>Customers</h2>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="form-input" style={{ width: 260 }} />
      </div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.full_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && <div className="admin-empty"><p>No customers found.</p></div>}
        </div>
      )}
    </div>
  );
}
