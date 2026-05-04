import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import RegistrationModal from '../components/RegistrationModal';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [eventsRes, regRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/events`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/registrations`, config)
      ]);
      setEvents(eventsRes.data);
      setMyRegistrations(regRes.data);
      
      // Update global user state with latest registrations
      updateUser({ ...user, registrations: regRes.data });
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleRegistrationSuccess = () => {
    handleCloseModal();
    fetchData(); // Refresh data
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <div>
          <h1 className="text-gradient">IMPULSE '26</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user.name} Mandalam</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${activeTab === 'events' ? 'btn-primary' : 'glass-card'}`}
          onClick={() => setActiveTab('events')}
        >
          Available Events
        </button>
        <button 
          className={`btn ${activeTab === 'registrations' ? 'btn-primary' : 'glass-card'}`}
          onClick={() => setActiveTab('registrations')}
        >
          My Registrations
        </button>
      </div>

      {activeTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {events.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              myRegistrations={myRegistrations}
              onRegister={() => handleRegisterClick(event)} 
            />
          ))}
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Registered Participants</h2>
          {myRegistrations.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No registrations yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Event</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Weight Cat</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Participants/Leader</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {myRegistrations.map(reg => (
                    <tr key={reg._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>{reg.event.name}</td>
                      <td style={{ padding: '1rem' }}>{reg.category}</td>
                      <td style={{ padding: '1rem' }}>{reg.weightCategory || '-'}</td>
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
      )}

      {isModalOpen && selectedEvent && (
        <RegistrationModal 
          event={selectedEvent} 
          onClose={handleCloseModal} 
          onSuccess={handleRegistrationSuccess} 
        />
      )}
    </div>
  );
};

export default Dashboard;
