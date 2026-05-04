import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMandalam, setFilterMandalam] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllRegistrations();
  }, []);

  const fetchAllRegistrations = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/registrations/all`, config);
      setRegistrations(data);
      setFilteredRegistrations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = registrations;

    if (filterMandalam) {
      result = result.filter(reg => reg.mandalam.name === filterMandalam);
    }

    if (searchTerm) {
      result = result.filter(reg => 
        reg.event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (reg.teamLeaderName && reg.teamLeaderName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRegistrations(result);
  }, [filterMandalam, searchTerm, registrations]);

  const mandalams = [...new Set(registrations.map(reg => reg.mandalam.name))];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <div>
          <h1 className="text-gradient">ADMIN PORTAL</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, Administrator</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={20} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search by event or participant..." 
            className="form-control" 
            style={{ border: 'none', background: 'none', padding: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Filter size={20} color="var(--text-secondary)" />
          <select 
            className="form-control" 
            style={{ border: 'none', background: 'none', padding: 0, color: 'var(--text-primary)' }}
            value={filterMandalam}
            onChange={(e) => setFilterMandalam(e.target.value)}
          >
            <option value="" style={{ background: 'var(--bg-primary)' }}>All Mandalams</option>
            {mandalams.map(m => (
              <option key={m} value={m} style={{ background: 'var(--bg-primary)' }}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>All Registrations ({filteredRegistrations.length})</h2>
        </div>

        {loading ? (
          <p>Loading registrations...</p>
        ) : filteredRegistrations.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No registrations found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Mandalam</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Event</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Category</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Participant(s) / Leader</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map(reg => (
                  <tr key={reg._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{reg.mandalam.name}</td>
                    <td style={{ padding: '1rem' }}>{reg.event.name}</td>
                    <td style={{ padding: '1rem' }}>{reg.category} {reg.weightCategory ? `(${reg.weightCategory})` : ''}</td>
                    <td style={{ padding: '1rem' }}>
                      {reg.event.type === 'Team' 
                        ? reg.teamLeaderName 
                        : reg.participants.map(p => p.name).join(', ')}
                    </td>
                    <td style={{ padding: '1rem' }}>{reg.mobileNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
