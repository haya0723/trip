import React from 'react';
import MemoryItem from './MemoryItem';

function EventMemorySection({ 
  schedules, 
  eventMemories, 
  tripId, 
  onShowMemoryForm, 
  onDeleteMemory 
}) {
  if (!schedules || schedules.length === 0) {
    return <p>スケジュールがありません。</p>;
  }

  return (
    <div>
      <h3>イベントごとの思い出</h3>
      {schedules.map(schedule => (
        <div key={schedule.id || schedule.date} style={{ marginBottom: '20px' }}>
          <h4>
            {new Date(schedule.date).toLocaleDateString('ja-JP', { 
              month: 'long', 
              day: 'numeric', 
              weekday: 'short' 
            })}
          </h4>
          {(schedule.events && schedule.events.length > 0) ? 
            schedule.events.map(event => {
              const memoriesForThisEvent = eventMemories.filter(
                mem => mem.event_id === event.id
              );
              return (
                <div 
                  key={event.id} 
                  style={{ 
                    marginLeft: '20px', 
                    marginBottom: '15px', 
                    padding: '10px', 
                    border: '1px solid #f0f0f0', 
                    borderRadius: '4px' 
                  }}
                >
                  <h5>
                    {event.time} - {event.name}{' '}
                    <span style={{ fontSize: '0.8em', color: 'grey' }}>
                      [{event.category}]
                    </span>
                  </h5>
                  {memoriesForThisEvent.length > 0 ? (
                    memoriesForThisEvent.map(memory => (
                      <MemoryItem
                        key={memory.id}
                        memory={memory}
                        onEdit={() => 
                          onShowMemoryForm(tripId, event.id, event.name, schedule.date, memory)
                        }
                        onDelete={onDeleteMemory}
                        isEventMemory={true}
                      />
                    ))
                  ) : (
                    <p style={{ fontStyle: 'italic', color: '#777' }}>
                      このイベントの思い出はまだありません。
                    </p>
                  )}
                  <button 
                    onClick={() => 
                      onShowMemoryForm(tripId, event.id, event.name, schedule.date, null)
                    }
                  >
                    このイベントの思い出を追加
                  </button>
                </div>
              );
            })
           : (
            <p style={{ marginLeft: '20px', fontStyle: 'italic', color: '#777' }}>
              この日のイベントはありません。
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default EventMemorySection;
