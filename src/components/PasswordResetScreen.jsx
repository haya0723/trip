import React, { useState } from 'react';
// import './PasswordResetScreen.css'; // 必要に応じて作成

function PasswordResetScreen({ onSendResetLink, onNavigateToLogin, onConfirmCodeAndSetNewPassword }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: メール入力, 2: コードと新パスワード入力
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('メールアドレスを入力してください。');
      return;
    }
    // onSendResetLink(email); // 実際のメール送信処理 (App.jsxでダミー実装)
    console.log('パスワードリセットリクエスト（メール送信）:', email);
    setMessage(`パスワード再設定用の確認コードを ${email} に送信しました。メールを確認し、以下のフォームに入力してください。（ダミー処理）`);
    setStep(2); // 次のステップへ
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!confirmationCode) {
      setError('確認コードを入力してください。');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません。');
      return;
    }
    if (newPassword.length < 8) {
      setError('新しいパスワードは8文字以上で入力してください。');
      return;
    }
    // onConfirmCodeAndSetNewPassword(email, confirmationCode, newPassword); // 実際の処理 (App.jsxでダミー実装)
    console.log('新パスワード設定リクエスト:', { email, confirmationCode, newPassword });
    alert('パスワードが正常に再設定されました。（ダミー処理）');
    onNavigateToLogin(); // ログイン画面へ
  };

  return (
    <div className="password-reset-screen auth-screen">
      <header className="app-header">
        <h1>パスワードリセット</h1>
      </header>

      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="auth-form">
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          
          <p style={{textAlign: 'center', marginBottom: '15px'}}>
            登録済みのメールアドレスを入力してください。パスワード再設定用の確認コードを送信します。
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
          <button type="submit" className="auth-button">確認コードを送信</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNewPasswordSubmit} className="auth-form">
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="form-section">
            <label htmlFor="confirmation-code">確認コード</label>
            <input
              type="text"
              id="confirmation-code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              placeholder="メールで受信したコード"
            />
          </div>
          <div className="form-section">
            <label htmlFor="new-password-reset">新しいパスワード</label>
            <input
              type="password"
              id="new-password-reset"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>
          <div className="form-section">
            <label htmlFor="confirm-new-password-reset">新しいパスワード (確認用)</label>
            <input
              type="password"
              id="confirm-new-password-reset"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>
          <button type="submit" className="auth-button">パスワードを更新</button>
        </form>
      )}

      <div className="auth-links">
        <button onClick={onNavigateToLogin} className="link-button">ログイン画面に戻る</button>
      </div>
    </div>
  );
}

export default PasswordResetScreen;
