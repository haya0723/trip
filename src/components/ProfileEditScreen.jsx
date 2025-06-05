import React, { useState, useEffect } from 'react';
// import './ProfileEditScreen.css'; // 必要に応じて作成

function ProfileEditScreen({ currentUser, userProfile, onSaveProfile, onCancel }) {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState(''); // 手入力用URL
  const [avatarFile, setAvatarFile] = useState(null);    // アップロード用ファイルオブジェクト
  const [avatarPreview, setAvatarPreview] = useState(''); // 表示用URL (DataURLまたは既存/手入力URL)

  useEffect(() => {
    if (userProfile) {
      setNickname(userProfile.nickname || currentUser?.nickname || '');
      setBio(userProfile.bio || '');
      setAvatarUrlInput(userProfile.avatarUrl || ''); // 初期値は既存のURL
      setAvatarPreview(userProfile.avatarUrl || ''); 
      setAvatarFile(null); 
    }
  }, [userProfile, currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); 
      };
      reader.readAsDataURL(file);
      setAvatarUrlInput(''); // ファイル選択時はURL入力をクリア
    }
  };

  const handleUrlInputChange = (e) => {
    const url = e.target.value;
    setAvatarUrlInput(url);
    setAvatarPreview(url); // URL入力時もプレビューを更新
    setAvatarFile(null); // URL入力時はファイル選択をクリア
  };

  const handleSave = () => {
    console.log('[ProfileEditScreen] handleSave called. avatarFile is:', avatarFile); // デバッグログ追加
    const profileData = {
      nickname,
      bio,
      avatarUrl: avatarFile ? undefined : avatarUrlInput, // ファイルがあればURLはundefined、なければ手入力URL
    };
    onSaveProfile(profileData, avatarFile); // ファイルオブジェクトも渡す
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
          <div className="avatar-preview" style={{ width: '100px', height: '100px', border: '1px solid #ccc', marginBottom: '10px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${avatarPreview || 'https://dummyimage.com/100x100/cccccc/969696.png&text=No+Image'})` }}>
            {/* {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            ) : (
              <div className="avatar-placeholder" style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0'}}>アイコンなし</div>
            )} */}
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} id="avatarUpload" style={{display: 'none'}} />
          <label htmlFor="avatarUpload" className="upload-avatar-button" style={{cursor: 'pointer', padding: '8px 12px', background: '#007bff', color: 'white', borderRadius: '4px', display: 'inline-block', marginBottom: '10px'}}>
            アイコンを変更
          </label>
        </div>

        <div className="form-section">
          <label htmlFor="avatarUrlInput">または画像URLを入力:</label>
          <input 
            type="text" 
            id="avatarUrlInput" 
            value={avatarUrlInput} 
            onChange={handleUrlInputChange} 
            placeholder="https://example.com/image.png" 
          />
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
