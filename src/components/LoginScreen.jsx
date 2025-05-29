import React, { useState } from 'react';
// import './LoginScreen.css'; // 必要に応じて作成

function LoginScreen({ onLogin, onNavigateToSignup, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error
    // TODO: 実際のログイン処理 (API連携など)
    if (email === 'satake.hayata@tbs.co.jp' && password === 'test') { // メールアドレスを指定のものに変更、パスワードは 'test' のまま
      onLogin({ email, name: 'テストユーザー' }); // ダミーユーザー情報
    } else {
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  return (
    <div className="login-screen auth-screen"> {/* auth-screen クラスを追加 */}
      <header className="app-header">
        <h1>ログイン</h1>
        {/* ログイン画面では戻るボタンは不要か、特定の遷移元がある場合のみ表示 */}
      </header>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error-message">{error}</p>}
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="auth-button">ログイン</button>
      </form>

      <div className="auth-links">
        <button onClick={onForgotPassword} className="link-button">パスワードをお忘れですか？</button>
        <button onClick={onNavigateToSignup} className="link-button">アカウントをお持ちでないですか？ 新規登録</button>
      </div>
    </div>
  );
}

export default LoginScreen;
