import React, { useState, useEffect } from 'react';
// import './HotelRecommendationsScreen.css'; // 必要に応じて作成

// ダミーの周辺スポットデータ
const initialDummyNearbyPlaces = [
  { id: 'nearby1', name: '美味しいラーメン屋「麺屋ホテル前」', category: '食事', distance: '徒歩3分', rating: 4.5, hours: '11:00 - 22:00', status: '営業中' },
  { id: 'nearby2', name: '便利なコンビニ「エブリマート」', category: 'コンビニ', distance: '徒歩1分', rating: 4.0, hours: '24時間営業', status: '営業中' },
  { id: 'nearby3', name: '歴史博物館', category: '観光', distance: 'バスで10分', rating: 4.2, hours: '09:00 - 17:00', status: '営業時間外' },
  { id: 'nearby4', name: '駅前カフェ「ひとやすみ」', category: 'カフェ', distance: '徒歩5分', rating: 4.0, hours: '08:00 - 19:00', status: '営業中' },
  { id: 'nearby5', name: 'おしゃれバル「月あかり」', category: '食事', distance: '徒歩7分', rating: 4.7, hours: '17:00 - 24:00', status: 'まもなく開店' },
  { id: 'nearby6', name: '公園の売店', category: 'ショッピング', distance: '徒歩10分', rating: 3.5, hours: '10:00 - 16:00', status: '営業時間外' },
];

function HotelRecommendationsScreen({ hotel, onBack, onSelectPlace, onAICourseRequest, aiRecommendedCourses }) {
  const [filters, setFilters] = useState({
    category: 'all',
    distance: 'any',
    rating: 0, 
    openNow: false, 
  });
  const [filteredResults, setFilteredResults] = useState(initialDummyNearbyPlaces);
  const [showAICourseModal, setShowAICourseModal] = useState(false);
  const [aiCourseParams, setAiCourseParams] = useState({
    categories: [],
    duration: '2', // hours
  });

  useEffect(() => {
    let results = [...initialDummyNearbyPlaces];
    if (filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category);
    }
    // TODO: 距離フィルターのロジック (checkDistance関数の実装が必要)
    // if (filters.distance !== 'any') {
    //   results = results.filter(p => checkDistance(p.distance, filters.distance));
    // }
    if (filters.rating > 0) {
      results = results.filter(p => p.rating >= filters.rating);
    }
    if (filters.openNow) {
      results = results.filter(p => p.status === '営業中'); // より厳密には現在時刻と営業時間を比較
    }
    setFilteredResults(results);
  }, [filters]);


  if (!hotel) {
    return <div className="hotel-recommendations-screen" style={{padding: '20px'}}><p>ホテル情報が指定されていません。</p><button onClick={onBack}>戻る</button></div>;
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar && '☆'} {/* 半星は簡略化して空星で */}
        {'☆'.repeat(emptyStars)}
        <span style={{fontSize: '0.8em', marginLeft: '4px'}}>({rating.toFixed(1)})</span>
      </>
    );
  };


  return (
    <div className="hotel-recommendations-screen">
      <header className="app-header">
        <h1>{hotel.name || 'ホテル'} 周辺のおすすめ</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      <div className="hotel-info-summary card-style" style={{marginBottom: '15px'}}>
        <p><strong>対象ホテル:</strong> {hotel.name}</p>
        {hotel.address && <p style={{fontSize: '0.9em'}}>住所: {hotel.address}</p>}
      </div>

      <div className="recommendation-filters card-style" style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px', padding: '15px'}}>
        <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
          <option value="all">全カテゴリ</option>
          <option value="食事">食事</option>
          <option value="観光">観光</option>
          <option value="コンビニ">コンビニ</option>
          <option value="カフェ">カフェ</option>
          <option value="ショッピング">ショッピング</option>
        </select>
        <select value={filters.distance} onChange={(e) => handleFilterChange('distance', e.target.value)}>
          <option value="any">距離指定なし</option>
          <option value="徒歩5分圏内">徒歩5分圏内</option>
          <option value="1km圏内">1km圏内</option>
        </select>
        <select value={filters.rating} onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}>
          <option value="0">評価指定なし</option>
          <option value="4.5">4.5★以上</option>
          <option value="4.0">4.0★以上</option>
          <option value="3.5">3.5★以上</option>
        </select>
        <label style={{display: 'flex', alignItems: 'center'}}>
          <input 
            type="checkbox" 
            checked={filters.openNow} 
            onChange={(e) => handleFilterChange('openNow', e.target.checked)} 
            style={{marginRight: '5px'}}
          /> 
          現在営業中
        </label>
      </div>

      <div className="recommendation-results-list">
        {filteredResults.length > 0 ? (
          filteredResults.map(place => (
            <div key={place.id} className="recommendation-item card-style" onClick={() => onSelectPlace(place)} style={{marginBottom: '10px'}}>
              <h4>{place.name} <span style={{fontSize: '0.8em', color: '#555'}}>({place.category})</span></h4>
              <p style={{fontSize: '0.9em', margin: '5px 0'}}>距離: {place.distance}</p>
              {place.rating && <p style={{fontSize: '0.9em', margin: '5px 0'}}>評価: {renderStars(place.rating)}</p>}
              {place.hours && <p style={{fontSize: '0.9em', margin: '5px 0'}}>営業時間: {place.hours} <span style={{fontWeight: 'bold', color: place.status === '営業中' ? 'green' : (place.status === '営業時間外' ? 'red' : 'orange')}}>({place.status})</span></p>}
            </div>
          ))
        ) : (
          <p>条件に合うおすすめスポットが見つかりませんでした。</p>
        )}
      </div>

      <div className="ai-course-suggestion-section card-style" style={{marginTop: '20px', padding: '15px'}}>
        <h4>AIコース提案</h4>
        <p>AIにホテル周辺の散策コースを提案してもらいましょう。</p>
        <button onClick={() => setShowAICourseModal(true)} className="action-button">お散歩コースを提案してもらう</button>
        {/* TODO: 半日観光プラン提案ボタンなど */}
      </div>

      {showAICourseModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{width: '90%', maxWidth: '500px'}}>
            <h3>AIコース提案リクエスト</h3>
            <div className="form-section">
              <label>興味のあるカテゴリ (複数選択可):</label>
              <div>
                {['食事', '観光', 'カフェ', 'ショッピング'].map(cat => (
                  <label key={cat} style={{marginRight: '10px', display: 'inline-block'}}>
                    <input 
                      type="checkbox" 
                      value={cat}
                      checked={aiCourseParams.categories.includes(cat)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAiCourseParams(prev => ({
                          ...prev,
                          categories: checked 
                            ? [...prev.categories, cat] 
                            : prev.categories.filter(c => c !== cat)
                        }));
                      }}
                    /> {cat}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-section">
              <label htmlFor="ai-duration">希望する所要時間:</label>
              <select 
                id="ai-duration" 
                value={aiCourseParams.duration} 
                onChange={(e) => setAiCourseParams(prev => ({...prev, duration: e.target.value}))}
              >
                <option value="1">約1時間</option>
                <option value="2">約2時間</option>
                <option value="3">約3時間</option>
                <option value="4">半日 (約4時間)</option>
              </select>
            </div>
            <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <button onClick={() => setShowAICourseModal(false)} className="cancel-button">キャンセル</button>
              <button 
                onClick={() => {
                  if (onAICourseRequest) {
                    onAICourseRequest(hotel, aiCourseParams);
                  }
                  setShowAICourseModal(false);
                }} 
                className="action-button"
              >
                提案をリクエスト
              </button>
            </div>
          </div>
        </div>
      )}

      {aiRecommendedCourses && aiRecommendedCourses.length > 0 && (
        <div className="ai-courses-results-section card-style" style={{marginTop: '20px', padding: '15px'}}>
          <h4>AI提案コース</h4>
          {aiRecommendedCourses.map(course => (
            <div key={course.id} className="ai-course-item" style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
              <h5>{course.name}</h5>
              <p><strong>所要時間:</strong> {course.duration}</p>
              <p><strong>交通手段:</strong> {course.transport}</p>
              <p><strong>主なスポット:</strong></p>
              <ul>
                {course.spots.map((spot, idx) => (
                  <li key={idx}>{spot.name} (滞在目安: {spot.time})</li>
                ))}
              </ul>
              {/* TODO: 地図表示ボタン、旅程に追加ボタン */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelRecommendationsScreen;
