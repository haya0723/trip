import React from 'react';
// import './PlaceDetailScreen.css'; // 必要に応じて作成

function PlaceDetailScreen({ place, onBack, onAddToList, onAddToTrip }) {
  // place オブジェクトには、名前、住所、写真URL、評価、説明などが含まれる想定
  if (!place) {
    return <div>場所情報がありません。<button onClick={onBack}>戻る</button></div>;
  }

  return (
    <div className="place-detail-screen">
      <header className="app-header">
        <h1>{place.name || '場所の詳細'}</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      <div className="place-main-info">
        {place.photos && place.photos.length > 0 ? (
          <img src={place.photos[0]} alt={place.name} className="place-detail-image" />
        ) : (
          <div className="place-detail-image-placeholder">画像なし</div>
        )}
        <h2>{place.name}</h2>
        <p className="place-category">{place.category || 'カテゴリ情報なし'}</p>
        <p className="place-rating">評価: {place.rating || '評価なし'} ★</p>
        <p className="place-address">住所: {place.address || '住所情報なし'}</p>
        {place.phoneNumber && <p className="place-phone">電話番号: {place.phoneNumber}</p>}
        {place.website && <p className="place-website"><a href={place.website} target="_blank" rel="noopener noreferrer">公式サイト</a></p>}
      </div>

      <div className="place-actions">
        <button onClick={() => onAddToList(place)} className="add-to-list-button">行きたい場所リストに追加</button>
        <button onClick={() => onAddToTrip(place)} className="add-to-trip-button">旅程に追加</button>
        {/* <button onClick={() => console.log('経路検索未実装')} className="route-button">ここへの経路</button> */}
      </div>

      {place.openingHours && (
        <div className="place-opening-hours">
          <h4>営業時間</h4>
          {/* 営業時間は複雑なので、ここでは単純表示のプレースホルダー */}
          <pre>{typeof place.openingHours === 'string' ? place.openingHours : JSON.stringify(place.openingHours, null, 2)}</pre>
        </div>
      )}

      {place.reviews && place.reviews.length > 0 && (
        <div className="place-reviews">
          <h4>口コミ</h4>
          {place.reviews.slice(0, 3).map((review, index) => ( // とりあえず3件表示
            <div key={index} className="review-item">
              <p><strong>{review.author_name}</strong> ({review.rating}★)</p>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="user-memo-section">
        <h4>自分のメモ</h4>
        <textarea placeholder="この場所に関するメモを入力..." rows="3"></textarea>
      </div>
    </div>
  );
}

export default PlaceDetailScreen;
