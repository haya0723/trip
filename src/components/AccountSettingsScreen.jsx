import React from 'react';
// import './AccountSettingsScreen.css'; // 必要に応じて作成

function AccountSettingsScreen({ userEmail, onEditProfile, onChangeEmail, onChangePassword, onLogout, onDeleteAccount, onBack }) {
  return (
    <div className="account-settings-screen">
      <header className="app-header">
        <h1>アカウント設定</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      <div className="settings-list">
        <div className="settings-item" onClick={onEditProfile}>
          <span className="settings-item-label">プロフィール編集</span>
          <span className="settings-item-arrow">{'>'}</span>
        </div>
        
        <div className="settings-item" onClick={onChangeEmail}>
          <span className="settings-item-label">メールアドレス変更</span>
          <span className="settings-item-value">{userEmail || '未設定'}</span>
          <span className="settings-item-arrow">{'>'}</span>
        </div>

        <div className="settings-item" onClick={onChangePassword}>
          <span className="settings-item-label">パスワード変更</span>
          <span className="settings-item-arrow">{'>'}</span>
        </div>
        
        {/* TODO: 通知設定、連携サービス設定など */}
        {/* 
        <div className="settings-item" onClick={() => console.log('通知設定 (未実装)')}>
          <span className="settings-item-label">通知設定</span>
          <span className="settings-item-arrow">></span>
        </div>
        */}

        <div className="settings-item settings-item-action" onClick={onLogout}>
          <span>ログアウト</span>
        </div>

        <div className="settings-item settings-item-danger" onClick={onDeleteAccount}>
          <span>アカウントを削除</span>
        </div>
      </div>
    </div>
  );
}

export default AccountSettingsScreen;
