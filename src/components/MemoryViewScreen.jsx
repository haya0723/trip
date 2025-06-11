import React from 'react';
import OverallMemorySection from './OverallMemorySection';
import EventMemorySection from './EventMemorySection';

function MemoryViewScreen({ 
  tripId, 
  tripName, 
  tripMemories, 
  schedules, 
  onBack, 
  onShowMemoryForm, 
  onDeleteMemory 
}) {
  // console.log('[MemoryViewScreen] Props received: tripId:', tripId, 'tripName:', tripName);
  // console.log('[MemoryViewScreen] Raw tripMemories prop:', JSON.stringify(tripMemories, null, 2)); 
  // console.log('[MemoryViewScreen] Raw schedules prop:', JSON.stringify(schedules, null, 2));

  if (!tripId) {
    return (
      <div className="memory-view-screen" style={{ padding: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>思い出</h1>
          <button onClick={onBack}>戻る</button>
        </header>
        <p>旅程データが見つかりません。</p>
      </div>
    );
  }

  const overallMemories = tripMemories.filter(mem => mem.trip_id === tripId && !mem.event_id);
  const eventMemories = tripMemories.filter(mem => !!mem.event_id);
  // console.log('[MemoryViewScreen] Filtered overallMemories:', JSON.stringify(overallMemories, null, 2));
  // console.log('[MemoryViewScreen] Filtered eventMemories:', JSON.stringify(eventMemories, null, 2));

  return (
    <div className="memory-view-screen" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{tripName || `旅程ID:${tripId}`} の思い出</h1>
        <button onClick={onBack}>戻る</button>
      </header>

      <OverallMemorySection
        tripId={tripId}
        overallMemories={overallMemories}
        onShowMemoryForm={onShowMemoryForm}
        onDeleteMemory={onDeleteMemory}
      />
      
      <hr style={{margin: '20px 0'}}/>

      <EventMemorySection
        schedules={schedules}
        eventMemories={eventMemories}
        tripId={tripId}
        onShowMemoryForm={onShowMemoryForm}
        onDeleteMemory={onDeleteMemory}
      />
    </div>
  );
}

export default MemoryViewScreen;
