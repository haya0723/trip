import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const BACKEND_URL = 'https://trip-app-final-v2-493005991008.asia-northeast1.run.app'; 

export const initialDummyPublicTrips = [ /* ... */ ]; 


export const useAppLogic = () => {
  console.log('[useAppLogic] useAppLogic hook called - TOP LEVEL');
  const [currentScreen, setCurrentScreen] = useState('login');
  const [editingPlan, setEditingPlan] = useState(null); // For Trip editing
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null); // ★定義を追加
  const [currentRouteQuery, setCurrentRouteQuery] = useState(null);
  const [editingMemoryForEvent, setEditingMemoryForEvent] = useState(null);
  const [viewingMemoriesForTripId, setViewingMemoriesForTripId] = useState(null);
  const [selectedPublicTripDetail, setSelectedPublicTripDetail] = useState(null);
  const [currentHotelForRecommendations, setCurrentHotelForRecommendations] = useState(null);
  const [userProfile, setUserProfile] = useState({
    nickname: '', bio: '', avatarUrl: '', favoritePlaces: []
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [trips, setTrips] = useState([]); 
  const [editingEventDetails, setEditingEventDetails] = useState(null);
  const [placeSearchContext, setPlaceSearchContext] = useState(null);
  const [aiRecommendedCourses, setAiRecommendedCourses] = useState([]);
  const [favoritePickerContext, setFavoritePickerContext] = useState(null);
  const [editingPublishSettingsForTripId, setEditingPublishSettingsForTripId] = useState(null);
  const [editingHotelDetails, setEditingHotelDetails] = useState(null);
  const [editingScheduleForTripId, setEditingScheduleForTripId] = useState(null); 
  const [editingScheduleData, setEditingScheduleData] = useState(null); 

  const fetchUserProfile = async (userId, token) => {
    console.log(`[useAppLogic] fetchUserProfile called for userId: ${userId}`);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[useAppLogic] fetchUserProfile - API response.data:', response.data);
      setUserProfile(response.data);
      console.log('[useAppLogic] fetchUserProfile - userProfile state should be updated.');
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response ? error.response.data : error.message);
    }
  };

  const fetchMyTrips = async (token) => {
    if (!token) {
      console.log('[useAppLogic] fetchMyTrips - No token, skipping fetch.');
      setTrips([]); 
      return;
    }
    console.log('[useAppLogic] fetchMyTrips called.');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[useAppLogic] fetchMyTrips - API response.data:', response.data);
      const fetchedTrips = response.data || [];
      const validTrips = fetchedTrips.filter(trip => trip !== null && trip !== undefined);
      setTrips(validTrips);
      console.log('[useAppLogic] fetchMyTrips - trips state should be updated with valid trips.');
    } catch (error) {
      console.error('Failed to fetch trips:', error.response ? error.response.data : error.message);
      setTrips([]); 
    }
  };

  useEffect(() => {
    console.log('[useAppLogic] Initial useEffect triggered.');
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const fullCurrentUser = { ...userData, token: storedToken };
        setCurrentUser(fullCurrentUser); 
      } catch (e) {
        console.error('[useAppLogic] Initial useEffect - Error parsing storedUser:', e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setCurrentUser(null);
        setCurrentScreen('login');
      }
    } else {
      setCurrentUser(null);
      setCurrentScreen('login'); 
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.id && currentUser.token) {
      console.log('[useAppLogic] currentUser changed, fetching profile and trips. User ID:', currentUser.id);
      (async () => {
        await fetchUserProfile(currentUser.id, currentUser.token);
        await fetchMyTrips(currentUser.token); 
      })();
    } else {
      setTrips([]);
      setUserProfile({ nickname: '', bio: '', avatarUrl: '', favoritePlaces: [] }); 
    }
  }, [currentUser]); 

  useEffect(() => {
    console.log('[useAppLogic] Auth/Screen effect triggered. currentUser:', currentUser ? 'present' : 'absent', 'currentScreen:', currentScreen);
    const authScreens = ['login', 'signup', 'passwordReset', 'accountDeletionConfirm'];
    if (!currentUser && !authScreens.includes(currentScreen)) { 
      console.log('[useAppLogic] No currentUser and not on auth screen, redirecting to login.');
      setCurrentScreen('login'); 
    }
    else if (currentUser && authScreens.includes(currentScreen) && currentScreen !== 'accountDeletionConfirm') { 
      console.log('[useAppLogic] currentUser exists and on auth screen (not deletion), redirecting to tripList.');
      setCurrentScreen('tripList'); 
    }
  }, [currentUser, currentScreen]);
  
  useEffect(() => {
    if (currentScreen === 'tripList' && currentUser && currentUser.token) {
      console.log('[useAppLogic] Navigated to tripList, fetching trips.');
      fetchMyTrips(currentUser.token);
    }
  }, [currentScreen, currentUser?.token]);

  const handleSignup = async (signupData) => {
    console.log(`Attempting signup to: ${BACKEND_URL}/api/auth/signup with data:`, signupData);
    try {
      const { nickname, email, password } = signupData; 
      await axios.post(`${BACKEND_URL}/api/auth/signup`, { nickname, email, password }); 
      alert('ユーザー登録が完了しました。ログインしてください。');
      setCurrentScreen('login');
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
      alert(`登録に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleLogin = async (loginData) => {
    console.log(`Attempting login to: ${BACKEND_URL}/api/auth/login with data:`, loginData);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { 
        email: loginData.email, 
        password: loginData.password 
      });
      console.log('[useAppLogic] handleLogin - Login API response received. response.data:', response.data); 
      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
        const fullCurrentUser = { id: user.id, nickname: user.nickname, email: user.email, token };
        setCurrentUser(fullCurrentUser); 
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify({id: user.id, nickname: user.nickname, email: user.email }));
      } else { 
        console.error('[useAppLogic] handleLogin - Invalid response structure from login API:', response.data);
        alert('ログインレスポンスの形式が不正です。');
      }
    } catch (error) { 
      console.error('Login failed:', error.response ? error.response.data : error.message);
      alert(`ログインに失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleLogout = () => {
    if (window.confirm('本当にログアウトしますか？')) {
      console.log('[useAppLogic] handleLogout - Logging out.');
      setCurrentUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      console.log('[useAppLogic] handleLogout - Cleared localStorage items. Screen will be set to login by effect.');
    }
  };

  const handleShowProfileEdit = () => setCurrentScreen('profileEdit');

  const handleSaveProfile = async (profileDataToUpdate, avatarFile = null) => {
    console.log('[useAppLogic] handleSaveProfile called. profileDataToUpdate:', profileDataToUpdate, 'avatarFile:', avatarFile);
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); setCurrentScreen('login'); return; }
    let finalAvatarUrl = profileDataToUpdate.avatarUrl; 
    if (avatarFile === null && profileDataToUpdate.avatarUrl === undefined) { finalAvatarUrl = userProfile.avatarUrl; }
    try {
      if (avatarFile) { 
        const formData = new FormData(); formData.append('avatar', avatarFile);
        const uploadResponse = await axios.post(`${BACKEND_URL}/api/upload/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${currentUser.token}`}});
        finalAvatarUrl = uploadResponse.data.avatarUrl;
      }
      const payload = { nickname: profileDataToUpdate.nickname, bio: profileDataToUpdate.bio, avatarUrl: finalAvatarUrl };
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
      const response = await axios.put(`${BACKEND_URL}/api/users/profile`, payload, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      const updatedProfileFromServer = response.data;
      setUserProfile(updatedProfileFromServer); 
      setCurrentUser(prev => ({ ...prev, nickname: updatedProfileFromServer.nickname }));
      const storedUser = JSON.parse(localStorage.getItem('authUser'));
      if (storedUser) { localStorage.setItem('authUser', JSON.stringify({ ...storedUser, nickname: updatedProfileFromServer.nickname })); }
      alert('プロフィールを更新しました。');
      setCurrentScreen('myProfile');
    } catch (error) { console.error('Failed to save profile:', error.response?.data?.error || error.message); alert(`プロフィールの更新に失敗しました: ${error.response?.data?.error || error.message}`);}
  };
  
  const handleShowPlanForm = (planToEdit = null) => { setCurrentScreen('planForm'); setEditingPlan(planToEdit); setSelectedTrip(null); };
  const handleShowTripDetail = (trip) => { setSelectedTrip(trip); setCurrentScreen('tripDetail'); };
  
  const handleSavePlan = async (planData) => { 
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
    try {
      if (editingPlan && editingPlan.id) { 
        await axios.put(`${BACKEND_URL}/api/trips/${editingPlan.id}`, planData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      } else { 
        await axios.post(`${BACKEND_URL}/api/trips`, planData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      }
      await fetchMyTrips(currentUser.token); 
      setCurrentScreen('tripList');
      setEditingPlan(null);
    } catch (error) { console.error('Failed to save plan:', error.response?.data?.error || error.message); alert(`計画の保存に失敗しました: ${error.response?.data?.error || error.message}`);}
  };

  const handleDeleteTrip = async (tripId) => {  
    if (!currentUser || !currentUser.token || !tripId) return;
    if (window.confirm('本当にこの旅程を削除しますか？')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        await fetchMyTrips(currentUser.token); 
        if (selectedTrip && selectedTrip.id === tripId) { setSelectedTrip(null); }
        if (currentScreen !== 'tripList') { setCurrentScreen('tripList'); }
      } catch (error) { console.error('Failed to delete trip:', error.response?.data?.error || error.message); alert(`旅程の削除に失敗しました: ${error.response?.data?.error || error.message}`);}
    }
  };

  const handleCancelPlanForm = () => { setCurrentScreen('tripList'); setEditingPlan(null); };
  const handleBackToList = () => { setCurrentScreen('tripList'); setSelectedTrip(null); setEditingPlan(null); setCurrentHotelForRecommendations(null); setAiRecommendedCourses([]); };
  const handleRequestAIForTrip = (trip) => console.log('AIに旅程提案を依頼 (対象:', trip.name, ')'); // 既存のログを維持
  
  const handleGenerateSchedulesAI = async (tripId) => {
    if (!currentUser || !currentUser.token || !tripId) { alert('ログイン情報または旅程IDが無効です。'); return; }
    try {
      alert('AIによるスケジュール生成を開始します。数秒かかる場合があります...');
      const response = await axios.post(`${BACKEND_URL}/api/trips/${tripId}/generate-schedules-ai`, {}, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      const updatedTrip = response.data; // バックエンドから更新された旅程全体が返される想定

      if (updatedTrip) {
        setSelectedTrip(updatedTrip);
        setTrips(prevTrips => prevTrips.map(t => t.id === tripId ? updatedTrip : t));
        alert('AIによるスケジュール生成が完了しました！');
      } else {
        alert('AIによるスケジュール生成に失敗しました: 無効なレスポンス');
      }
    } catch (error) {
      console.error('Failed to generate schedules with AI:', error.response ? error.response.data : error.message);
      alert(`AIによるスケジュール生成に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleShowPlaceSearchGeneral = () => { setPlaceSearchContext({ returnScreen: currentScreen, from: 'general' }); setCurrentScreen('placeSearch'); };
  const handleShowPlaceSearchForPlanForm = (callback) => { setPlaceSearchContext({ returnScreen: 'planForm', callback, from: 'planFormDestination' }); setCurrentScreen('placeSearch'); };
  const handleShowPlaceSearchForEvent = (callbackForPlace) => { setPlaceSearchContext({ returnScreen: 'eventForm', callback: callbackForPlace, from: 'eventForm' }); setCurrentScreen('placeSearch'); };
  const handleSetHotelForDay = (tripId, date) => { setPlaceSearchContext({ returnScreen: 'tripDetail', tripId, date, callback: handleHotelSelectedForDay, from: 'setHotelForDay' }); setCurrentScreen('placeSearch'); };
  const handleHotelSelectedForDay = (tripId, date, hotelInfo) => { /* ... */ };
  const newHandlePlaceSelected = (place) => { /* ... */ };
  const handleShowPlaceDetail = (place) => { setSelectedPlaceDetail(place); setCurrentScreen('placeDetail'); };
  const handleBackFromPlaceDetail = () => { /* ... */ };
  const handleShowRouteOptions = (origin, destination) => { setCurrentRouteQuery({ origin, destination }); setCurrentScreen('routeOptions'); };
  const handleRouteSelected = (route) => { console.log('選択された移動手段:', route); setCurrentScreen('tripDetail'); setCurrentRouteQuery(null); };
  const handleShowMemoryForm = (tripId, eventName, dateForEvent) => { /* ... */ };
  const handleSaveMemory = (memoryData) => { /* ... */ };
  const handleShowMemoryView = (tripId) => { setViewingMemoriesForTripId(tripId); setCurrentScreen('memoryView'); };
  const handleShowPublicTripsSearch = () => setCurrentScreen('publicTripsSearch');
  const handleSelectPublicTrip = (publicTrip) => { setSelectedPublicTripDetail(publicTrip); setCurrentScreen('publicTripDetail'); };
  const handleCopyToMyPlans = (publicTripData) => { /* ... */ };
  const handleCopyMyOwnTrip = (tripToCopy) => { /* ... */ };
  const handleAddFavoritePlace = (placeData) => { /* ... */ };
  const handleRemoveFavoritePlace = (placeIdOrName) => { /* ... */ };
  const handleShowHotelRecommendations = (hotel) => { setCurrentHotelForRecommendations(hotel); setAiRecommendedCourses([]); setCurrentScreen('hotelRecommendations'); };
  const handleShowAccountSettings = () => setCurrentScreen('accountSettings');
  const handleChangeTripStatus = (tripId, newStatus) => { /* ... */ };
  const handleToggleTripPublicStatus = (tripId) => { /* ... */ };
  const handleShowEventForm = (tripId, date, existingEvent = null) => { setEditingEventDetails({ tripId, date, existingEvent }); setCurrentScreen('eventForm'); };
  const handleSaveEvent = (date, eventData, existingEventToUpdate) => { /* ... */ };
  const handleDeleteAccountRequest = () => setCurrentScreen('accountDeletionConfirm');
  const handleConfirmAccountDeletion = (password) => { console.log('アカウント削除実行'); handleLogout(); };
  const handleChangePasswordRequest = () => { setCurrentScreen('passwordChange'); };
  const handleConfirmPasswordChange = (currentPassword, newPassword) => { console.log('パスワード変更実行'); setCurrentScreen('accountSettings'); };
  const handleChangeEmailRequest = () => { setCurrentScreen('emailChange'); };
  const handleSendEmailConfirmation = (currentPassword, newEmail) => { alert(`新しいメールアドレス ${newEmail} に確認メールを送信しました。（ダミー処理）`); setCurrentScreen('accountSettings'); };
  const handleSendPasswordResetLink = (email) => { console.log('パスワードリセットメール送信要求:', email); };
  const handleConfirmCodeAndSetNewPassword = (email, code, newPassword) => { console.log('確認コードと新パスワードでパスワード更新:', { email, code, newPassword }); };
  const handleShowMyProfile = () => { setCurrentScreen('myProfile'); };
  const handleShowFavoritePlaces = () => { setCurrentScreen('favoritePlacesList'); };
  const handleShowFavoritePickerForEvent = (callback) => { setFavoritePickerContext({ returnScreen: 'eventForm', callback }); setCurrentScreen('favoritePicker'); };
  const handleRequestAICourse = (hotel, params) => { /* ... */ };
  const handleShowPublishSettings = (tripId) => { setEditingPublishSettingsForTripId(tripId); setCurrentScreen('tripPublishSettings'); };
  const handleSavePublishSettings = (tripId, settings) => { /* ... */ };
  const handleCancelPublishSettings = () => { setEditingPublishSettingsForTripId(null); setCurrentScreen('tripDetail'); };
  const handleShowHotelDetailModal = (tripId, date, hotelData) => { setEditingHotelDetails({ tripId, date, hotelData }); };
  const handleSaveHotelDetails = (tripId, date, newHotelData) => { /* ... */ };
  const handleCancelHotelDetailModal = () => { setEditingHotelDetails(null); };
  const handleShowScheduleForm = (tripId, scheduleToEdit = null) => {
    console.log('[useAppLogic] handleShowScheduleForm called. tripId:', tripId, 'scheduleToEdit:', scheduleToEdit);
    setEditingScheduleForTripId(tripId);
    setEditingScheduleData(scheduleToEdit);
    setCurrentScreen('scheduleForm');
  };
  const handleSaveSchedule = async (tripId, scheduleData, scheduleId = null) => {
    if (!currentUser || !currentUser.token || !tripId) { alert('ログイン情報または旅程IDが無効です。'); return; }
    try {
      let response;
      if (scheduleId) { 
        response = await axios.put(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}`, scheduleData, { headers: { Authorization: `Bearer ${currentUser.token}` }});
      } else { 
        response = await axios.post(`${BACKEND_URL}/api/trips/${tripId}/schedules`, scheduleData, { headers: { Authorization: `Bearer ${currentUser.token}` }});
      }
      
      const refreshedTrip = response.data; // APIレスポンスを直接利用

      if (refreshedTrip) {
        setSelectedTrip(refreshedTrip);
        setTrips(prevTrips => prevTrips.map(t => t.id === tripId ? refreshedTrip : t));
      } else {
        console.warn(`[useAppLogic] handleSaveSchedule - API response for schedule save/update did not contain a valid trip object. Falling back to fetching all trips.`);
        await fetchMyTrips(currentUser.token); 
      }
      
      setCurrentScreen('tripDetail'); 
      setEditingScheduleForTripId(null);
      setEditingScheduleData(null);
    } catch (error) { 
      console.error('Failed to save schedule or refresh trip data:', error.response?.data?.error || error.message); 
      alert(`スケジュールの保存またはデータ更新に失敗しました: ${error.response?.data?.error || error.message}`);
      // エラー時もリストを再取得して整合性を保つ試み
      if (currentUser && currentUser.token) { // currentUser と token の存在を確認
        await fetchMyTrips(currentUser.token);
      }
      setCurrentScreen('tripDetail');
    }
  };
  const handleCancelScheduleForm = () => {
    setCurrentScreen('tripDetail'); 
    setEditingScheduleForTripId(null);
    setEditingScheduleData(null);
  };

  return {
    currentScreen, setCurrentScreen,
    editingPlan, setEditingPlan,
    selectedTrip, setSelectedTrip,
    selectedPlaceDetail, setSelectedPlaceDetail, // ★ return に追加
    currentRouteQuery, setCurrentRouteQuery,
    editingMemoryForEvent, setEditingMemoryForEvent,
    viewingMemoriesForTripId, setViewingMemoriesForTripId,
    selectedPublicTripDetail, setSelectedPublicTripDetail,
    currentHotelForRecommendations, setCurrentHotelForRecommendations,
    userProfile, setUserProfile,
    currentUser, setCurrentUser,
    trips, setTrips,
    editingEventDetails, setEditingEventDetails,
    placeSearchContext, setPlaceSearchContext,
    aiRecommendedCourses, setAiRecommendedCourses,
    favoritePickerContext, setFavoritePickerContext,
    editingPublishSettingsForTripId,
    editingHotelDetails,
    editingScheduleForTripId, 
    editingScheduleData,    
    handleLogin, handleSignup, handleLogout,
    handleSendPasswordResetLink, handleConfirmCodeAndSetNewPassword,
    handleShowMyProfile, handleShowProfileEdit, handleSaveProfile, 
    handleShowAccountSettings, handleDeleteAccountRequest, handleConfirmAccountDeletion,
    handleChangePasswordRequest, handleConfirmPasswordChange,
    handleChangeEmailRequest, handleSendEmailConfirmation,
    handleShowPlanForm, handleShowTripDetail, handleSavePlan, handleDeleteTrip,
    handleBackToList, handleChangeTripStatus, handleToggleTripPublicStatus,
    handleCopyMyOwnTrip, handleCancelPlanForm,
    handleShowScheduleForm, 
    handleSaveSchedule,     
    handleCancelScheduleForm, 
    handleShowEventForm, handleSaveEvent, handleSetHotelForDay, handleHotelSelectedForDay,
    handleShowHotelDetailModal, handleSaveHotelDetails, handleCancelHotelDetailModal,
    handleShowPlaceSearchGeneral, handleShowPlaceSearchForPlanForm, handleShowPlaceSearchForEvent,
    newHandlePlaceSelected, handleShowPlaceDetail, handleBackFromPlaceDetail,
    handleShowRouteOptions, handleRouteSelected,
    handleShowMemoryForm, handleSaveMemory, handleShowMemoryView,
    handleShowPublicTripsSearch, handleSelectPublicTrip, handleCopyToMyPlans,
    handleShowPublishSettings, handleSavePublishSettings, handleCancelPublishSettings,
    handleShowFavoritePlaces, handleAddFavoritePlace, handleRemoveFavoritePlace,
    handleShowFavoritePickerForEvent,
    handleRequestAIForTrip, handleShowHotelRecommendations, handleRequestAICourse,
    handleShowBackendTest: () => setCurrentScreen('backendTest'),
    fetchMyTrips,
    handleGenerateSchedulesAI // 追加
  };
};
