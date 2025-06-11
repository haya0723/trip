import React from 'react';

function MemoryItem({ memory, onEdit, onDelete, isEventMemory = false }) {
  if (!memory) {
    return null;
  }

  const imageSize = isEventMemory ? '80px' : '100px';

  return (
    <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dotted #eee' }}>
      {memory.notes && <p><strong>メモ:</strong> {memory.notes}</p>}
      {memory.rating > 0 && (
        <p>
          <strong>評価:</strong> {'★'.repeat(memory.rating)}{'☆'.repeat(5 - memory.rating)}
        </p>
      )}
      {memory.media_urls && memory.media_urls.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
          {memory.media_urls.map((url, idx) => (
            <div key={idx} style={{ width: imageSize, height: imageSize }}>
              {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img src={url} alt={`メディア ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={url} controls style={{ width: '100%', height: '100%' }} />
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  メディアファイル {idx + 1}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      <button onClick={onEdit} style={{ marginRight: '5px', marginTop: '5px' }}>
        編集
      </button>
      <button onClick={() => onDelete(memory.id)} style={{ marginTop: '5px' }}>
        削除
      </button>
    </div>
  );
}

export default MemoryItem;
