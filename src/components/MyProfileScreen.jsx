import React from 'react';
// import './MyProfileScreen.css'; // 必要に応じて作成

function MyProfileScreen({ userProfile, onEditProfile, onShowAccountSettings, onLogout, onShowFavoritePlaces, onShowBackendTest }) { // onShowBackendTest を追加
  // console.log('[MyProfileScreen] Received userProfile:', JSON.stringify(userProfile, null, 2)); // デバッグ用に追加
  if (!userProfile) {
    // ユーザープロファイルがない場合は、ローディング表示やエラーメッセージなどを表示
    // ここでは簡略化のため、何も表示しないか、ログインを促すメッセージを表示
    return (
      <div className="my-profile-screen auth-screen">
        <p>プロフィール情報を読み込めませんでした。ログインしているか確認してください。</p>
      </div>
    );
  }

  return (
    <div className="my-profile-screen">
      <header className="app-header">
        <h1>マイプロフィール</h1>
        {/* 右上にログアウトボタンなどを配置しても良い */}
      </header>

      <div className="profile-summary card-style" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className="avatar-preview" style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 15px auto', backgroundColor: '#e0e0e0', overflow: 'hidden' }}>
          {userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '3em', color: '#aaa' }}>👤</div>
          )}
        </div>
        <h2>{userProfile.nickname || 'ニックネーム未設定'}</h2>
        <p style={{ color: '#555', fontSize: '0.9em', whiteSpace: 'pre-wrap', margin: '0 auto 15px auto', maxWidth: '400px' }}>
          {userProfile.bio || '自己紹介はまだありません。'}
        </p>
        {userProfile.email && <p style={{ color: '#777', fontSize: '0.8em' }}>メール: {userProfile.email}</p>}
        <button onClick={onEditProfile} className="edit-profile-button" style={{marginTop: '15px', padding: '10px 20px'}}>プロフィールを編集</button>
      </div>

      <div className="profile-actions-list">
        {/* <div className="settings-item" onClick={() => console.log("過去の旅行履歴へ")}>
          <span className="settings-item-label">旅行履歴</span>
          <span className="settings-item-arrow">></span>
        </div>
        <div className="settings-item" onClick={() => console.log("お気に入りスポットへ")}>
          <span className="settings-item-label">お気に入りスポット</span>
          <span className="settings-item-arrow">></span>
        </div> */}
        {onShowFavoritePlaces && (
          <div className="settings-item" onClick={onShowFavoritePlaces} style={{cursor: 'pointer', padding: '15px', borderBottom: '1px solid #eee', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: userProfile.isBusinessAccount ? '0' : '8px 8px 0 0' /* 条件分岐例 */}}>
            <span className="settings-item-label">お気に入り場所リスト</span>
            <span className="settings-item-arrow" style={{float: 'right'}}>{'>'}</span>
          </div>
        )}
        <div className="settings-item" onClick={onShowAccountSettings} style={{cursor: 'pointer', padding: '15px', borderBottom: '1px solid #eee', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: !onShowFavoritePlaces ? '8px 8px 0 0' : '0'}}>
          <span className="settings-item-label">アカウント設定</span>
          <span className="settings-item-arrow" style={{float: 'right'}}>{'>'}</span>
        </div>
         <div className="settings-item settings-item-danger" onClick={onLogout} style={{cursor: 'pointer', padding: '15px', background: 'white', borderRadius: onShowBackendTest ? '0' : '0 0 8px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '1px'}}>
          <span className="settings-item-label">ログアウト</span>
        </div>
        {/* 開発者向けテストボタン */}
        {onShowBackendTest && (
          <div className="settings-item" onClick={onShowBackendTest} style={{cursor: 'pointer', padding: '15px', borderTop: '1px solid #eee', background: '#f0f0f0', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '10px', textAlign: 'center' }}>
            <span className="settings-item-label" style={{color: '#337ab7'}}>Backend API Test</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfileScreen;
