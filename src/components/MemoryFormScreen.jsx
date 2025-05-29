import React, { useState } from 'react';
// import './MemoryFormScreen.css'; // 必要に応じて作成

function MemoryFormScreen({ eventName, existingMemory, onSaveMemory, onCancel }) {
  const [photos, setPhotos] = useState(existingMemory?.photos || []);
  const [videos, setVideos] = useState(existingMemory?.videos || []);
  const [notes, setNotes] = useState(existingMemory?.notes || '');
  const [rating, setRating] = useState(existingMemory?.rating || 0);

  const handlePhotoUpload = (e) => {
    // ダミー処理: ファイル名をリストに追加
    if (e.target.files && e.target.files[0]) {
      setPhotos([...photos, e.target.files[0].name]);
    }
  };

  const handleSave = () => {
    onSaveMemory({
      eventName, // どのイベントに対する思い出か
      photos,
      videos, // 動画アップロードは別途検討
      notes,
      rating,
    });
  };

  return (
    <div className="memory-form-screen">
      <header className="app-header">
        <h1>{eventName || '思い出'} の登録・編集</h1>
        <div>
          <button onClick={onCancel} className="cancel-button">キャンセル</button>
          <button onClick={handleSave} className="save-button">保存</button>
        </div>
      </header>

      <div className="form-section">
        <h3>{eventName || '選択された予定'}</h3>
      </div>

      <div className="form-section">
        <label>写真・動画</label>
        <input type="file" accept="image/*,video/*" onChange={handlePhotoUpload} multiple />
        <div className="media-preview-area">
          {photos.map((photoName, index) => (
            <div key={index} className="media-thumbnail">
              {photoName} (写真プレビュー)
              {/* <img src={URL.createObjectURL(photoObj)} alt={`photo-${index}`} /> */}
            </div>
          ))}
          {/* 動画のプレビューも同様に */}
        </div>
      </div>

      <div className="form-section">
        <label htmlFor="memoryNotes">感想・メモ</label>
        <textarea
          id="memoryNotes"
          rows="5"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="この場所での出来事や感想を記録しましょう..."
        ></textarea>
      </div>

      <div className="form-section">
        <label>評価 (5段階)</label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map(star => (
            <span 
              key={star} 
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'grey', fontSize: '1.5em' }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemoryFormScreen;
