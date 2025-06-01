import React, { useState, useEffect } from 'react';
// import './PublicTripDetailScreen.css'; // 必要に応じて作成

function EventDetailModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
        <h3>{event.name} <span style={{fontSize: '0.8em', color: '#555'}}>({event.category})</span></h3>
        {event.time && <p><strong>時間:</strong> {event.time}</p>}
        {event.description && <p><strong>説明:</strong> {event.description}</p>}
        {event.locationDetails?.name && <p><strong>場所:</strong> {event.locationDetails.name} {event.locationDetails.address && `(${event.locationDetails.address})`}</p>}
        {event.publicNotes && <p><strong>メモ:</strong> {event.publicNotes}</p>}
        {event.publicPhotos && event.publicPhotos.length > 0 && (
          <div style={{marginTop: '10px'}}>
            <strong>写真:</strong>
            <div className="media-grid photos-grid" style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px'}}>
              {event.publicPhotos.map((photoUrl, idx) => (
                <img key={idx} src={photoUrl} alt={`${event.name} photo ${idx+1}`} style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px'}} />
              ))}
            </div>
          </div>
        )}
        <button onClick={onClose} style={{marginTop: '20px'}}>閉じる</button>
      </div>
    </div>
  );
}

function PublicTripDetailScreen({ publicTripData, onBack, onCopyToMyPlans }) {
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

  if (!publicTripData) {
    return <div className="public-trip-detail-screen" style={{padding: '20px'}}><p>旅程データが見つかりません。</p><button onClick={onBack}>戻る</button></div>;
  }

  const handleEventClick = (event) => {
    setSelectedEventForDetail(event);
    setShowEventDetailModal(true);
  };
  
  const { title, author, destinations, duration, coverImage, tags, description, estimatedCost, schedules, comments, rating, copiedCount } = publicTripData;

  return (
    <div className="public-trip-detail-screen">
      <header className="app-header">
        <h1>{title || "公開旅程詳細"}</h1>
        <div>
          <button onClick={() => onCopyToMyPlans(publicTripData)} className="copy-to-my-plans-button action-button">この旅程を自分の計画にコピー</button>
          <button onClick={onBack} className="back-button" style={{marginLeft: '10px'}}>検索結果へ戻る</button>
        </div>
      </header>

      <div className="public-trip-summary card-style" style={{marginBottom: '20px'}}>
        {coverImage && <img src={coverImage} alt={title} className="public-trip-detail-image" style={{width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '4px 4px 0 0'}} />}
        <div style={{padding: '15px'}}>
          <h2>{title}</h2>
          <p><strong>作成者:</strong> {author || '匿名ユーザー'}</p>
          <p><strong>主な目的地:</strong> {Array.isArray(destinations) ? destinations.join(', ') : destinations}</p>
          <p><strong>期間:</strong> {duration}</p>
          {tags && tags.length > 0 && <p><strong>タグ:</strong> {tags.map(tag => <span key={tag} className="tag" style={{fontSize: '0.9em', background: '#eee', padding: '2px 6px', borderRadius: '3px', marginRight: '5px'}}>#{tag}</span>)}</p>}
          {description && <p><strong>概要:</strong> {description}</p>}
          {estimatedCost && <p><strong>概算費用:</strong> {estimatedCost}</p>}
          {rating && <p><strong>評価:</strong> {rating}★ | <strong>コピーされた回数:</strong> {copiedCount || 0}</p>}
        </div>
      </div>

      <div className="public-trip-daily-schedules">
        <h3>スケジュール詳細</h3>
        {schedules && schedules.length > 0 ? schedules.map((daily, index) => (
          <div key={daily.date || index} className="daily-schedule-item card-style" style={{marginBottom: '15px'}}>
            <h4 style={{padding: '10px 15px', margin: 0, borderBottom: '1px solid #eee'}}>{daily.date} ({daily.dayDescription})</h4>
            <ul style={{listStyle: 'none', padding: '0 15px 15px 15px', margin: 0}}>
              {daily.events && daily.events.length > 0 ? daily.events.map((event, eventIndex) => (
                <li key={event.name || eventIndex} onClick={() => handleEventClick(event)} style={{padding: '10px 0', borderBottom: '1px dashed #f0f0f0', cursor: 'pointer'}}>
                  <strong>{event.time}</strong> - {event.name} <span style={{fontSize: '0.8em', color: '#555'}}>({event.category})</span>
                  {event.description && <p style={{fontSize: '0.9em', margin: '5px 0 0 0', color: '#333'}}>{event.description}</p>}
                </li>
              )) : <li>この日の予定はありません。</li>}
            </ul>
          </div>
        )) : <p>スケジュール情報がありません。</p>}
      </div>
      
      {comments && comments.length > 0 && (
        <div className="public-trip-comments card-style" style={{marginTop: '20px'}}>
          <h3 style={{padding: '15px 15px 10px 15px', margin: 0, borderBottom: '1px solid #eee'}}>コメント</h3>
          <div style={{padding: '0 15px 15px 15px'}}>
            {comments.map((comment, index) => (
              <div key={index} className="comment-item" style={{padding: '10px 0', borderBottom: '1px dashed #f0f0f0'}}>
                <p><strong>{comment.user}:</strong> {comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {showEventDetailModal && <EventDetailModal event={selectedEventForDetail} onClose={() => setShowEventDetailModal(false)} />} 
    </div>
  );
}

export default PublicTripDetailScreen;
