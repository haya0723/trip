import React, { useState, useEffect } from 'react';

function MemoryFormScreen({ editingMemoryForEvent, onSaveMemory, onCancel }) {
  const { tripId, eventId, eventName, date, existingMemory } = editingMemoryForEvent || {};

  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [currentMediaUrls, setCurrentMediaUrls] = useState([]); // 既存のメディアURL
  const [newMediaFiles, setNewMediaFiles] = useState([]); // 新規アップロード用Fileオブジェクト
  const [newMediaPreviews, setNewMediaPreviews] = useState([]); // 新規ファイルのプレビューURL

  useEffect(() => {
    if (existingMemory) {
      setNotes(existingMemory.notes || '');
      setRating(existingMemory.rating || 0);
      setCurrentMediaUrls(existingMemory.media_urls || []);
      setNewMediaFiles([]);
      setNewMediaPreviews([]);
    } else {
      setNotes('');
      setRating(0);
      setCurrentMediaUrls([]);
      setNewMediaFiles([]);
      setNewMediaPreviews([]);
    }
  }, [existingMemory]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      newFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMediaPreviews(prev => [...prev, { name: file.name, url: reader.result, type: file.type }]);
      };
      reader.readAsDataURL(file);
    });
    setNewMediaFiles(prev => [...prev, ...newFiles]);
  };

  const removeCurrentMedia = (indexToRemove) => {
    setCurrentMediaUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeNewMedia = (indexToRemove) => {
    setNewMediaFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setNewMediaPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = () => {
    console.log('[MemoryFormScreen] handleSave called. Data to save:', { notes, rating, currentMediaUrls, eventId, tripId }, 'Files to upload:', newMediaFiles); // デバッグログ追加
    const memoryData = {
      notes,
      rating: parseInt(rating, 10) || 0,
      media_urls: currentMediaUrls, 
    };

    if (existingMemory && existingMemory.id) {
      memoryData.id = existingMemory.id;
    }
    if (eventId) {
      memoryData.event_id = eventId;
    } else if (tripId) { 
      memoryData.trip_id = tripId;
    }
    
    onSaveMemory(memoryData, newMediaFiles);
  };
  
  const getHeaderTitle = () => {
    let title = existingMemory ? '思い出を編集' : '新しい思い出';
    if (eventName) {
      title += ` (${eventName})`;
    } else if (date) {
      const formattedDate = new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
      title += ` (${formattedDate})`;
    } else if (tripId && !eventId) {
      title += ` (旅行全体)`;
    }
    return title;
  };


  return (
    <div className="memory-form-screen" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{getHeaderTitle()}</h2>
        <div>
          <button 
            onClick={() => {
              console.log('[MemoryFormScreen] Cancel button clicked. Calling onCancel...');
              onCancel();
            }} 
            style={{ marginRight: '10px', backgroundColor: 'red', color: 'white' }}
          >
            キャンセル
          </button> {/* 色を変更 */}
          <button onClick={handleSave} style={{ fontWeight: 'bold' }}>保存</button>
        </div>
      </header>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="memoryNotes" style={{ display: 'block', marginBottom: '5px' }}>メモ・感想:</label>
        <textarea
          id="memoryNotes"
          rows="5"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="この場所やイベントでの出来事、感じたことを記録しましょう..."
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>評価 (5段階):</label>
        <div>
          {[1, 2, 3, 4, 5].map(star => (
            <span 
              key={star} 
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'lightgray', fontSize: '2em', marginRight: '5px' }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="mediaUpload" style={{ display: 'block', marginBottom: '5px' }}>写真・動画を追加:</label>
        <input 
          type="file" 
          id="mediaUpload" 
          accept="image/*,video/*" 
          onChange={handleFileChange} 
          multiple 
          style={{ display: 'block', marginBottom: '10px' }}
        />
      </div>

      {(currentMediaUrls.length > 0 || newMediaPreviews.length > 0) && (
        <div style={{ marginBottom: '15px' }}>
          <h4>アップロード済み・選択中のメディア:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {currentMediaUrls.map((url, index) => (
              <div key={`current-${index}`} style={{ position: 'relative', border: '1px solid #ddd', padding: '5px' }}>
                {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <img src={url} alt={`既存メディア ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}/>
                ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={url} controls style={{ width: '100px', height: '100px' }} />
                ) : (
                  <a href={url} target="_blank" rel="noopener noreferrer">メディア {index + 1}</a>
                )}
                <button onClick={() => removeCurrentMedia(index)} style={{position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', lineHeight: '20px', textAlign: 'center' }}>×</button>
              </div>
            ))}
            {newMediaPreviews.map((preview, index) => (
              <div key={`new-${index}`} style={{ position: 'relative', border: '1px solid #ddd', padding: '5px' }}>
                {preview.type.startsWith('image/') ? (
                  <img src={preview.url} alt={`新規プレビュー ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}/>
                ) : (
                  <div style={{width: '100px', height: '100px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.8em', padding: '5px', boxSizing: 'border-box'}}>動画: {preview.name}</div>
                )}
                <button onClick={() => removeNewMedia(index)} style={{position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', lineHeight: '20px', textAlign: 'center' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MemoryFormScreen;
