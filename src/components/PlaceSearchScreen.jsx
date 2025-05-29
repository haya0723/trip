import React, { useState } from 'react';
// import './PlaceSearchScreen.css'; // 必要に応じて作成

function PlaceSearchScreen({ onSelectPlace, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]); // ダミーの検索結果

  const handleSearch = (e) => {
    e.preventDefault();
    // ここで実際の検索処理（API呼び出しなど）を行う
    // 今回はダミーデータをセット
    setSearchResults([
      { id: 'place1', name: `${searchTerm} の場所1`, address: '東京都千代田区' },
      { id: 'place2', name: `${searchTerm} の場所2`, address: '神奈川県横浜市' },
    ]);
  };

  return (
    <div className="place-search-screen">
      <header className="app-header">
        <h1>場所を検索</h1>
        <button onClick={onCancel} className="cancel-button">戻る</button>
      </header>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="場所名、住所、キーワードで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button type="submit">検索</button>
      </form>
      
      {/* カテゴリフィルターエリア (プレースホルダー) */}
      <div className="category-filter-area">
        <button>観光</button>
        <button>食事</button>
        <button>ホテル</button>
      </div>

      <div className="search-results-list">
        {searchResults.length > 0 ? (
          searchResults.map(place => (
            <div key={place.id} className="place-result-item" onClick={() => onSelectPlace(place)}>
              <h4>{place.name}</h4>
              <p>{place.address}</p>
            </div>
          ))
        ) : (
          <p>検索結果はありません。</p>
        )}
      </div>
    </div>
  );
}

export default PlaceSearchScreen;
