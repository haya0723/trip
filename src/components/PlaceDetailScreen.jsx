import React from 'react';
// import './PlaceDetailScreen.css'; // 必要に応じて作成

function PlaceDetailScreen({ place, onBack, onAddToList, onAddToTrip, isFavorite, onAddFavorite, onRemoveFavorite }) {
  // place オブジェクトには、名前、住所、写真URL、評価、説明などが含まれる想定
  if (!place) {
    return <div>場所情報がありません。<button onClick={onBack}>戻る</button></div>;
  }

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      onRemoveFavorite(place.id || place.name);
    } else {
      onAddFavorite(place);
    }
  };

  return (
    <div className="place-detail-screen">
      <header className="app-header">
        <h1>{place.name || '場所の詳細'}</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      <div className="place-main-info card-style" style={{marginBottom: '15px'}}>
        {place.photos && place.photos.length > 0 ? (
          <img src={place.photos[0]} alt={place.name} className="place-detail-image" style={{width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '4px 4px 0 0'}}/>
        ) : (
          <div className="place-detail-image-placeholder" style={{height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px 4px 0 0'}}>画像なし</div>
        )}
        <div style={{padding: '15px'}}>
          <h2>{place.name}</h2>
          <p className="place-category" style={{fontSize: '0.9em', color: '#555'}}>{place.category || 'カテゴリ情報なし'}</p>
          <p className="place-rating">評価: {place.rating || '評価なし'} ★</p>
          <p className="place-address">住所: {place.address || '住所情報なし'}</p>
          {place.phoneNumber && <p className="place-phone">電話番号: {place.phoneNumber}</p>}
          {place.website && <p className="place-website"><a href={place.website} target="_blank" rel="noopener noreferrer">公式サイト</a></p>}
        </div>
      </div>

      <div className="place-actions card-style" style={{padding: '15px', marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
        <button onClick={() => onAddToList(place)} className="action-button">行きたい場所リストに追加</button>
        <button onClick={() => onAddToTrip(place)} className="action-button">旅程に追加</button>
        {onAddFavorite && onRemoveFavorite && (
          <button onClick={handleFavoriteToggle} className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`} style={{background: isFavorite ? '#ffc107' : '#eee', color: isFavorite? '#fff' : '#333', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer'}}>
            {isFavorite ? '★ お気に入りから削除' : '☆ お気に入りに追加'}
          </button>
        )}
      </div>

      {place.openingHours && (
        <div className="place-opening-hours card-style" style={{padding: '15px', marginBottom: '15px'}}>
          <h4>営業時間</h4>
          <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{typeof place.openingHours === 'string' ? place.openingHours : JSON.stringify(place.openingHours, null, 2)}</pre>
        </div>
      )}

      {place.reviews && place.reviews.length > 0 && (
        <div className="place-reviews card-style" style={{padding: '15px', marginBottom: '15px'}}>
          <h4>口コミ</h4>
          {place.reviews.slice(0, 3).map((review, index) => ( // とりあえず3件表示
            <div key={index} className="review-item" style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
              <p><strong>{review.author_name}</strong> ({review.rating}★)</p>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="user-memo-section card-style" style={{padding: '15px'}}>
        <h4>自分のメモ</h4>
        <textarea placeholder="この場所に関するメモを入力..." rows="3" style={{width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}></textarea>
      </div>
    </div>
  );
}

export default PlaceDetailScreen;
