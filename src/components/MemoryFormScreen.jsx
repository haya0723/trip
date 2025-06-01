import React, { useState, useEffect } from 'react';
// import './MemoryFormScreen.css'; // 必要に応じて作成

function MemoryFormScreen({ tripId, eventName, existingMemory, onSaveMemory, onCancel }) {
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  
  // 写真用 state
  const [photoFiles, setPhotoFiles] = useState([]); // アップロードするFileオブジェクトの配列
  const [photoPreviews, setPhotoPreviews] = useState([]); // 表示用URL (DataURLまたは既存URL) の配列

  // 動画用 state (今回はファイル名のみを扱う簡易版)
  const [videoFiles, setVideoFiles] = useState([]); // アップロードするFileオブジェクトの配列
  const [videoNames, setVideoNames] = useState([]); // 表示用ファイル名の配列

  useEffect(() => {
    if (existingMemory) {
      setNotes(existingMemory.notes || '');
      setRating(existingMemory.rating || 0);
      // 既存のメディアはURL文字列の配列として渡される想定
      setPhotoPreviews(existingMemory.photos || []); 
      setVideoNames(existingMemory.videos || []); // 動画はファイル名やURLの配列を想定
      setPhotoFiles([]); // 編集開始時は新規ファイル選択をリセット
      setVideoFiles([]);
    } else {
      setNotes('');
      setRating(0);
      setPhotoPreviews([]);
      setVideoNames([]);
      setPhotoFiles([]);
      setVideoFiles([]);
    }
  }, [existingMemory]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotoFiles = [];
    const newPhotoPreviews = [];
    const newVideoFiles = [];
    const newVideoNames = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newPhotoFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        newVideoFiles.push(file);
        setVideoNames(prev => [...prev, file.name]); // 動画はファイル名でプレビュー
      }
    });
    setPhotoFiles(prev => [...prev, ...newPhotoFiles]);
    setVideoFiles(prev => [...prev, ...newVideoFiles]);
  };

  const removePhoto = (indexToRemove) => {
    setPhotoPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setPhotoFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const removeVideo = (indexToRemove) => {
    setVideoNames(prev => prev.filter((_, index) => index !== indexToRemove));
    setVideoFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = () => {
    // App.jsx にはプレビューURL(DataURLまたは既存URL)とファイル名(動画)の配列を渡す
    onSaveMemory({
      tripId, 
      eventName, 
      notes,
      rating,
      photos: photoPreviews, // DataURLまたは既存URLの配列
      videos: videoNames,   // ファイル名または既存URLの配列
      // photoFiles や videoFiles を直接渡してApp.jsxでアップロード処理をする場合は別途検討
    });
  };

  return (
    <div className="memory-form-screen">
      <header className="app-header">
        <h1>{eventName || (tripId ? `旅行ID:${tripId} 全体` : '思い出')} の登録・編集</h1>
        <div>
          <button onClick={onCancel} className="cancel-button">キャンセル</button>
          <button onClick={handleSave} className="save-button">保存</button>
        </div>
      </header>

      <div className="form-section">
        <h3>{eventName || '旅行全体の思い出'}</h3>
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

      <div className="form-section">
        <label htmlFor="mediaUpload">写真・動画を追加</label>
        <input 
          type="file" 
          id="mediaUpload" 
          accept="image/*,video/*" 
          onChange={handleMediaChange} 
          multiple 
          style={{display: 'block', marginBottom: '10px'}}
        />
        
        {photoPreviews.length > 0 && <h4>写真プレビュー:</h4>}
        <div className="media-preview-area">
          {photoPreviews.map((previewUrl, index) => (
            <div key={`photo-${index}`} className="media-thumbnail" style={{position: 'relative'}}>
              <img src={previewUrl} alt={`写真プレビュー ${index + 1}`} style={{width: '100px', height: '100px', objectFit: 'cover'}}/>
              <button onClick={() => removePhoto(index)} style={{position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer'}}>×</button>
            </div>
          ))}
        </div>

        {videoNames.length > 0 && <h4 style={{marginTop: '15px'}}>動画ファイル:</h4>}
        <div className="media-preview-area">
          {videoNames.map((videoName, index) => (
            <div key={`video-${index}`} className="media-thumbnail video-placeholder" style={{position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', background: '#f0f0f0', textAlign: 'center'}}>
              <span>{videoName}</span>
              <button onClick={() => removeVideo(index)} style={{position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer'}}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemoryFormScreen;
