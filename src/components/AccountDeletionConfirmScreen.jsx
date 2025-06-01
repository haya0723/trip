import React, { useState } from 'react';
// import './AccountDeletionConfirmScreen.css'; // 必要に応じて作成

function AccountDeletionConfirmScreen({ userEmail, onConfirm, onCancel }) {
  const [password, setPassword] = useState('');
  const [confirmCheck, setConfirmCheck] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!confirmCheck) {
      setError('注意事項を確認し、チェックボックスにチェックを入れてください。');
      return;
    }
    if (!password) {
      setError('パスワードを入力してください。');
      return;
    }
    // ここで実際のパスワード検証を行う (今回はダミーなので省略)
    onConfirm(password);
  };

  return (
    <div className="account-deletion-confirm-screen auth-screen">
      <header className="app-header">
        <h1>アカウント削除の最終確認</h1>
        {/* キャンセルボタンはフォーム内に配置 */}
      </header>

      <div className="auth-form" style={{marginTop: 0}}>
        <p style={{color: '#dc3545', fontWeight: 'bold'}}>【重要】アカウント削除に関する注意事項</p>
        <ul style={{fontSize: '0.9em', paddingLeft: '20px'}}>
          <li>アカウントを削除すると、作成した全ての旅行計画、思い出（写真、メモなどを含む）が完全に削除されます。</li>
          <li>削除されたデータは復元できません。</li>
          <li>現在のアカウント ({userEmail || 'あなたのメールアドレス'}) で再度ログインすることはできなくなります。</li>
        </ul>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="confirm-checkbox" style={{display: 'flex', alignItems: 'center'}}>
              <input 
                type="checkbox" 
                id="confirm-checkbox" 
                checked={confirmCheck} 
                onChange={(e) => setConfirmCheck(e.target.checked)} 
                style={{marginRight: '10px', width: 'auto'}}
              />
              上記の注意事項を理解し、アカウント削除に同意します。
            </label>
          </div>

          <div className="form-section">
            <label htmlFor="password-confirm">パスワード確認:</label>
            <input 
              type="password" 
              id="password-confirm" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="現在のパスワードを入力"
            />
          </div>

          {error && <p className="error-message" style={{marginTop: '10px'}}>{error}</p>}

          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
            <button type="button" onClick={onCancel} className="cancel-button">キャンセル</button>
            <button type="submit" className="delete-plan-button" style={{backgroundColor: '#dc3545'}}>退会する</button> {/* delete-plan-button のスタイルを流用 */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountDeletionConfirmScreen;
