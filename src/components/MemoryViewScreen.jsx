import React, { useState, useEffect } from 'react';
// import './MemoryViewScreen.css'; // 必要に応じて作成


function MemoryViewScreen({ tripId, tripData, onBack, onEditOverallMemory, onEditEventMemory }) {
  // tripData は App.jsx から渡される実際の旅行データ (schedules と overallMemory を含む)
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'gallery', 'map'

  if (!tripData) {
    return (
      <div className="memory-view-screen">
        <header className="app-header"><h1>思い出</h1><button onClick={onBack} className="back-button">戻る</button></header>
        <p>思い出データが見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="memory-view-screen">
      <header className="app-header">
        <h1>{tripData.name} の思い出</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      <div className="trip-overall-summary card-style">
        {tripData.coverImage && <img src={tripData.coverImage} alt={tripData.name} className="cover-image-memory" />}
        <h3>旅行全体の思い出</h3>
        {tripData.period && <p><strong>期間:</strong> {tripData.period}</p>}
        {tripData.destinations && <p><strong>主な目的地:</strong> {tripData.destinations}</p>}
        <p><strong>感想:</strong> {tripData.overallMemory?.notes || 'まだ感想はありません。'}</p>
        {tripData.overallMemory?.rating > 0 && <p><strong>総合評価:</strong> {'★'.repeat(tripData.overallMemory.rating)}{'☆'.repeat(5 - tripData.overallMemory.rating)}</p>}
        
        {/* 旅行全体の写真表示 */}
        {tripData.overallMemory?.photos && tripData.overallMemory.photos.length > 0 && (
          <div className="media-grid photos-grid" style={{marginTop: '10px'}}>
            {tripData.overallMemory.photos.map((photoUrl, idx) => (
              <img key={`overall-photo-${idx}`} src={photoUrl} alt={`旅行全体の写真 ${idx + 1}`} className="media-thumbnail-memory" />
            ))}
          </div>
        )}
        {/* 旅行全体の動画表示 (ファイル名) */}
        {tripData.overallMemory?.videos && tripData.overallMemory.videos.length > 0 && (
          <div className="media-grid videos-grid" style={{marginTop: '10px'}}>
            {tripData.overallMemory.videos.map((videoName, idx) => (
              <div key={`overall-video-${idx}`} className="media-thumbnail-memory video-placeholder">動画: {videoName}</div>
            ))}
          </div>
        )}

        {onEditOverallMemory && <button onClick={() => onEditOverallMemory(tripData.id, null, null)} className="edit-memory-button" style={{marginTop: '10px'}}>全体の思い出を編集</button>}
      </div>

      <div className="view-mode-toggle">
        <button onClick={() => setViewMode('timeline')} className={viewMode === 'timeline' ? 'active' : ''}>タイムライン</button>
        <button onClick={() => setViewMode('gallery')} className={viewMode === 'gallery' ? 'active' : ''}>ギャラリー</button>
        <button onClick={() => setViewMode('map')} className={viewMode === 'map' ? 'active' : ''}>マップ</button>
      </div>

      <div className="memory-content-area">
        {viewMode === 'timeline' && (
          tripData.schedules && tripData.schedules.length > 0 ? tripData.schedules.map(daily => (
            <div key={daily.date} className="daily-memory-section card-style">
              <h4>{new Date(daily.date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })} - {daily.dayDescription}</h4>
              {daily.events && daily.events.length > 0 ? daily.events.map(event => (
                <div key={event.id || event.name} className="event-memory-item"> {/* event.id を優先 */}
                  <h5>{event.time} - {event.name} <span className="event-category-memory">[{event.category}]</span></h5>
                  {event.details?.address && <p className="location-memory">場所: {event.details.name || event.name} ({event.details.address})</p>}
                  
                  {event.memory?.photos && event.memory.photos.length > 0 && (
                    <div className="media-grid photos-grid">
                      {event.memory.photos.map((photoUrl, idx) => <img key={idx} src={photoUrl} alt={`${event.name} photo ${idx+1}`} className="media-thumbnail-memory" />)}
                    </div>
                  )}
                  {event.memory?.videos && event.memory.videos.length > 0 && (
                    <div className="media-grid videos-grid">
                      {event.memory.videos.map((videoName, idx) => (
                        <div key={idx} className="media-thumbnail-memory video-placeholder">動画: {videoName}</div>
                      ))}
                    </div>
                  )}
                  {event.memory?.notes && <p className="notes-memory"><strong>メモ:</strong> {event.memory.notes}</p>}
                  {event.memory?.rating && <p className="rating-memory"><strong>評価:</strong> {'★'.repeat(event.memory.rating)}{'☆'.repeat(5 - event.memory.rating)}</p>}
                  {onEditEventMemory && <button onClick={() => onEditEventMemory(tripData.id, event.name, daily.date)} className="edit-memory-button">この予定の思い出を編集</button>}
                </div>
              )) : <p>この日のイベントの思い出はまだありません。</p>}
            </div>
          )) : <p>この旅行の思い出はまだありません。</p>
        )}

        {viewMode === 'gallery' && (
          <div className="gallery-view card-style"> {/* card-styleクラスを追加 */}
            <h4>ギャラリー表示</h4>
            <p>(ここに写真や動画が一覧表示されます - 未実装)</p>
            {/* TODO: フィルタリングオプションなど */}
          </div>
        )}

        {viewMode === 'map' && (
          <div className="map-view card-style"> {/* card-styleクラスを追加 */}
            <h4>マップ表示</h4>
            <p>(ここに思い出が登録された場所が地図上に表示されます - 未実装)</p>
            {/* TODO: マップコンポーネントの統合 */}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryViewScreen;
