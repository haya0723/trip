import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useAuth } from './useAuth';
import { useNavigation } from './useNavigation';

const BACKEND_URL = 'https://trip-app-final-v2-493005991008.asia-northeast1.run.app'; 

export const useAppLogic = () => {
  let setCurrentScreenForAuth = (screen) => {
    // This will be replaced by the actual setCurrentScreen from useNavigation
  };

  const authLogic = useAuth((screen) => setCurrentScreenForAuth(screen));
  const { currentUser, userProfile, setUserProfile, fetchUserProfile, 
          handleLogin, handleSignup, handleLogout, 
          handleSendPasswordResetLink, handleConfirmCodeAndSetNewPassword 
        } = authLogic;

  // Pass currentUser from authLogic to useNavigation
  const navigationLogic = useNavigation(currentUser); 
  const { currentScreen, setCurrentScreen: actualSetCurrentScreen } = navigationLogic;

  // Update the placeholder with the actual function from useNavigation
  setCurrentScreenForAuth = actualSetCurrentScreen;


  // States for other features
  const [editingPlan, setEditingPlan] = useState(null); 
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [trips, setTrips] = useState([]); 
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null); 
  const [currentRouteQuery, setCurrentRouteQuery] = useState(null);
  const [editingMemoryForEvent, setEditingMemoryForEvent] = useState(null); 
  const [viewingMemoriesForTripId, setViewingMemoriesForTripId] = useState(null);
  const [tripMemories, setTripMemories] = useState([]); 
  const [selectedPublicTripDetail, setSelectedPublicTripDetail] = useState(null);
  const [currentHotelForRecommendations, setCurrentHotelForRecommendations] = useState(null);
  const [editingEventDetails, setEditingEventDetails] = useState(null); 
  const [placeSearchContext, setPlaceSearchContext] = useState(null);
  const [aiRecommendedCourses, setAiRecommendedCourses] = useState([]);
  const [favoritePickerContext, setFavoritePickerContext] = useState(null);
  const [editingPublishSettingsForTripId, setEditingPublishSettingsForTripId] = useState(null);
  const [editingHotelDetails, setEditingHotelDetails] = useState(null); 
  const [editingScheduleForTripId, setEditingScheduleForTripId] = useState(null); 
  const [editingScheduleData, setEditingScheduleData] = useState(null); 


  const fetchMyTrips = async (token) => {
    if (!token) { setTrips([]); return; }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trips`, { headers: { Authorization: `Bearer ${token}` } });
      setTrips(response.data || []);
    } catch (error) { console.error('Failed to fetch trips:', error.response?.data || error.message); setTrips([]); }
  };
  
  useEffect(() => {
    if (currentUser && currentUser.token) {
      fetchMyTrips(currentUser.token);
    } else {
      setTrips([]);
    }
  }, [currentUser]);

  const handleShowProfileEdit = () => actualSetCurrentScreen('profileEdit');
  const handleSaveProfile = async (profileDataToUpdate, avatarFile = null) => {
     if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
     try {
       let updatedProfileData = { ...profileDataToUpdate };
       if (avatarFile) {
         const formData = new FormData();
         formData.append('avatar', avatarFile);
         const uploadResponse = await axios.post(`${BACKEND_URL}/api/users/upload-avatar`, formData, {
           headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${currentUser.token}` },
         });
         updatedProfileData.avatar_url = uploadResponse.data.avatarUrl;
       }
       await axios.put(`${BACKEND_URL}/api/users/profile`, updatedProfileData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
       await fetchUserProfile(currentUser.id, currentUser.token);
       actualSetCurrentScreen('myProfile');
       alert('プロフィールを更新しました。');
     } catch (error) { alert(`プロフィールの保存に失敗しました: ${error.response?.data?.error || error.message}`); }
  };

  const handleShowPlanForm = (planToEdit = null) => { setEditingPlan(planToEdit); setSelectedTrip(null); actualSetCurrentScreen('planForm'); };
  const handleShowTripDetail = (trip) => { setSelectedTrip(trip); actualSetCurrentScreen('tripDetail'); };
  const handleSavePlan = async (planData) => {
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
    try {
      let savedTrip;
      if (editingPlan && editingPlan.id) { 
        const response = await axios.put(`${BACKEND_URL}/api/trips/${editingPlan.id}`, planData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedTrip = response.data;
      } else { 
        const response = await axios.post(`${BACKEND_URL}/api/trips`, planData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedTrip = response.data;
      }
      await fetchMyTrips(currentUser.token); 
      setSelectedTrip(savedTrip); 
      actualSetCurrentScreen('tripDetail'); 
      setEditingPlan(null);
      alert(editingPlan && editingPlan.id ? '旅程を更新しました。' : '新しい旅程を作成しました。');
    } catch (error) { alert(`旅程の保存に失敗しました: ${error.response?.data?.error || error.message}`); }
  };
  const handleDeleteTrip = async (tripId) => {
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
    if (window.confirm('本当にこの旅程を削除しますか？')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        await fetchMyTrips(currentUser.token); 
        actualSetCurrentScreen('tripList'); 
        setSelectedTrip(null); 
        alert('旅程を削除しました。');
      } catch (error) { alert(`旅程の削除に失敗しました: ${error.response?.data?.error || error.message}`); }
    }
  };
  const handleCancelPlanForm = () => { actualSetCurrentScreen('tripList'); setEditingPlan(null); };
  
  const handleShowScheduleForm = (tripId, scheduleToEdit = null) => { setEditingScheduleForTripId(tripId); setEditingScheduleData(scheduleToEdit); actualSetCurrentScreen('scheduleForm'); };
  const handleSaveSchedule = async (tripId, scheduleData, scheduleId = null) => {
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
    try {
      let response;
      if (scheduleId) { 
        response = await axios.put(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}`, scheduleData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      } else { 
        response = await axios.post(`${BACKEND_URL}/api/trips/${tripId}/schedules`, scheduleData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      }
      if (response?.data) {
        setSelectedTrip(response.data);
        setTrips(prevTrips => prevTrips.map(t => t.id === tripId ? response.data : t));
      } else { await fetchMyTrips(currentUser.token); const refreshedTrip = trips.find(t => t.id === tripId); if (refreshedTrip) setSelectedTrip(refreshedTrip); }
      actualSetCurrentScreen('tripDetail');
      setEditingScheduleForTripId(null); setEditingScheduleData(null);
      alert(scheduleId ? 'スケジュールを更新しました。' : '新しいスケジュールを作成しました。');
    } catch (error) { alert(`スケジュールの保存に失敗しました: ${error.response?.data?.error || error.message}`); }
  };
  const handleCancelScheduleForm = () => { actualSetCurrentScreen('tripDetail'); setEditingScheduleForTripId(null); setEditingScheduleData(null); };

  const handleShowEventForm = (tripId, date, scheduleId, eventToEdit = null) => { setEditingEventDetails({ tripId, date, scheduleId, event: eventToEdit }); actualSetCurrentScreen('eventForm'); };
  const handleSaveEvent = async (tripId, scheduleId, eventData, eventId = null) => {
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
    try {
      let response;
      if (eventId) { 
        response = await axios.put(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}/events/${eventId}`, eventData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      } else { 
        response = await axios.post(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}/events`, eventData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      }
      if (response?.data) { 
        const updatedTripResponse = await axios.get(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` }});
        if (updatedTripResponse.data) {
          setSelectedTrip(updatedTripResponse.data);
          setTrips(prevTrips => prevTrips.map(t => t.id === tripId ? updatedTripResponse.data : t));
        } else { await fetchMyTrips(currentUser.token); }
      } else { await fetchMyTrips(currentUser.token); }
      actualSetCurrentScreen('tripDetail');
      setEditingEventDetails(null);
      alert(eventId ? '予定を更新しました。' : '新しい予定を作成しました。');
    } catch (error) { alert(`予定の保存に失敗しました: ${error.response?.data?.error || error.message}`); }
  };
  const handleDeleteEvent = async (tripId, scheduleId, eventId) => { alert('イベント削除機能は開発中です。'); };
  const fetchEventsByScheduleId = async (scheduleId, token) => { alert('個別イベント取得機能は開発中です。'); };
  
  const uploadMediaFile = async (file) => {
    if (!currentUser || !currentUser.token) { throw new Error('Not authenticated for media upload.'); }
    const formData = new FormData(); formData.append('mediaFile', file);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/upload/media`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${currentUser.token}` } });
      return response.data.fileUrl;
    } catch (error) { console.error('Failed to upload media file:', error.response?.data || error.message); throw error; }
  };
  const handleShowMemoryForm = (tripId, eventId, eventName, date, existingMemory = null) => { setEditingMemoryForEvent({ tripId, eventId, eventName, date, existingMemory }); actualSetCurrentScreen('memoryForm'); };
  const handleSaveMemory = async (memoryDataToSave, filesToUpload = []) => { 
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
    try {
      let uploadedMediaUrls = [];
      if (filesToUpload && filesToUpload.length > 0) { uploadedMediaUrls = await Promise.all(filesToUpload.map(file => uploadMediaFile(file))); }
      const finalMemoryData = { ...memoryDataToSave, media_urls: [...(memoryDataToSave.media_urls || []), ...uploadedMediaUrls], trip_id: memoryDataToSave.tripId || editingMemoryForEvent?.tripId, event_id: memoryDataToSave.eventId || editingMemoryForEvent?.eventId || null };
      delete finalMemoryData.tripId; delete finalMemoryData.eventId;
      let savedOrUpdatedMemory;
      if (finalMemoryData.id) { 
        const response = await axios.put(`${BACKEND_URL}/api/memories/${finalMemoryData.id}`, finalMemoryData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedOrUpdatedMemory = response.data; alert('思い出を更新しました。');
      } else { 
        const response = await axios.post(`${BACKEND_URL}/api/memories`, finalMemoryData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedOrUpdatedMemory = response.data; alert('思い出を保存しました。');
      }
      const targetTripId = finalMemoryData.trip_id || savedOrUpdatedMemory?.trip_id || (editingMemoryForEvent?.tripId) || selectedTrip?.id;
      if (targetTripId) { 
        await fetchMemoriesForTrip(targetTripId); setViewingMemoriesForTripId(targetTripId);
        const currentTripData = trips.find(t => t.id === targetTripId);
        if (currentTripData) { setSelectedTrip(currentTripData); } 
        else { try { const tripResponse = await axios.get(`${BACKEND_URL}/api/trips/${targetTripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` } }); setSelectedTrip(tripResponse.data); } catch (tripError) { console.error(`Failed to fetch trip ${targetTripId} for setSelectedTrip.`, tripError);}}
      }
      actualSetCurrentScreen('memoryView'); setEditingMemoryForEvent(null);
    } catch (error) { console.error('Failed to save memory:', error.response?.data || error.message, error); alert(`思い出の保存に失敗しました: ${error.response?.data?.error || error.message}`); }
  };
  const fetchMemoriesForTrip = async (tripId) => {
    if (!currentUser || !currentUser.token || !tripId) { setTripMemories([]); return; }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trips/${tripId}/memories`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      setTripMemories(response.data || []);
    } catch (error) { console.error(`Failed to fetch memories for trip ${tripId}:`, error.response?.data || error.message); setTripMemories([]); }
  };
  const handleShowMemoryView = (tripId) => { 
    setViewingMemoriesForTripId(tripId); 
    const tripData = trips.find(t => t.id === tripId);
    if (tripData) { setSelectedTrip(tripData); }
    fetchMemoriesForTrip(tripId); 
    actualSetCurrentScreen('memoryView'); 
  };
  const handleDeleteMemory = async (memoryId) => { /* ... */ };

  const handleShowMyProfile = () => actualSetCurrentScreen('myProfile');
  const handleShowAccountSettings = () => actualSetCurrentScreen('accountSettings');
  const handleDeleteAccountRequest = () => actualSetCurrentScreen('accountDeletionConfirm');
  const handleConfirmAccountDeletion = async () => { alert('アカウント削除機能は開発中です。'); };
  const handleChangePasswordRequest = () => actualSetCurrentScreen('passwordChange');
  const handleConfirmPasswordChange = async (oldPassword, newPassword) => { alert('パスワード変更機能は開発中です。'); };
  const handleChangeEmailRequest = () => actualSetCurrentScreen('emailChange');
  const handleSendEmailConfirmation = async (newEmail) => { alert('メールアドレス変更機能は開発中です。'); };
  const handleBackToList = () => actualSetCurrentScreen('tripList');
  const handleChangeTripStatus = async (tripId, newStatus) => { alert('旅程ステータス変更機能は開発中です。'); };
  const handleToggleTripPublicStatus = async (tripId, isPublic) => { alert('旅程公開設定変更機能は開発中です。'); };
  const handleCopyMyOwnTrip = (tripToCopy) => { alert('旅程コピー機能は開発中です。'); };
  const handleShowHotelDetailModal = (tripId, date, hotelData = null) => { setEditingHotelDetails({ tripId, date, hotelData: hotelData || {} }); };
  const handleSaveHotelDetails = async (tripId, date, newHotelData) => { /* ... */ };
  const handleCancelHotelDetailModal = () => { setEditingHotelDetails(null); };
  const handleSetHotelForDay = (tripId, date) => { handleShowHotelDetailModal(tripId, date, null); };
  const handleShowPlaceSearchGeneral = (callback, returnScreen) => { setPlaceSearchContext({ callback, returnScreen }); actualSetCurrentScreen('placeSearch'); };
  const handleShowPlaceSearchForPlanForm = (callback) => { setPlaceSearchContext({ callback, returnScreen: 'planForm', forContext: 'planForm' }); actualSetCurrentScreen('placeSearch'); };
  const handleShowPlaceSearchForEvent = (callback) => { setPlaceSearchContext({ callback, returnScreen: 'eventForm', forContext: 'eventForm' }); actualSetCurrentScreen('placeSearch'); };
  const newHandlePlaceSelected = (place) => { if (placeSearchContext?.callback) { placeSearchContext.callback(place); } actualSetCurrentScreen(placeSearchContext?.returnScreen || 'tripList'); setPlaceSearchContext(null); };
  const handleShowPlaceDetail = (place) => { setSelectedPlaceDetail(place); actualSetCurrentScreen('placeDetail'); };
  const handleBackFromPlaceDetail = () => { actualSetCurrentScreen(placeSearchContext?.returnScreen || 'tripList'); setSelectedPlaceDetail(null); };
  const handleShowRouteOptions = (origin, destination) => { setCurrentRouteQuery({ origin, destination }); actualSetCurrentScreen('routeOptions'); };
  const handleRouteSelected = (route) => { alert('ルート選択機能は開発中です。'); actualSetCurrentScreen('tripDetail'); };
  const handleShowPublicTripsSearch = () => { actualSetCurrentScreen('publicTripsSearch'); };
  const handleSelectPublicTrip = (publicTrip) => { setSelectedPublicTripDetail(publicTrip); actualSetCurrentScreen('publicTripDetail'); };
  const handleCopyToMyPlans = (publicTrip) => { alert('旅程コピー機能は開発中です。'); };
  const handleShowPublishSettings = (tripId) => { setEditingPublishSettingsForTripId(tripId); actualSetCurrentScreen('tripPublishSettings'); };
  const handleSavePublishSettings = async (tripId, settings) => { alert('公開設定保存機能は開発中です。'); actualSetCurrentScreen('tripDetail'); };
  const handleCancelPublishSettings = () => { actualSetCurrentScreen('tripDetail'); setEditingPublishSettingsForTripId(null);};
  const handleShowFavoritePlaces = () => { actualSetCurrentScreen('favoritePlacesList'); };
  const handleAddFavoritePlace = async (place) => { alert('お気に入り追加機能は開発中です。'); };
  const handleRemoveFavoritePlace = async (placeId) => { alert('お気に入り削除機能は開発中です。'); };
  const handleShowFavoritePickerForEvent = (callback) => { setFavoritePickerContext({ callback, returnScreen: 'eventForm' }); actualSetCurrentScreen('favoritePicker'); };
  const handleRequestAIForTrip = async (trip) => { alert('AI旅程提案機能は開発中です。'); };
  const handleShowHotelRecommendations = (hotel) => { setCurrentHotelForRecommendations(hotel); actualSetCurrentScreen('hotelRecommendations'); };
  const handleRequestAICourse = async (hotel, preferences) => { alert('AIホテル周辺コース提案機能は開発中です。'); };

  return {
    currentScreen, 
    setCurrentScreen: actualSetCurrentScreen,
    currentUser, 
    userProfile, 
    handleLogin, 
    handleSignup, 
    handleLogout,
    handleSendPasswordResetLink, 
    handleConfirmCodeAndSetNewPassword,
    editingPlan, setEditingPlan,
    selectedTrip, setSelectedTrip,
    trips, setTrips,
    editingScheduleForTripId, setEditingScheduleForTripId,
    editingScheduleData, setEditingScheduleData,
    editingEventDetails, setEditingEventDetails,
    editingMemoryForEvent, setEditingMemoryForEvent,
    viewingMemoriesForTripId, setViewingMemoriesForTripId,
    tripMemories, setTripMemories,
    selectedPlaceDetail, setSelectedPlaceDetail, 
    currentRouteQuery, setCurrentRouteQuery,
    selectedPublicTripDetail, setSelectedPublicTripDetail,
    currentHotelForRecommendations, setCurrentHotelForRecommendations,
    placeSearchContext, setPlaceSearchContext,
    aiRecommendedCourses, setAiRecommendedCourses,
    favoritePickerContext, setFavoritePickerContext,
    editingPublishSettingsForTripId, setEditingPublishSettingsForTripId,
    editingHotelDetails, setEditingHotelDetails,
    fetchMyTrips, 
    fetchUserProfile, 
    setUserProfile,
    handleShowProfileEdit, handleSaveProfile,
    handleShowPlanForm, handleShowTripDetail, handleSavePlan, handleDeleteTrip, handleCancelPlanForm,
    handleShowScheduleForm, handleSaveSchedule, handleCancelScheduleForm,
    handleShowEventForm, handleSaveEvent, handleDeleteEvent, fetchEventsByScheduleId,
    handleShowMemoryForm, handleSaveMemory, handleShowMemoryView, handleDeleteMemory, fetchMemoriesForTrip,
    handleShowMyProfile, handleShowAccountSettings, handleDeleteAccountRequest, handleConfirmAccountDeletion,
    handleChangePasswordRequest, handleConfirmPasswordChange, handleChangeEmailRequest, handleSendEmailConfirmation,
    handleBackToList, handleChangeTripStatus, handleToggleTripPublicStatus,
    handleCopyMyOwnTrip, handleShowHotelDetailModal, handleSaveHotelDetails, handleCancelHotelDetailModal,
    handleSetHotelForDay, handleShowPlaceSearchGeneral, handleShowPlaceSearchForPlanForm,
    handleShowPlaceSearchForEvent, newHandlePlaceSelected, handleShowPlaceDetail,
    handleBackFromPlaceDetail, handleShowRouteOptions, handleRouteSelected,
    handleShowPublicTripsSearch, handleSelectPublicTrip, handleCopyToMyPlans,
    handleShowPublishSettings, handleSavePublishSettings, handleCancelPublishSettings,
    handleShowFavoritePlaces, handleAddFavoritePlace, handleRemoveFavoritePlace,
    handleShowFavoritePickerForEvent, handleRequestAIForTrip,
    handleShowHotelRecommendations, handleRequestAICourse,
    handleShowBackendTest: () => actualSetCurrentScreen('backendTest'),
  };
};
