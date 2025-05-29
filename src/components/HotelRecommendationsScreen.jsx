import React, { useState } from 'react';
// import './HotelRecommendationsScreen.css'; // 必要に応じて作成

// ダミーの周辺スポットデータ
const dummyNearbyPlaces = [
  { id: 'nearby1', name: '美味しいラーメン屋「麺屋ホテル前」', category: '食事', distance: '徒歩3分', rating: 4.5 },
  { id: 'nearby2', name: '便利なコンビニ「エブリマート」', category: 'コンビニ', distance: '徒歩1分', rating: 4.0 },
  { id: 'nearby3', name: '歴史博物館', category: '観光', distance: 'バスで10分', rating: 4.2 },
  { id: 'nearby4', name: '駅前カフェ「ひとやすみ」', category: 'カフェ', distance: '徒歩5分', rating: 4.0 },
];

function HotelRecommendationsScreen({ hotel, onBack, onSelectPlace }) {
  // hotel オブジェクトにはホテル名、住所、座標などが含まれる想定
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', '食事', '観光', 'コンビニ' など
  const [distanceFilter, setDistanceFilter] = useState('any'); // 'any', '徒歩5分圏内', '1km圏内' など
  const [results, setResults] = useState(dummyNearbyPlaces);
  // TODO: 実際のフィルターロジックとAPI連携

  if (!hotel) {
    return <div>ホテル情報が指定されていません。<button onClick={onBack}>戻る</button></div>;
  }

  return (
    <div className="hotel-recommendations-screen">
      <header className="app-header">
        <h1>{hotel.name || 'ホテル'} 周辺のおすすめ</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      <div className="hotel-info-summary">
        <p><strong>対象ホテル:</strong> {hotel.name}</p>
        {/* <p>住所: {hotel.address}</p> */}
      </div>

      <div className="recommendation-filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">全カテゴリ</option>
          <option value="食事">食事</option>
          <option value="観光">観光</option>
          <option value="コンビニ">コンビニ</option>
          <option value="カフェ">カフェ</option>
        </select>
        <select value={distanceFilter} onChange={(e) => setDistanceFilter(e.target.value)}>
          <option value="any">距離指定なし</option>
          <option value="徒歩5分圏内">徒歩5分圏内</option>
          <option value="1km圏内">1km圏内</option>
        </select>
        {/* TODO: 評価フィルター、営業時間フィルターなど */}
      </div>

      <div className="recommendation-results-list">
        {results.length > 0 ? (
          results.filter(place => 
            (categoryFilter === 'all' || place.category === categoryFilter) 
            // && (distanceFilter === 'any' || checkDistance(place.distance, distanceFilter)) // 距離フィルターは別途実装
          ).map(place => (
            <div key={place.id} className="recommendation-item" onClick={() => onSelectPlace(place)}>
              <h4>{place.name} ({place.category})</h4>
              <p>距離: {place.distance} | 評価: {place.rating}★</p>
            </div>
          ))
        ) : (
          <p>条件に合うおすすめスポットが見つかりませんでした。</p>
        )}
      </div>
      
      {/* TODO: AIによるコース提案ボタン */}
      {/* <button className="ai-course-suggest-button">AIにお散歩コースを提案してもらう</button> */}
    </div>
  );
}

export default HotelRecommendationsScreen;
