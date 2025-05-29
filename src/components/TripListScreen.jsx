import React, { useState } from 'react';
import TripCard from './TripCard'; // TripCardをインポート
// App.css は App.jsx でインポートされているので、ここでは不要か、
// もしコンポーネント固有のスタイルがあれば別途 TripListScreen.css を作成してインポート
// import './TripListScreen.css';

// 旅行計画一覧画面コンポーネント
function TripListScreen({ trips, onAddNewPlan, onEditPlan, onSelectTrip, onViewMemories, onShowProfileEdit, onShowPublicTripsSearch }) { // onShowPublicTripsSearch を props に追加
  return (
    <div className="trip-list-screen">
      <header className="app-header">
        <h1>旅行計画一覧</h1>
        <div> {/* 右側のボタンをグループ化 */}
          <button className="public-trips-search-button" onClick={onShowPublicTripsSearch} title="公開旅程を探す">🌐</button> {/* 公開旅程検索ボタンを追加 */}
          <button className="profile-button" onClick={onShowProfileEdit} title="プロフィール編集">👤</button>
          <button className="add-trip-button" onClick={onAddNewPlan}>+</button>
        </div>
      </header>
      
      <div className="search-filter-area">
        <input type="text" placeholder="計画名や目的地で検索..." className="search-bar" />
      </div>

      <div className="trip-list">
        {trips.length > 0 ? (
          trips.map(trip => (
            // TripCard自体にonSelectTripとonViewMemoriesを渡すように変更
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onEdit={() => onEditPlan(trip)} 
              onSelect={() => onSelectTrip(trip)}
              onViewMemories={() => onViewMemories(trip.id)} 
            />
          ))
        ) : (
          <div className="empty-trip-list">
            <p>まだ旅行計画がありません。</p>
            <button className="add-trip-button-large" onClick={onAddNewPlan}>新しい計画を作成しましょう！</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripListScreen;
