import React, { useState } from 'react';
// import './LoginScreen.css'; // 必要に応じて作成

function LoginScreen({ onLogin, onNavigateToSignup, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // 自動ログイン用state
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 
    if (email && password) {
      // ダミーログイン処理 (実際のAPI連携では email, password, rememberMe を送信)
      console.log('ログイン試行:', { email, password, rememberMe });
      // 実際のログイン成功時にはユーザー情報を取得して onLogin に渡す
      // ここではダミーユーザーで onLogin を呼び出す
      if (email === 'satake.hayata@tbs.co.jp' && password === 'test') { // ダミー認証
         onLogin({ email, name: 'テストユーザー', rememberMe }); 
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。');
      }
    } else {
      setError('メールアドレスとパスワードを入力してください。');
    }
  };

  return (
    <div className="login-screen auth-screen"> 
      <header className="app-header">
        <h1>ログイン</h1>
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
        <div className="form-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <label htmlFor="rememberMe" style={{ display: 'flex', alignItems: 'center', marginBottom: 0, fontWeight: 'normal', fontSize: '0.9em' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: '8px', width: 'auto' }}
            />
            次回から自動的にログインする
          </label>
        </div>
        <button type="submit" className="auth-button">ログイン</button>
      </form>

      <div className="social-login-section" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '10px' }}>または</p>
        <button className="social-login-button google" style={{marginRight: '10px', padding: '10px 15px', background: '#db4437', color: 'white', border: 'none', borderRadius: '4px'}}>Googleでログイン</button>
        <button className="social-login-button apple" style={{padding: '10px 15px', background: '#000000', color: 'white', border: 'none', borderRadius: '4px'}}>Appleでログイン</button>
        {/* TODO: 各ソーシャルログインの処理を実装 */}
      </div>

      <div className="auth-links">
        <button onClick={onForgotPassword} className="link-button">パスワードをお忘れですか？</button>
        <button onClick={onNavigateToSignup} className="link-button">アカウントをお持ちでないですか？ 新規登録</button>
      </div>
    </div>
  );
}

export default LoginScreen;
