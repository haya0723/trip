import React, { useState } from 'react';
// import './ProfileEditScreen.css'; // 必要に応じて作成

function ProfileEditScreen({ userProfile, onSaveProfile, onCancel }) {
  // userProfile には { nickname, bio, location, themes, avatarUrl } などが含まれる想定
  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(userProfile?.avatarUrl || null);
  // TODO: location, themes の state も追加

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      // TODO: 実際のファイルアップロード処理は別途
    }
  };

  const handleSave = () => {
    onSaveProfile({
      nickname,
      bio,
      avatarUrl: avatarPreview, // 実際にはアップロード後のURLなど
      // location, themes なども
    });
  };

  return (
    <div className="profile-edit-screen">
      <header className="app-header">
        <h1>プロフィール編集</h1>
        <div>
          <button onClick={onCancel} className="cancel-button">キャンセル</button>
          <button onClick={handleSave} className="save-button">保存</button>
        </div>
      </header>

      <div className="profile-form">
        <div className="form-section avatar-section">
          <label>プロフィールアイコン</label>
          <div className="avatar-preview">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar Preview" />
            ) : (
              <div className="avatar-placeholder">アイコンなし</div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} id="avatarUpload" style={{display: 'none'}} />
          <label htmlFor="avatarUpload" className="upload-avatar-button">アイコンを変更</label>
        </div>

        <div className="form-section">
          <label htmlFor="nickname">ニックネーム</label>
          <input 
            type="text" 
            id="nickname" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            required 
          />
        </div>

        <div className="form-section">
          <label htmlFor="bio">自己紹介</label>
          <textarea 
            id="bio" 
            rows="4" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            placeholder="あなたの旅行スタイルや好きなことなどを紹介しましょう"
          ></textarea>
        </div>
        
        {/* TODO: 居住地、好きな旅行のテーマなどの入力欄 */}
        {/* 
        <div className="form-section">
          <label htmlFor="location">居住地</label>
          <input type="text" id="location" placeholder="例: 東京都" />
        </div>
        <div className="form-section">
          <label>好きな旅行のテーマ</label>
          <div>タグ入力UI (未実装)</div>
        </div>
        */}
      </div>
    </div>
  );
}

export default ProfileEditScreen;
