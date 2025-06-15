import { useState, useEffect, useCallback, useRef } from 'react'; // useCallback, useRef をインポート
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30分 (ミリ秒)

export const useAuth = (setCurrentScreenExt) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ nickname: '', bio: '', avatarUrl: '', favoritePlaces: [] });
  const logoutTimer = useRef(null);

  const fetchUserProfile = async (userId, token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
      // console.log('[useAuth] fetchUserProfile raw response.data:', response.data); 
      let profileData = response.data || { nickname: '', bio: '', avatarUrl: '', favoritePlaces: [] };
      if (profileData.avatar_url && profileData.avatarUrl === undefined) { 
        profileData.avatarUrl = profileData.avatar_url;
      }
      // console.log('[useAuth] fetchUserProfile processed profileData for setUserProfile:', profileData);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser({ ...parsedUser, token: storedToken });
    } else {
      setCurrentUser(null); 
    }
  }, []); 

  useEffect(() => {
    if (currentUser && currentUser.token) {
      fetchUserProfile(currentUser.id, currentUser.token);
    } else {
      setUserProfile({ nickname: '', bio: '', avatarUrl: '', favoritePlaces: [] });
    }
  }, [currentUser]); 

  const handleSignup = async (signupData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, signupData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser({ ...user, token });
      alert('新規登録が完了しました。');
      if (setCurrentScreenExt) setCurrentScreenExt('tripList');
    } catch (error) { 
      alert(`新規登録に失敗しました: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, loginData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser({ ...user, token }); 
      if (setCurrentScreenExt) setCurrentScreenExt('tripList'); 
    } catch (error) { 
      alert(`ログインに失敗しました: ${error.response?.data?.error || error.message}`);
      setCurrentUser(null); 
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    if (setCurrentScreenExt) setCurrentScreenExt('login');
    clearTimeout(logoutTimer.current); // ログアウトタイマーもクリア
  };

  const resetLogoutTimer = useCallback(() => {
    clearTimeout(logoutTimer.current);
    if (currentUser) { // ログイン中のみタイマーを設定
      logoutTimer.current = setTimeout(() => {
        alert('セッションタイムアウトにより自動的にログアウトしました。');
        handleLogout();
      }, AUTO_LOGOUT_TIME);
    }
  }, [currentUser, handleLogout]); // handleLogout を依存配列に追加

  useEffect(() => {
    if (currentUser) {
      resetLogoutTimer(); // ログイン状態が変化したらタイマーをリセット/開始
      window.addEventListener('mousemove', resetLogoutTimer);
      window.addEventListener('keydown', resetLogoutTimer);
      // 他のアクティビティイベントも必要に応じて追加 (例: 'scroll', 'click')
    } else {
      clearTimeout(logoutTimer.current); // ログアウトしたらタイマーをクリア
      window.removeEventListener('mousemove', resetLogoutTimer);
      window.removeEventListener('keydown', resetLogoutTimer);
    }

    return () => {
      clearTimeout(logoutTimer.current);
      window.removeEventListener('mousemove', resetLogoutTimer);
      window.removeEventListener('keydown', resetLogoutTimer);
    };
  }, [currentUser, resetLogoutTimer]);
  
  const handleSendPasswordResetLink = async (email) => { alert('パスワードリセット機能は現在開発中です。'); };
  const handleConfirmCodeAndSetNewPassword = async (code, newPassword) => { alert('パスワード再設定機能は現在開発中です。');};

  const handleShowProfileEdit = () => {
    if (setCurrentScreenExt) setCurrentScreenExt('profileEdit');
  };
  
  const handleSaveProfile = async (profileDataFromForm, avatarFile = null) => {
     if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
     try {
       let dataToSend = { 
         nickname: profileDataFromForm.nickname, 
         bio: profileDataFromForm.bio 
       };

       if (avatarFile) {
         const formData = new FormData();
         formData.append('mediaFile', avatarFile); 
         const uploadResponse = await axios.post(`${BACKEND_URL}/api/upload/media`, formData, {
           headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${currentUser.token}` },
         });
         dataToSend.avatar_url = uploadResponse.data.fileUrl;
       } else if (profileDataFromForm.avatarUrl !== undefined && profileDataFromForm.avatarUrl.trim() !== '') {
         dataToSend.avatar_url = profileDataFromForm.avatarUrl;
       } else if (profileDataFromForm.avatarUrl === '' && userProfile.avatarUrl) { 
         dataToSend.avatar_url = null; 
       }
       await axios.put(`${BACKEND_URL}/api/users/profile`, dataToSend, { headers: { Authorization: `Bearer ${currentUser.token}` } });
       await fetchUserProfile(currentUser.id, currentUser.token); 
       if (setCurrentScreenExt) setCurrentScreenExt('myProfile');
       alert('プロフィールを更新しました。');
     } catch (error) { 
       console.error('Failed to save profile:', error.response?.data || error.message, error);
       alert(`プロフィールの保存に失敗しました: ${error.response?.data?.error || error.message}`); 
     }
  };

  const handleShowAccountSettings = () => {
    if (setCurrentScreenExt) setCurrentScreenExt('accountSettings');
  };

  const handleChangePasswordRequest = () => {
    if (setCurrentScreenExt) setCurrentScreenExt('passwordChange');
  };
  const handleConfirmPasswordChange = async (oldPassword, newPassword) => { 
    alert('パスワード変更機能は現在開発中です。');
  };
  const handleChangeEmailRequest = () => {
    if (setCurrentScreenExt) setCurrentScreenExt('emailChange');
  };
  const handleSendEmailConfirmation = async (newEmail) => { 
    alert('メールアドレス変更機能は現在開発中です。');
  };
  const handleDeleteAccountRequest = () => {
    if (setCurrentScreenExt) setCurrentScreenExt('accountDeletionConfirm');
  };
  const handleConfirmAccountDeletion = async () => { 
    alert('アカウント削除機能は現在開発中です。');
  };

  return {
    currentUser,
    setCurrentUser,
    userProfile,
    setUserProfile,
    fetchUserProfile,
    handleSignup,
    handleLogin,
    handleLogout,
    handleSendPasswordResetLink,
    handleConfirmCodeAndSetNewPassword,
    handleShowProfileEdit, 
    handleSaveProfile,
    handleShowAccountSettings,
    handleChangePasswordRequest,
    handleConfirmPasswordChange,
    handleChangeEmailRequest,
    handleSendEmailConfirmation,
    handleDeleteAccountRequest,
    handleConfirmAccountDeletion,
  };
};
