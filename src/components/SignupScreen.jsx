import React, { useState } from 'react';
// import './SignupScreen.css'; // 必要に応じて作成

function SignupScreen({ onSignup, onNavigateToLogin }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false); // 同意チェックボックス用state
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 

    if (!nickname || !email || !password || !confirmPassword) {
      setError('すべての必須項目を入力してください。');
      return;
    }
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください。');
      return;
    }
    if (!agreeToTerms) {
      setError('利用規約とプライバシーポリシーに同意してください。');
      return;
    }
    
    console.log('新規登録情報:', { nickname, email, password, agreeToTerms });
    onSignup({ nickname, email, password, agreeToTerms }); // App.jsx側の onSignup の引数に合わせる
  };

  return (
    <div className="signup-screen auth-screen"> 
      <header className="app-header">
        <h1>新規アカウント登録</h1>
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
          <label htmlFor="email-signup">メールアドレス</label> {/* id を変更 */}
          <input
            type="email"
            id="email-signup"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-section">
          <label htmlFor="password-signup">パスワード</label> {/* id を変更 */}
          <input
            type="password"
            id="password-signup"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
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
            minLength="8"
            autoComplete="new-password"
          />
        </div>
        <div className="form-section" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            style={{ marginRight: '8px', width: 'auto' }}
          />
          <label htmlFor="agreeToTerms" style={{ fontWeight: 'normal', fontSize: '0.9em', marginBottom: 0 }}>
            利用規約とプライバシーポリシーに同意します。
          </label>
        </div>
        <button type="submit" className="auth-button">登録する</button>
      </form>

      <div className="social-login-section" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '10px' }}>または</p>
        <button className="social-login-button google" style={{marginRight: '10px', padding: '10px 15px', background: '#db4437', color: 'white', border: 'none', borderRadius: '4px'}}>Googleで登録</button>
        <button className="social-login-button apple" style={{padding: '10px 15px', background: '#000000', color: 'white', border: 'none', borderRadius: '4px'}}>Appleで登録</button>
        {/* TODO: 各ソーシャルログインの処理を実装 */}
      </div>

      <div className="auth-links">
        <button onClick={onNavigateToLogin} className="link-button">既にアカウントをお持ちですか？ ログイン</button>
      </div>
    </div>
  );
}

export default SignupScreen;
