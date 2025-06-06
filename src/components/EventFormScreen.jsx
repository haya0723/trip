import React, { useState, useEffect } from 'react';

function EventFormScreen({ tripId, scheduleId, date, existingEvent, onSaveEvent, onCancel, onShowPlaceSearch, onShowFavoritePicker }) {
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationLatitude, setLocationLatitude] = useState('');
  const [locationLongitude, setLocationLongitude] = useState('');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState('');
  const [type, setType] = useState('activity'); // デフォルト値

  useEffect(() => {
    if (existingEvent) {
      setTime(existingEvent.time || '');
      setName(existingEvent.name || '');
      setCategory(existingEvent.category || '');
      setDescription(existingEvent.description || '');
      setLocationName(existingEvent.location?.name || existingEvent.location_name || ''); // DB直接のキーも考慮
      setLocationAddress(existingEvent.location?.address || existingEvent.location_address || '');
      setLocationLatitude(existingEvent.location?.latitude || existingEvent.location_latitude || '');
      setLocationLongitude(existingEvent.location?.longitude || existingEvent.location_longitude || '');
      setEstimatedDurationMinutes(existingEvent.estimatedDurationMinutes || existingEvent.estimated_duration_minutes || '');
      setType(existingEvent.type || 'activity');
    } else {
      // 新規作成時のデフォルト値
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
      setName('');
      setCategory('');
      setDescription('');
      setLocationName('');
      setLocationAddress('');
      setLocationLatitude('');
      setLocationLongitude('');
      setEstimatedDurationMinutes('');
      setType('activity');
    }
  }, [existingEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      time,
      name,
      category,
      description,
      // バックエンドの events.service.js は location オブジェクトではなく、
      // location_name, location_address などを直接期待する可能性があるので、
      // eventData のトップレベルに展開する。
      location_name: locationName,
      location_address: locationAddress,
      location_latitude: locationLatitude ? parseFloat(locationLatitude) : null,
      location_longitude: locationLongitude ? parseFloat(locationLongitude) : null,
      estimated_duration_minutes: estimatedDurationMinutes ? parseInt(estimatedDurationMinutes, 10) : null,
      type,
    };
    onSaveEvent(tripId, scheduleId, eventData, existingEvent ? existingEvent.id : null);
  };

  const handlePlaceSelected = (place) => {
    setLocationName(place.name || '');
    setLocationAddress(place.formatted_address || place.address || ''); // Google Places API は formatted_address を返すことがある
    setLocationLatitude(place.geometry?.location?.lat() || place.latitude || '');
    setLocationLongitude(place.geometry?.location?.lng() || place.longitude || '');
  };

  return (
    <div className="event-form-screen" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{existingEvent ? '予定を編集' : '新しい予定を追加'}</h2>
      {date && <p>日付: {new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="event-time" style={{ display: 'block', marginBottom: '5px' }}>時間:</label>
          <input
            type="time"
            id="event-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="event-name" style={{ display: 'block', marginBottom: '5px' }}>予定名:</label>
          <input
            type="text"
            id="event-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 札幌時計台、夕食"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="event-category" style={{ display: 'block', marginBottom: '5px' }}>カテゴリ:</label>
          <input
            type="text"
            id="event-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="例: 観光、食事、移動"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="event-description" style={{ display: 'block', marginBottom: '5px' }}>詳細:</label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: 札幌の歴史的建造物を見学"
            rows="3"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="event-type" style={{ display: 'block', marginBottom: '5px' }}>タイプ:</label>
          <select id="event-type" value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="activity">アクティビティ</option>
            <option value="meal">食事</option>
            <option value="travel">移動</option>
            <option value="hotel_checkin">ホテルチェックイン</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="event-duration" style={{ display: 'block', marginBottom: '5px' }}>所要時間 (分):</label>
          <input
            type="number"
            id="event-duration"
            value={estimatedDurationMinutes}
            onChange={(e) => setEstimatedDurationMinutes(e.target.value)}
            placeholder="例: 60"
            min="0"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <h3 style={{marginTop: 0}}>場所情報</h3>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="location-name" style={{ display: 'block', marginBottom: '5px' }}>場所名:</label>
            <input
              type="text"
              id="location-name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="例: 札幌時計台"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="location-address" style={{ display: 'block', marginBottom: '5px' }}>住所:</label>
            <input
              type="text"
              id="location-address"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="例: 札幌市中央区北1条西2丁目"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{width: '48%'}}>
              <label htmlFor="location-latitude" style={{ display: 'block', marginBottom: '5px' }}>緯度:</label>
              <input
                type="text"
                id="location-latitude"
                value={locationLatitude}
                onChange={(e) => setLocationLatitude(e.target.value)}
                placeholder="例: 43.0686"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{width: '48%'}}>
              <label htmlFor="location-longitude" style={{ display: 'block', marginBottom: '5px' }}>経度:</label>
              <input
                type="text"
                id="location-longitude"
                value={locationLongitude}
                onChange={(e) => setLocationLongitude(e.target.value)}
                placeholder="例: 141.3507"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            {onShowPlaceSearch && (
              <button type="button" onClick={() => onShowPlaceSearch(handlePlaceSelected)} style={{ marginRight: '10px', padding: '8px 12px' }}>
                場所を検索して設定
              </button>
            )}
            {onShowFavoritePicker && (
              <button type="button" onClick={() => onShowFavoritePicker(handlePlaceSelected)} style={{ padding: '8px 12px' }}>
                お気に入りから選択
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="button" onClick={onCancel} style={{ marginRight: '10px', padding: '10px 15px' }}>キャンセル</button>
          <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none' }}>保存</button>
        </div>
      </form>
    </div>
  );
}

export default EventFormScreen;
