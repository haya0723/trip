import React, { useState, useEffect } from 'react';
// import './EventFormScreen.css'; // 必要に応じて作成

const eventCategories = ['観光', '食事', '移動', '宿泊', 'アクティビティ', 'ショッピング', 'その他'];

function EventFormScreen({ date, existingEvent, onSaveEvent, onCancel, onShowPlaceSearch }) {
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
      setTime('');
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
      name: title, // TripDetailScreen の event.name に合わせる
      type: category.toLowerCase(), // 仮にカテゴリを type としても使う
      category,
      description,
      estimatedDurationMinutes: estimatedDurationMinutes ? parseInt(estimatedDurationMinutes, 10) : undefined,
      details: location, // 場所情報を details に格納
      // id: existingEvent ? existingEvent.id : Date.now(), // IDはApp側で振るか、既存なら維持
    };
    onSaveEvent(date, eventData, existingEvent); // 既存イベント情報も渡して更新か新規かを判断
  };
  
  // 場所検索から戻ってきたときに場所情報を設定するコールバック
  // App.jsx 側でこのコンポーネントに渡す selectedPlaceFromSearch のような props を経由して呼び出す想定
  // 今回は直接 onShowPlaceSearch を呼び、戻り値で場所を設定する単純な形は取れないため、
  // App.jsx 側での状態管理と props 経由での場所情報注入が必要。
  // ここではダミーの場所選択ボタンを配置する。
  const handleSelectPlace = () => {
    // onShowPlaceSearch を呼び出し、場所検索画面に遷移する
    // 選択結果は App.jsx 経由でこのフォームに渡される想定
    onShowPlaceSearch((selectedPlace) => {
      setLocation(selectedPlace); // 例: { name: '東京タワー', address: '東京都港区芝公園４丁目２−８' }
    });
  };


  return (
    <div className="event-form-screen auth-screen"> {/* auth-screenのスタイルを流用 */}
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
          <label htmlFor="event-location-display">場所:</label> {/* htmlFor を修正 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="text" 
              id="event-location-display" 
              value={location ? location.name : ''} 
              onChange={(e) => {
                // 手入力された場合は、name のみを更新し、他の詳細情報はクリアする（または保持する戦略も可）
                setLocation(prevLocation => ({ ...prevLocation, name: e.target.value, address: '', lat: undefined, lng: undefined }));
              }}
              onClick={() => { /* readOnlyではないので、クリックで検索画面に遷移する動作はボタンに集約 */ }}
              placeholder="場所名を入力または検索"
              style={{ flexGrow: 1 }}
            />
            <button type="button" onClick={handleSelectPlace} className="search-destination-button" style={{flexShrink: 0}}>検索</button>
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
