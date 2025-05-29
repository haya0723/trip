import React from 'react';
// App.css は App.jsx でインポートされているので、ここでは不要か、
// もしコンポーネント固有のスタイルがあれば別途 TripCard.css を作成してインポート
// import './TripCard.css'; 

function TripCard({ trip, onEdit, onSelect, onViewMemories }) { // onSelect, onViewMemories を props に追加
  return (
    <div className="trip-card" onClick={onSelect} style={{ cursor: 'pointer' }}> {/* カード全体をクリック可能に */}
      {trip.coverImage ? (
        <img src={trip.coverImage} alt={trip.name} className="trip-card-image" />
      ) : (
        <div className="trip-card-image-placeholder">カバー画像なし</div>
      )}
      <div className="trip-card-content">
        <h3>{trip.name}</h3>
        <p className="trip-card-period">{trip.period}</p>
        <p className="trip-card-destinations">主な目的地: {trip.destinations}</p>
        <p className={`trip-card-status status-${trip.status.toLowerCase().replace(' ', '-')}`}>
          {trip.status}
        </p>
        {/* 「思い出を見る」ボタンを追加 */}
        {trip.status === '完了' && onViewMemories && ( // 例: 完了した旅行のみ表示
          <button 
            className="view-memories-button" 
            onClick={(e) => { 
              e.stopPropagation(); // 親のonClick（詳細表示）が発火しないように
              onViewMemories(); 
            }}
          >
            思い出を見る
          </button>
        )}
      </div>
      <button 
        className="trip-card-menu-button" 
        onClick={(e) => {
          e.stopPropagation(); // 親のonClick（詳細表示）が発火しないように
          onEdit(trip);
        }}
      >
        ・・・
      </button>
    </div>
  );
}

export default TripCard;
