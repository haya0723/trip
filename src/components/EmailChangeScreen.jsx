import React, { useState } from 'react';
// import './EmailChangeScreen.css'; // 必要に応じて作成

function EmailChangeScreen({ currentEmail, onSendConfirm, onCancel }) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!newEmail || !password) {
      setError('新しいメールアドレスと現在のパスワードを入力してください。');
      return;
    }
    // 簡単なメール形式バリデーション (より厳密なものはライブラリ使用推奨)
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setError('有効なメールアドレスを入力してください。');
      return;
    }
    if (newEmail === currentEmail) {
      setError('新しいメールアドレスが現在のメールアドレスと同じです。');
      return;
    }
    onSendConfirm(password, newEmail);
  };

  return (
    <div className="email-change-screen auth-screen">
      <header className="app-header">
        <h1>メールアドレス変更</h1>
      </header>

      <form onSubmit={handleSubmit} className="auth-form" style={{marginTop: 0}}>
        <p style={{fontSize: '0.9em', marginBottom: '15px'}}>現在のメールアドレス: {currentEmail || '取得できませんでした'}</p>
        
        <div className="form-section">
          <label htmlFor="new-email">新しいメールアドレス:</label>
          <input 
            type="email" 
            id="new-email" 
            value={newEmail} 
            onChange={(e) => setNewEmail(e.target.value)} 
            required 
            placeholder="new.email@example.com"
          />
        </div>

        <div className="form-section">
          <label htmlFor="current-password-for-email">現在のパスワード (確認用):</label>
          <input 
            type="password" 
            id="current-password-for-email" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="現在のパスワードを入力"
          />
        </div>

        {error && <p className="error-message" style={{marginTop: '10px'}}>{error}</p>}

        <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
          <button type="button" onClick={onCancel} className="cancel-button">キャンセル</button>
          <button type="submit" className="auth-button" style={{width: 'auto'}}>確認メールを送信</button>
        </div>
      </form>
    </div>
  );
}

export default EmailChangeScreen;
