import React, { useState } from 'react';
// import './SignupScreen.css'; // 必要に応じて作成

function SignupScreen({ onSignup, onNavigateToLogin }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({}); // エラー状態をオブジェクトに変更

  const validateForm = () => {
    const newErrors = {};
    if (!nickname) newErrors.nickname = 'ニックネームを入力してください。';
    else if (nickname.length > 20) newErrors.nickname = 'ニックネームは20文字以内で入力してください。';
    
    if (!email) newErrors.email = 'メールアドレスを入力してください。';
    // 簡単なメール形式チェック (より厳密なものはライブラリ等を利用)
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = '有効なメールアドレスを入力してください。';

    if (!password) newErrors.password = 'パスワードを入力してください。';
    else if (password.length < 8) newErrors.password = 'パスワードは8文字以上で入力してください。';
    // 英数字混合チェック (簡易)
    else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) newErrors.password = 'パスワードは英字と数字の両方を含めてください。';


    if (!confirmPassword) newErrors.confirmPassword = '確認用パスワードを入力してください。';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'パスワードが一致しません。';

    if (!agreeToTerms) newErrors.agreeToTerms = '利用規約とプライバシーポリシーに同意してください。';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    // TODO: メールアドレスの一意性チェック (バックエンド)
    // TODO: メールアドレス確認フロー (バックエンド連携)
    console.log('新規登録情報:', { nickname, email, password, agreeToTerms });
    // ダミーで成功したとして処理を進める
    alert('アカウント登録リクエストを受け付けました。確認メールを送信しましたのでご確認ください。（ダミー処理）');
    onSignup({ nickname, email, password, agreeToTerms }); 
  };

  return (
    <div className="signup-screen auth-screen"> 
      <header className="app-header">
        <h1>新規アカウント登録</h1>
      </header>

      <form onSubmit={handleSubmit} className="auth-form">
        {/* 全体的なエラーメッセージは削除し、各フィールドで表示 */}
        <div className="form-section">
          <label htmlFor="nickname">ニックネーム</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            aria-describedby="nicknameError"
          />
          {errors.nickname && <p id="nicknameError" className="error-message field-error">{errors.nickname}</p>}
        </div>
        <div className="form-section">
          <label htmlFor="email-signup">メールアドレス</label>
          <input
            type="email"
            id="email-signup"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-describedby="emailError"
          />
          {errors.email && <p id="emailError" className="error-message field-error">{errors.email}</p>}
        </div>
        <div className="form-section">
          <label htmlFor="password-signup">パスワード</label>
          <input
            type="password"
            id="password-signup"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8"
            autoComplete="new-password"
            aria-describedby="passwordError"
          />
          {errors.password && <p id="passwordError" className="error-message field-error">{errors.password}</p>}
        </div>
        <div className="form-section">
          <label htmlFor="confirmPassword">パスワード（確認用）</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength="8"
            autoComplete="new-password"
            aria-describedby="confirmPasswordError"
          />
          {errors.confirmPassword && <p id="confirmPasswordError" className="error-message field-error">{errors.confirmPassword}</p>}
        </div>
        <div className="form-section" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            style={{ marginRight: '8px', width: 'auto' }}
            aria-describedby="agreeToTermsError"
          />
          <label htmlFor="agreeToTerms" style={{ fontWeight: 'normal', fontSize: '0.9em', marginBottom: 0 }}>
            利用規約とプライバシーポリシーに同意します。
          </label>
        </div>
        {errors.agreeToTerms && <p id="agreeToTermsError" className="error-message field-error" style={{marginTop: '-10px', marginBottom: '10px'}}>{errors.agreeToTerms}</p>}
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
