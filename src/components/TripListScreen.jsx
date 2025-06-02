import React, { useState, useEffect } from 'react';
import TripCard from './TripCard';
// import './TripListScreen.css'; // 必要に応じて

const tripStatusesForFilter = ['すべて', '計画中', '予約済み', '旅行中', '完了', 'キャンセル'];

function TripListScreen({ trips, onAddNewPlan, onEditPlan, onSelectTrip, onViewMemories, onShowProfileEdit, onShowPublicTripsSearch }) {
  const [statusFilter, setStatusFilter] = useState('すべて');
  const [searchTerm, setSearchTerm] = useState(''); // 検索語用のstate
  const [displayedTrips, setDisplayedTrips] = useState(trips || []);

  useEffect(() => {
    if (!trips) {
      setDisplayedTrips([]);
      return;
    }
    let filtered = [...trips];

    // ステータスフィルター
    if (statusFilter !== 'すべて') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    // 検索語フィルター (計画名または目的地)
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(trip => 
        (trip.name && trip.name.toLowerCase().includes(lowerSearchTerm)) ||
        (trip.destinations && trip.destinations.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // 完了済みのものを最後に表示するソート（任意）
    filtered.sort((a, b) => {
        if (a.status === '完了' && b.status !== '完了') return 1;
        if (a.status !== '完了' && b.status === '完了') return -1;
        // 必要に応じて他のソート条件（例：作成日順など）を追加
        return 0; 
    });

    setDisplayedTrips(filtered);
  }, [trips, statusFilter, searchTerm]);

  if (!trips) {
    return <div>旅行データがありません。</div>;
  }

  return (
    <div className="trip-list-screen">
      <header className="app-header">
        <h1>マイトリップ</h1>
        <div>
          <button onClick={onShowPublicTripsSearch} style={{marginRight: '10px'}}>公開旅程を探す</button>
          <button onClick={onShowProfileEdit}>マイページ</button>
        </div>
      </header>
      
      <div className="trip-list-controls" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <input 
            type="text" 
            placeholder="計画名・目的地で検索..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
          >
            {tripStatusesForFilter.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <button onClick={onAddNewPlan} className="add-new-plan-button action-button">新しい計画を作成</button>
      </div>

      {displayedTrips.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {statusFilter === 'すべて' && !searchTerm ? 'まだ旅行プランがありません。新しい計画を作成しましょう！' : '条件に合う旅行プランが見つかりませんでした。'}
        </p>
      ) : (
        <div className="trip-list">
          {displayedTrips.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onEdit={() => onEditPlan(trip)} 
              onSelect={() => onSelectTrip(trip)}
              onViewMemories={() => onViewMemories(trip.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TripListScreen;
