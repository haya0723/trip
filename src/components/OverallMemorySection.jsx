import React from 'react';
import MemoryItem from './MemoryItem';

function OverallMemorySection({ 
  tripId, 
  overallMemories, 
  onShowMemoryForm, 
  onDeleteMemory 
}) {
  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
      <h3>旅行全体の思い出</h3>
      {overallMemories.length > 0 ? (
        overallMemories.map(memory => (
          <MemoryItem
            key={memory.id}
            memory={memory}
            onEdit={() => onShowMemoryForm(tripId, null, '旅行全体', null, memory)}
            onDelete={onDeleteMemory}
            isEventMemory={false}
          />
        ))
      ) : (
        <p>旅行全体の思い出はまだありません。</p>
      )}
      <button 
        onClick={() => onShowMemoryForm(tripId, null, '旅行全体', null, null)} 
        style={{ marginTop: '10px' }}
      >
        旅行全体の思い出を追加
      </button>
    </div>
  );
}

export default OverallMemorySection;
