import React, { useState } from 'react';
// import './PasswordResetScreen.css'; // 必要に応じて作成

function PasswordResetScreen({ onSendResetLink, onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // TODO: 実際のパスワードリセットリンク送信処理 (API連携など)
    if (email) {
      console.log('パスワードリセットリクエスト:', email);
      setMessage(`パスワードリセット用のリンクを ${email} に送信しました。メールをご確認ください。`);
      // onSendResetLink(email); // 実際の処理を呼び出す
    } else {
      setError('メールアドレスを入力してください。');
    }
  };

  return (
    <div className="password-reset-screen auth-screen"> {/* auth-screen クラスを共通利用 */}
      <header className="app-header">
        <h1>パスワードリセット</h1>
      </header>

      <form onSubmit={handleSubmit} className="auth-form">
        {message && <p className="success-message">{message}</p>} {/* 成功メッセージ用 */}
        {error && <p className="error-message">{error}</p>}
        
        <p style={{textAlign: 'center', marginBottom: '15px'}}>
          登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </p>

        <div className="form-section">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <button type="submit" className="auth-button">リセットリンクを送信</button>
      </form>

      <div className="auth-links">
        <button onClick={onNavigateToLogin} className="link-button">ログイン画面に戻る</button>
      </div>
    </div>
  );
}

export default PasswordResetScreen;
