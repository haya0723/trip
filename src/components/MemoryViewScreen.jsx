import React, { useState } from 'react';
// import './MemoryViewScreen.css'; // 必要に応じて作成

// ダミーの思い出データ（TripDetailScreenのdummyDailySchedulesと連携する想定）
const dummyMemories = {
  tripId: 1, // どの旅行計画の思い出か
  tripName: '夏の北海道旅行2024',
  overallImpressions: '最高の夏休みだった！特に富良野のラベンダー畑が忘れられない。',
  overallRating: 5,
  dailyMemories: [
    {
      date: '2024-08-10',
      events: [
        { 
          eventName: 'ホテルチェックイン', 
          photos: ['dummy-hotel.jpg'], 
          notes: '広くてきれいな部屋だった。ウェルカムドリンクも美味しかった。', 
          rating: 4 
        },
        { 
          eventName: '大通公園散策', 
          photos: ['dummy-park1.jpg', 'dummy-park2.jpg'], 
          notes: '天気が良くて気持ちよかった。テレビ塔にも登った。', 
          rating: 5
        },
      ]
    },
    {
      date: '2024-08-11',
      events: [
        { 
          eventName: '小樽運河クルーズ', 
          photos: ['dummy-canal.jpg'], 
          notes: '風が心地よく、歴史を感じるクルーズだった。', 
          rating: 4
        },
      ]
    }
  ]
};


function MemoryViewScreen({ tripId, onBack, onEditMemory }) {
  // TODO: tripId を元に実際の思い出データを取得する処理
  const [memories, setMemories] = useState(dummyMemories); 
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'gallery', 'map'

  if (!memories) {
    return <div>思い出データがありません。<button onClick={onBack}>戻る</button></div>;
  }

  return (
    <div className="memory-view-screen">
      <header className="app-header">
        <h1>{memories.tripName} の思い出</h1>
        <div>
          {/* <button onClick={() => onEditMemory(memories.tripId, null)}>旅行全体の思い出を編集</button> */}
          <button onClick={onBack} className="back-button">戻る</button>
        </div>
      </header>

      <div className="trip-overall-summary">
        <h3>旅行全体の感想</h3>
        <p>{memories.overallImpressions || 'まだ感想はありません。'}</p>
        <p>総合評価: {'★'.repeat(memories.overallRating || 0)}{'☆'.repeat(5 - (memories.overallRating || 0))}</p>
      </div>

      <div className="view-mode-toggle">
        <button onClick={() => setViewMode('timeline')} className={viewMode === 'timeline' ? 'active' : ''}>タイムライン</button>
        <button onClick={() => setViewMode('gallery')} className={viewMode === 'gallery' ? 'active' : ''}>ギャラリー</button>
        <button onClick={() => setViewMode('map')} className={viewMode === 'map' ? 'active' : ''}>マップ</button>
      </div>

      <div className="memory-content-area">
        {viewMode === 'timeline' && (
          <div className="timeline-view">
            {memories.dailyMemories.map(daily => (
              <div key={daily.date} className="daily-memory-section">
                <h4>{new Date(daily.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}</h4>
                {daily.events.map((eventMemory, index) => (
                  <div key={index} className="event-memory-item">
                    <h5>{eventMemory.eventName}</h5>
                    {eventMemory.photos && eventMemory.photos.length > 0 && (
                      <div className="photos-preview">
                        {eventMemory.photos.map((p, i) => <span key={i} className="photo-dummy">{p} </span>)}
                      </div>
                    )}
                    <p className="notes">{eventMemory.notes}</p>
                    <p>評価: {'★'.repeat(eventMemory.rating || 0)}{'☆'.repeat(5 - (eventMemory.rating || 0))}</p>
                    <button onClick={() => onEditMemory(memories.tripId, eventMemory.eventName)}>この思い出を編集</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {viewMode === 'gallery' && (
          <div className="gallery-view">
            {/* TODO: ギャラリー表示の実装 */}
            <p>ギャラリー表示 (未実装)</p>
            {memories.dailyMemories.flatMap(d => d.events.flatMap(e => e.photos || [])).map((photo, i) => (
              <span key={i} className="photo-dummy-gallery">{photo} </span>
            ))}
          </div>
        )}
        {viewMode === 'map' && (
          <div className="map-view">
            {/* TODO: マップ表示の実装 */}
            <p>マップ表示 (未実装)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryViewScreen;
