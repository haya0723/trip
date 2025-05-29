import React, { useState } from 'react';
// import './RouteOptionsScreen.css'; // 必要に応じて作成

// ダミーの移動手段データ
const dummyRouteOptions = [
  { id: 'route1', mode: '電車', duration: '約30分', cost: '250円', details: 'JR山手線経由、乗り換え1回' },
  { id: 'route2', mode: 'バス', duration: '約45分', cost: '210円', details: '都営バス 系統XX' },
  { id: 'route3', mode: 'タクシー', duration: '約20分', cost: '1500円～2000円', details: '交通状況により変動' },
  { id: 'route4', mode: '徒歩', duration: '約60分', cost: '0円', details: '約4km' },
];

function RouteOptionsScreen({ origin, destination, onSelectRoute, onCancel }) {
  const [options, setOptions] = useState(dummyRouteOptions);
  // TODO: origin, destination を元に実際にAPIで経路検索する処理

  return (
    <div className="route-options-screen">
      <header className="app-header">
        <h1>移動手段を選択</h1>
        <button onClick={onCancel} className="cancel-button">戻る</button>
      </header>

      <div className="route-info">
        <p><strong>出発地:</strong> {origin?.name || '未設定'}</p>
        <p><strong>目的地:</strong> {destination?.name || '未設定'}</p>
      </div>

      {/* 移動手段の好みフィルター (プレースホルダー) */}
      <div className="route-preference-filter">
        <button>時間優先</button>
        <button>費用優先</button>
        <button>乗換少</button>
      </div>

      <div className="route-options-list">
        {options.map(opt => (
          <div key={opt.id} className="route-option-item" onClick={() => onSelectRoute(opt)}>
            <h4>{opt.mode}</h4>
            <p>所要時間: {opt.duration}</p>
            <p>費用: {opt.cost}</p>
            <p className="route-details">{opt.details}</p>
          </div>
        ))}
        {options.length === 0 && <p>利用可能な移動手段が見つかりません。</p>}
      </div>
    </div>
  );
}

export default RouteOptionsScreen;
