import React, { useState, useEffect } from 'react';
import { initialDummyPublicTrips } from '../data/dummyData'; // インポート元を変更
// import './PublicTripsSearchScreen.css'; // 必要に応じて作成

function PublicTripCard({ trip, onSelect }) {
  return (
    <div className="public-trip-card card-style" onClick={() => onSelect(trip)} style={{marginBottom: '15px'}}>
      {trip.coverImage && <img src={trip.coverImage} alt={trip.title} className="public-trip-card-image" style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px 4px 0 0'}} />}
      <div className="public-trip-card-content" style={{padding: '10px'}}>
        <h3 style={{marginTop: 0, marginBottom: '5px'}}>{trip.title}</h3>
        <p style={{fontSize: '0.8em', color: '#555', margin: '0 0 5px 0'}}>作成者: {trip.author}</p>
        <p style={{fontSize: '0.9em', margin: '0 0 5px 0'}}>主な目的地: {trip.destinations.join(', ')}</p>
        <p style={{fontSize: '0.9em', margin: '0 0 10px 0'}}>期間: {trip.duration}</p>
        <div className="tags" style={{marginBottom: '5px'}}>
          {trip.tags?.map(tag => <span key={tag} className="tag" style={{fontSize: '0.75em', background: '#eee', padding: '2px 6px', borderRadius: '3px', marginRight: '5px'}}>#{tag}</span>)}
        </div>
        <p style={{fontSize: '0.8em', color: '#777'}}>評価: {trip.rating}★ | コピー数: {trip.copiedCount}</p>
      </div>
    </div>
  );
}

function PublicTripsSearchScreen({ onSelectPublicTrip, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    destination: '',
    duration: 'any', // 'any', 'day_trip', '1_night', '2_nights', '3_plus_nights'
    theme: '',
  });
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'newest', 'rating'
  const [filteredAndSortedResults, setFilteredAndSortedResults] = useState(initialDummyPublicTrips);

  useEffect(() => {
    let results = [...initialDummyPublicTrips];

    // 検索語フィルター
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      results = results.filter(trip => 
        trip.title.toLowerCase().includes(lowerSearchTerm) ||
        trip.destinations.some(d => d.toLowerCase().includes(lowerSearchTerm)) ||
        (trip.tags && trip.tags.some(t => t.toLowerCase().includes(lowerSearchTerm))) || // tags が存在するかチェック
        (trip.description && trip.description.toLowerCase().includes(lowerSearchTerm)) ||
        trip.author.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 目的地フィルター
    if (filters.destination.trim()) {
      const lowerDest = filters.destination.toLowerCase();
      results = results.filter(trip => trip.destinations.some(d => d.toLowerCase().includes(lowerDest)));
    }

    // 期間フィルター
    if (filters.duration !== 'any') {
      results = results.filter(trip => {
        if (filters.duration === 'day_trip') return trip.durationDays === 1;
        if (filters.duration === '1_night') return trip.durationDays === 2;
        if (filters.duration === '2_nights') return trip.durationDays === 3;
        if (filters.duration === '3_plus_nights') return trip.durationDays > 3;
        return true;
      });
    }
    
    // テーマフィルター
    if (filters.theme.trim()) {
      const lowerTheme = filters.theme.toLowerCase();
      results = results.filter(trip => trip.tags && trip.tags.some(t => t.toLowerCase().includes(lowerTheme))); // tags が存在するかチェック
    }

    // ソート
    if (sortBy === 'popular') {
      results.sort((a, b) => (b.copiedCount || 0) - (a.copiedCount || 0)); // copiedCount が存在するかチェック
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // rating が存在するかチェック
    }

    setFilteredAndSortedResults(results);
  }, [searchTerm, filters, sortBy]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="public-trips-search-screen">
      <header className="app-header">
        <h1>公開旅程を探す</h1>
        <button onClick={onCancel} className="back-button">戻る</button>
      </header>

      <div className="search-form" style={{padding: '10px', background: '#f0f0f0', marginBottom: '15px'}}>
        <input
          type="text"
          placeholder="キーワードで検索 (例: 東京 グルメ)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
          style={{width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
        <div className="filter-sort-area" style={{display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center'}}>
          <input 
            type="text" 
            placeholder="目的地 (例: 京都)" 
            value={filters.destination} 
            onChange={(e) => handleFilterChange('destination', e.target.value)}
            style={{padding: '8px', flexGrow: 1, minWidth: '120px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
          <select value={filters.duration} onChange={(e) => handleFilterChange('duration', e.target.value)} style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
            <option value="any">期間指定なし</option>
            <option value="day_trip">日帰り</option>
            <option value="1_night">1泊2日</option>
            <option value="2_nights">2泊3日</option>
            <option value="3_plus_nights">3泊以上</option>
          </select>
          <input 
            type="text" 
            placeholder="テーマ (例: 温泉)" 
            value={filters.theme} 
            onChange={(e) => handleFilterChange('theme', e.target.value)}
            style={{padding: '8px', flexGrow: 1, minWidth: '120px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
            <option value="popular">人気順</option>
            <option value="newest">新着順</option>
            <option value="rating">評価順</option>
          </select>
        </div>
      </div>

      <div className="public-trips-list" style={{padding: '0 10px'}}>
        {filteredAndSortedResults.length > 0 ? (
          filteredAndSortedResults.map(trip => <PublicTripCard key={trip.id} trip={trip} onSelect={onSelectPublicTrip} />)
        ) : (
          <p>条件に合う旅程が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
}

export default PublicTripsSearchScreen;
