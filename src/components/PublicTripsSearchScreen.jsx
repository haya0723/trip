import React, { useState } from 'react';
// import './PublicTripsSearchScreen.css'; // 必要に応じて作成

// ダミーの公開旅程データ
const dummyPublicTrips = [
  { id: 'pub1', title: '週末行く！東京下町グルメ旅', author: '旅好き太郎', destinations: '浅草、月島', duration: '1泊2日', coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop', tags: ['グルメ', '下町'] },
  { id: 'pub2', title: '絶景！富士山一周ドライブ', author: '山ガール花子', destinations: '富士五湖', duration: '日帰り', coverImage: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1000&auto=format&fit=crop', tags: ['絶景', 'ドライブ'] },
];

function PublicTripCard({ trip, onSelect }) { // 公開旅程用のカード（TripCardと似ているが別コンポーネント）
  return (
    <div className="public-trip-card" onClick={() => onSelect(trip)}>
      {trip.coverImage && <img src={trip.coverImage} alt={trip.title} className="public-trip-card-image" />}
      <div className="public-trip-card-content">
        <h3>{trip.title}</h3>
        <p>作成者: {trip.author}</p>
        <p>主な目的地: {trip.destinations}</p>
        <p>期間: {trip.duration}</p>
        <div className="tags">
          {trip.tags?.map(tag => <span key={tag} className="tag">#{tag}</span>)}
        </div>
      </div>
    </div>
  );
}

function PublicTripsSearchScreen({ onSelectPublicTrip, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(dummyPublicTrips);
  // TODO: 実際の検索ロジック

  const handleSearch = (e) => {
    e.preventDefault();
    // ダミー検索
    setResults(dummyPublicTrips.filter(t => 
      t.title.includes(searchTerm) || 
      t.destinations.includes(searchTerm) ||
      t.tags.some(tag => tag.includes(searchTerm))
    ));
  };

  return (
    <div className="public-trips-search-screen">
      <header className="app-header">
        <h1>公開旅程を探す</h1>
        <button onClick={onCancel} className="back-button">戻る</button>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="目的地、キーワードで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button type="submit">検索</button>
      </form>

      <div className="filter-sort-area">
        {/* フィルターボタン群 (プレースホルダー) */}
        <button>目的地</button>
        <button>期間</button>
        <button>テーマ</button>
        {/* ソートオプション (プレースホルダー) */}
        <select>
          <option value="popular">人気順</option>
          <option value="newest">新着順</option>
        </select>
      </div>

      <div className="public-trips-list">
        {results.length > 0 ? (
          results.map(trip => <PublicTripCard key={trip.id} trip={trip} onSelect={onSelectPublicTrip} />)
        ) : (
          <p>条件に合う旅程が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
}

export default PublicTripsSearchScreen;
