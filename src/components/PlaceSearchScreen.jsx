import React, { useState, useEffect } from 'react';
// import './PlaceSearchScreen.css'; // 必要に応じて作成

function PlaceSearchScreen({ onSelectPlace, onCancel, context }) { // context prop を追加
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  // ダミーの場所データ (isLodging フラグを追加)
  const dummyPlaces = [
    { id: 'place1', name: '東京タワー', address: '東京都港区芝公園４丁目２−８', category: '観光', isLodging: false },
    { id: 'place2', name: '金閣寺', address: '京都府京都市北区金閣寺町１', category: '観光', isLodging: false },
    { id: 'place3', name: '札幌グランドホテル', address: '札幌市中央区北1条西4丁目', category: 'ホテル', isLodging: true },
    { id: 'place4', name: '沖縄マリオットリゾート＆スパ', address: '沖縄県名護市喜瀬１４９０−１', category: 'ホテル', isLodging: true },
    { id: 'place5', name: 'ラーメン一蘭 新宿中央東口店', address: '東京都新宿区新宿３丁目３４−１１', category: '食事', isLodging: false },
    { id: 'place6', name: '渋谷スカイ', address: '東京都渋谷区渋谷２丁目２４−１２', category: '観光', isLodging: false },
    { id: 'place7', name: '帝国ホテル東京', address: '東京都千代田区内幸町１丁目１−１', category: 'ホテル', isLodging: true },
  ];

  const filterAndSortResults = () => {
    let results = [...dummyPlaces];
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (lowerSearchTerm) {
      results = results.filter(place => 
        place.name.toLowerCase().includes(lowerSearchTerm) ||
        place.address.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (activeCategory) {
      results = results.filter(place => place.category === activeCategory);
    }
    
    // ホテル設定コンテキストの場合、宿泊施設を優先表示
    if (context && context.from === 'setHotelForDay') {
      results.sort((a, b) => {
        if (a.isLodging && !b.isLodging) return -1;
        if (!a.isLodging && b.isLodging) return 1;
        return 0;
      });
      // もしカテゴリフィルターが未選択なら、ホテルをデフォルトにする
      if (!activeCategory) {
        results = results.filter(place => place.isLodging);
      }
    }
    setSearchResults(results);
  };

  useEffect(() => {
    filterAndSortResults();
  }, [searchTerm, activeCategory, context]);


  const handleSearch = (e) => {
    e.preventDefault();
    filterAndSortResults(); // useEffectで処理されるので、ここでは不要かも
  };
  
  const handleCategoryFilter = (category) => {
    setActiveCategory(prev => prev === category ? null : category);
  };


  return (
    <div className="place-search-screen">
      <header className="app-header">
        <h1>場所を検索</h1>
        <button onClick={onCancel} className="cancel-button">戻る</button>
      </header>
      <form onSubmit={handleSearch} className="search-form" style={{padding: '10px', background: '#f0f0f0', marginBottom: '15px'}}>
        <input
          type="text"
          placeholder="場所名、住所、キーワードで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
          style={{width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
        {/* 検索ボタンはEnterキーで代替できるので削除も検討 */}
        {/* <button type="submit">検索</button> */} 
      </form>
      
      <div className="category-filter-area" style={{padding: '0 10px 10px 10px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
        {['観光', '食事', 'ホテル', 'ショッピング', 'その他'].map(category => (
          <button 
            key={category} 
            onClick={() => handleCategoryFilter(category)}
            className={activeCategory === category ? 'active-filter' : ''}
            style={{padding: '8px 12px', border: `1px solid ${activeCategory === category ? '#007bff' : '#ccc'}`, background: activeCategory === category ? '#007bff' : 'white', color: activeCategory === category ? 'white' : 'black', borderRadius: '4px', cursor: 'pointer'}}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="search-results-list" style={{padding: '0 10px'}}>
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
