import React, { useState, useEffect } from 'react';
// import './EventFormScreen.css'; // 必要に応じて作成

const eventCategories = ['観光', '食事', '移動', '宿泊', 'アクティビティ', 'ショッピング', 'その他'];

function EventFormScreen({ date, existingEvent, onSaveEvent, onCancel, onShowPlaceSearch, onShowFavoritePicker }) {
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(eventCategories[0]);
  const [location, setLocation] = useState(null); // { name: string, address?: string, lat?: number, lng?: number }
  const [description, setDescription] = useState('');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState('');

  useEffect(() => {
    if (existingEvent) {
      setTime(existingEvent.time || '');
      setTitle(existingEvent.name || '');
      setCategory(existingEvent.category || eventCategories[0]);
      setLocation(existingEvent.details || null); // `details` に場所情報が入っている想定
      setDescription(existingEvent.description || '');
      setEstimatedDurationMinutes(existingEvent.estimatedDurationMinutes || '');
    } else {
      // 新規作成時はフォームをリセット（またはデフォルト値を設定）
      setTime('10:00'); // デフォルト時刻
      setTitle('');
      setCategory(eventCategories[0]);
      setLocation(null);
      setDescription('');
      setEstimatedDurationMinutes('');
    }
  }, [existingEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      time,
      name: title, 
      type: category.toLowerCase(), 
      category,
      description,
      estimatedDurationMinutes: estimatedDurationMinutes ? parseInt(estimatedDurationMinutes, 10) : undefined,
      details: location, 
    };
    onSaveEvent(date, eventData, existingEvent); 
  };
  
  const handleSelectPlaceFromSearch = () => {
    onShowPlaceSearch((selectedPlace) => {
      setLocation(selectedPlace); 
    });
  };

  const handleSelectPlaceFromFavorite = () => {
    if (onShowFavoritePicker) {
      onShowFavoritePicker((selectedPlace) => {
        // お気に入りから選択された場所情報で location state を更新
        // お気に入りデータは name, address, category などを持つ想定
        setLocation({ 
          name: selectedPlace.name, 
          address: selectedPlace.address || '', 
          // 必要に応じて他の情報もコピー
        });
      });
    }
  };

  return (
    <div className="event-form-screen auth-screen"> 
      <header className="app-header">
        <h1>{existingEvent ? '予定の編集' : '新しい予定の追加'} - {date}</h1>
        <button onClick={onCancel} className="cancel-button">キャンセル</button>
      </header>

      <form onSubmit={handleSubmit} className="auth-form" style={{marginTop: 0}}>
        <div className="form-section">
          <label htmlFor="event-time">時間:</label>
          <input type="time" id="event-time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>

        <div className="form-section">
          <label htmlFor="event-title">タイトル:</label>
          <input type="text" id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例: 東京タワー観光" required />
        </div>

        <div className="form-section">
          <label htmlFor="event-category">カテゴリ:</label>
          <select id="event-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {eventCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="form-section">
          <label htmlFor="event-location-display">場所:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              id="event-location-display" 
              value={location ? location.name : ''} 
              onChange={(e) => {
                setLocation(prevLocation => ({ ...(prevLocation || {}), name: e.target.value }));
              }}
              placeholder="場所名を入力または選択"
              style={{ flexGrow: 1 }}
            />
            <button type="button" onClick={handleSelectPlaceFromSearch} className="action-button-secondary" style={{flexShrink: 0}}>検索</button>
            {onShowFavoritePicker && 
              <button type="button" onClick={handleSelectPlaceFromFavorite} className="action-button-secondary" style={{flexShrink: 0}}>お気に入りから</button>
            }
          </div>
          {location && location.address && <p style={{fontSize: '0.8em', color: '#555', margin: '5px 0 0 0'}}>{location.address}</p>}
        </div>
        
        <div className="form-section">
          <label htmlFor="event-duration">所要時間 (分):</label>
          <input type="number" id="event-duration" value={estimatedDurationMinutes} onChange={(e) => setEstimatedDurationMinutes(e.target.value)} placeholder="例: 60" min="0" />
        </div>

        <div className="form-section">
          <label htmlFor="event-description">メモ・詳細:</label>
          <textarea id="event-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="予約情報、持ち物など"></textarea>
        </div>

        <button type="submit" className="auth-button">{existingEvent ? '更新' : '追加'}</button>
      </form>
    </div>
  );
}

export default EventFormScreen;
