import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react';

const RegistrationModal = ({ event, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState(event.category[0]);
  const [weightCategory, setWeightCategory] = useState(event.weightCategory?.[0] || '');
  const [teamLeaderName, setTeamLeaderName] = useState('');
  const [participants, setParticipants] = useState([{ name: '' }]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddParticipant = () => {
    if (participants.length < 2) {
      setParticipants([...participants, { name: '' }]);
    }
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index].name = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = {
        eventId: event._id,
        category,
        weightCategory: weightCategory || undefined,
        teamLeaderName: event.type === 'Team' ? teamLeaderName : undefined,
        participants: event.type === 'Individual' ? participants.filter(p => p.name.trim() !== '') : undefined,
        mobileNumber
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/registrations`, payload, config);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Maybe limit reached?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 51, 153, 0.4)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: 'var(--accent-blue)' }}>Register: {event.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              {event.category.map(cat => {
                const count = user.registrations?.filter(r => r.event._id === event._id && r.category === cat).length || 0;
                const isFull = count >= event.maxPerMandalam;
                return (
                  <option key={cat} value={cat} disabled={isFull}>
                    {cat} {isFull ? '(Full)' : count > 0 ? `(${count}/${event.maxPerMandalam})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {event.weightCategory && event.weightCategory.length > 0 && (
            <div className="form-group">
              <label className="form-label">Weight Category</label>
              <select className="form-control" value={weightCategory} onChange={(e) => setWeightCategory(e.target.value)}>
                {event.weightCategory.map(w => {
                  const count = user.registrations?.filter(r => r.event._id === event._id && r.category === category && r.weightCategory === w).length || 0;
                  const isFull = count >= event.maxPerMandalam;
                  return (
                    <option key={w} value={w} disabled={isFull}>
                      {w} {isFull ? '(Full)' : count > 0 ? `(${count}/${event.maxPerMandalam})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input 
              type="tel" 
              className="form-control" 
              value={mobileNumber} 
              onChange={(e) => setMobileNumber(e.target.value)} 
              required 
              placeholder="Enter mobile number"
            />
          </div>

          {event.type === 'Team' ? (
            <div className="form-group">
              <label className="form-label">Team Leader Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={teamLeaderName} 
                onChange={(e) => setTeamLeaderName(e.target.value)} 
                required 
                placeholder="Enter team leader's name"
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                This is a team event for {event.participantsPerTeam} participants. Only team leader name is required for registration.
              </p>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Participants (Max 2)</label>
              {participants.map((p, index) => (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={p.name} 
                    onChange={(e) => handleParticipantChange(index, e.target.value)} 
                    required 
                    placeholder={`Participant ${index + 1} Name`}
                  />
                </div>
              ))}
              {participants.length < 2 && (
                <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginTop: '0.5rem' }} onClick={handleAddParticipant}>
                  + Add 2nd Participant
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn glass-card" style={{ flex: 1, color: 'var(--text-primary)' }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Submitting...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
