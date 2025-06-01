import React, { useState, useEffect } from 'react';
// import './ProfileEditScreen.css'; // 必要に応じて作成

function ProfileEditScreen({ userProfile, onSaveProfile, onCancel }) {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); // アップロード用ファイルオブジェクト
  const [avatarPreview, setAvatarPreview] = useState(''); // 表示用URL (DataURLまたは既存URL)

  useEffect(() => {
    if (userProfile) {
      setNickname(userProfile.nickname || '');
      setBio(userProfile.bio || '');
      setAvatarPreview(userProfile.avatarUrl || ''); // 初期表示は既存のURL
      setAvatarFile(null); // 編集開始時はファイルをリセット
    }
  }, [userProfile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // ファイルオブジェクトを保持
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // DataURLをプレビューに設定
      };
      reader.readAsDataURL(file);
    } else {
      // ファイル選択がキャンセルされた場合、既存の画像に戻すか、クリアするか
      // ここでは、もしuserProfileにavatarUrlがあればそれに戻す
      setAvatarFile(null);
      setAvatarPreview(userProfile?.avatarUrl || ''); 
    }
  };

  const handleSave = () => {
    // avatarPreview には、新しい画像のDataURLか、変更がない場合は既存のavatarUrlが入っている
    onSaveProfile({
      nickname,
      bio,
      avatarUrl: avatarPreview, 
      // avatarFile を渡してApp.jsx側でアップロード処理をする場合は別途対応
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
        
      </div>
    </div>
  );
}

export default ProfileEditScreen;
