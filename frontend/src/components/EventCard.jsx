import React from 'react';
import { Users, User, Trophy } from 'lucide-react';

const EventCard = ({ event, onRegister, myRegistrations = [] }) => {
  const eventRegs = myRegistrations.filter(reg => reg.event._id === event._id);
  
  // Total possible registrations for this event across all categories
  // (simplified logic: if user has registered ANY for this event, show some status)
  const totalRegs = eventRegs.length;
  const isFullyRegistered = event.category.every(cat => {
    const catRegs = eventRegs.filter(r => r.category === cat);
    if (event.weightCategory && event.weightCategory.length > 0) {
      return event.weightCategory.every(w => 
        catRegs.filter(r => r.weightCategory === w).length >= event.maxPerMandalam
      );
    }
    return catRegs.length >= event.maxPerMandalam;
  });

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: isFullyRegistered ? '1px solid var(--success)' : '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--accent-blue)' }}>{event.name}</h3>
          {totalRegs > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>{totalRegs} registered</span>}
        </div>
        {event.type === 'Team' ? <Users size={20} color="var(--text-secondary)" /> : <User size={20} color="var(--text-secondary)" />}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={16} />
          <span>{event.type} Event</span>
        </div>
        <div>
          <strong>Categories:</strong> {event.category.join(', ')}
        </div>
        {event.weightCategory && event.weightCategory.length > 0 && (
          <div>
            <strong>Weight:</strong> {event.weightCategory.join(', ')}
          </div>
        )}
        <div>
          <strong>Limit:</strong> {event.maxPerMandalam} {event.type === 'Team' ? 'Team' : 'entries'} per category
        </div>
      </div>

      <button 
        className={`btn ${isFullyRegistered ? 'btn-secondary' : 'btn-primary'}`} 
        style={{ marginTop: 'auto', opacity: isFullyRegistered ? 0.7 : 1 }} 
        onClick={onRegister}
      >
        {isFullyRegistered ? 'Registered (Add More)' : 'Register Now'}
      </button>
    </div>
  );
};

export default EventCard;
