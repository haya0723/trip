import React from 'react';
// import './BottomNavBar.css'; // 必要に応じて作成

function BottomNavBar({ currentScreen, onNavigate }) {
  // ナビゲーションアイテムの定義
  // key: App.jsx の currentScreen に対応する値
  // label: 表示名
  // icon: 表示アイコン (ここでは絵文字で代用)
  const navItems = [
    { key: 'tripList', label: '計画一覧', icon: '📅' },
    { key: 'publicTripsSearch', label: '探す', icon: '🔍' },
    // { key: 'notifications', label: '通知', icon: '🔔' }, // 通知画面は未作成
    { key: 'myProfile', label: 'マイページ', icon: '👤' }, // key を 'myProfile' に、label を 'マイページ' に変更
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button
          key={item.key}
          className={`nav-item ${currentScreen === item.key ? 'active' : ''}`}
          onClick={() => onNavigate(item.key)}
          title={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNavBar;
