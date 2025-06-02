import React from 'react';
// import './FavoritePlacesScreen.css'; // 必要に応じて

function FavoritePlacesScreen({ favoritePlaces, onSelectPlace, onRemoveFavorite, onBack }) {
  if (!favoritePlaces) {
    return (
      <div className="favorite-places-screen" style={{ padding: '20px' }}>
        <header className="app-header">
          <h1>お気に入り場所リスト</h1>
          <button onClick={onBack} className="back-button">戻る</button>
        </header>
        <p>お気に入り場所データがありません。</p>
      </div>
    );
  }

  return (
    <div className="favorite-places-screen" style={{ padding: '20px' }}>
      <header className="app-header">
        <h1>お気に入り場所リスト</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      {favoritePlaces.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>お気に入りに登録された場所はまだありません。</p>
      ) : (
        <div className="favorite-places-list" style={{ marginTop: '20px' }}>
          {favoritePlaces.map(place => (
            <div key={place.id || place.name} className="favorite-place-item card-style" style={{ marginBottom: '15px', padding: '15px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '5px' }}>{place.name}</h3>
              {place.category && <p style={{ fontSize: '0.9em', color: '#555', margin: '0 0 5px 0' }}>カテゴリ: {place.category}</p>}
              {place.address && <p style={{ fontSize: '0.9em', margin: '0 0 10px 0' }}>住所: {place.address}</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => onSelectPlace(place)} className="action-button-secondary">詳細を見る</button>
                <button onClick={() => onRemoveFavorite(place.id || place.name)} className="danger-button">お気に入りから削除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritePlacesScreen;
