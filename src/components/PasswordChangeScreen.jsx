import React, { useState } from 'react';
// import './PasswordChangeScreen.css'; // 必要に応じて作成

function PasswordChangeScreen({ onConfirm, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmNewPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません。');
      return;
    }
    if (newPassword.length < 8) { // 簡単なバリデーション例
      setError('新しいパスワードは8文字以上で入力してください。');
      return;
    }
    // ここで実際の現在のパスワード検証とパスワード変更処理を行う (今回はダミー)
    onConfirm(currentPassword, newPassword);
  };

  return (
    <div className="password-change-screen auth-screen">
      <header className="app-header">
        <h1>パスワード変更</h1>
      </header>

      <form onSubmit={handleSubmit} className="auth-form" style={{marginTop: 0}}>
        <div className="form-section">
          <label htmlFor="current-password">現在のパスワード:</label>
          <input 
            type="password" 
            id="current-password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            required 
          />
        </div>

        <div className="form-section">
          <label htmlFor="new-password">新しいパスワード:</label>
          <input 
            type="password" 
            id="new-password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
            minLength="8"
          />
        </div>

        <div className="form-section">
          <label htmlFor="confirm-new-password">新しいパスワード (確認用):</label>
          <input 
            type="password" 
            id="confirm-new-password" 
            value={confirmNewPassword} 
            onChange={(e) => setConfirmNewPassword(e.target.value)} 
            required 
            minLength="8"
          />
        </div>

        {error && <p className="error-message" style={{marginTop: '10px'}}>{error}</p>}

        <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
          <button type="button" onClick={onCancel} className="cancel-button">キャンセル</button>
          <button type="submit" className="auth-button" style={{width: 'auto'}}>パスワードを変更</button>
        </div>
      </form>
    </div>
  );
}

export default PasswordChangeScreen;
