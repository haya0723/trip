import React, { useState } from 'react';
// import './SignupScreen.css'; // 必要に応じて作成

function SignupScreen({ onSignup, onNavigateToLogin }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    // TODO: 実際の新規登録処理 (API連携など)
    console.log('新規登録情報:', { nickname, email, password });
    onSignup({ nickname, email }); // ダミーでニックネームとメールを渡す
  };

  return (
    <div className="signup-screen auth-screen"> {/* auth-screen クラスを共通利用 */}
      <header className="app-header">
        <h1>新規アカウント登録</h1>
        {/* 新規登録画面では戻るボタンは不要か、ログイン画面へ戻るリンクで代替 */}
      </header>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error-message">{error}</p>}
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
        <div className="form-section">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="form-section">
          <label htmlFor="confirmPassword">パスワード（確認用）</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="auth-button">登録する</button>
      </form>

      <div className="auth-links">
        <button onClick={onNavigateToLogin} className="link-button">既にアカウントをお持ちですか？ ログイン</button>
      </div>
    </div>
  );
}

export default SignupScreen;
