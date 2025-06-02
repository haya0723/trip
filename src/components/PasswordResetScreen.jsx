import React, { useState } from 'react';
// import './PasswordResetScreen.css'; // 必要に応じて作成

function PasswordResetScreen({ onSendResetLink, onNavigateToLogin, onConfirmCodeAndSetNewPassword }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({}); // エラー状態をオブジェクトに変更
  const [step, setStep] = useState(1); // 1: メール入力, 2: コードと新パスワード入力
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const validateEmailForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'メールアドレスを入力してください。';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = '有効なメールアドレスを入力してください。';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPasswordForm = () => {
    const newErrors = {};
    if (!confirmationCode) newErrors.confirmationCode = '確認コードを入力してください。';
    if (!newPassword) newErrors.newPassword = '新しいパスワードを入力してください。';
    else if (newPassword.length < 8) newErrors.newPassword = 'パスワードは8文字以上で入力してください。';
    else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(newPassword)) newErrors.newPassword = 'パスワードは英字と数字の両方を含めてください。';
    
    if (!confirmNewPassword) newErrors.confirmNewPassword = '確認用パスワードを入力してください。';
    else if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = '新しいパスワードと確認用パスワードが一致しません。';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!validateEmailForm()) return;
    
    setMessage('');
    // onSendResetLink(email); // 実際のメール送信処理
    console.log('パスワードリセットリクエスト（メール送信）:', email);
    setMessage(`パスワード再設定用の確認コードを ${email} に送信しました。メールを確認し、以下のフォームに入力してください。（ダミー処理）`);
    setStep(2);
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    if (!validateNewPasswordForm()) return;

    setMessage('');
    // onConfirmCodeAndSetNewPassword(email, confirmationCode, newPassword); // 実際の処理
    console.log('新パスワード設定リクエスト:', { email, confirmationCode, newPassword });
    alert('パスワードが正常に再設定されました。（ダミー処理）');
    onNavigateToLogin();
  };

  return (
    <div className="password-reset-screen auth-screen">
      <header className="app-header">
        <h1>パスワードリセット</h1>
      </header>

      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="auth-form">
          {message && <p className="success-message" style={{textAlign: 'center'}}>{message}</p>}
          {errors.form && <p className="error-message">{errors.form}</p>} {/* 全体エラー用 */}
          
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
              autoComplete="email"
              aria-describedby="emailError"
            />
            {errors.email && <p id="emailError" className="error-message field-error">{errors.email}</p>}
          </div>
          <button type="submit" className="auth-button">確認コードを送信</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNewPasswordSubmit} className="auth-form">
          {message && <p className="success-message" style={{textAlign: 'center'}}>{message}</p>}
           {errors.form && <p className="error-message">{errors.form}</p>} {/* 全体エラー用 */}

          <div className="form-section">
            <label htmlFor="confirmation-code">確認コード</label>
            <input
              type="text"
              id="confirmation-code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="メールで受信したコード"
              aria-describedby="confirmationCodeError"
            />
            {errors.confirmationCode && <p id="confirmationCodeError" className="error-message field-error">{errors.confirmationCode}</p>}
          </div>
          <div className="form-section">
            <label htmlFor="new-password-reset">新しいパスワード</label>
            <input
              type="password"
              id="new-password-reset"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength="8"
              aria-describedby="newPasswordError"
            />
            {errors.newPassword && <p id="newPasswordError" className="error-message field-error">{errors.newPassword}</p>}
          </div>
          <div className="form-section">
            <label htmlFor="confirm-new-password-reset">新しいパスワード (確認用)</label>
            <input
              type="password"
              id="confirm-new-password-reset"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              minLength="8"
              aria-describedby="confirmNewPasswordError"
            />
            {errors.confirmNewPassword && <p id="confirmNewPasswordError" className="error-message field-error">{errors.confirmNewPassword}</p>}
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
