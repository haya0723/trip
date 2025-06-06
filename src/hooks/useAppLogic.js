import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const BACKEND_URL = 'https://trip-app-final-v2-493005991008.asia-northeast1.run.app'; 

export const initialDummyPublicTrips = [ /* ... */ ]; 


export const useAppLogic = () => {
  console.log('[useAppLogic] useAppLogic hook called - TOP LEVEL');
  const [currentScreen, setCurrentScreen] = useState('login');
  const [editingPlan, setEditingPlan] = useState(null); 
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null); 
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
  const [editingEventDetails, setEditingEventDetails] = useState(null); // { tripId, date, scheduleId, event (eventToEdit) }
  const [placeSearchContext, setPlaceSearchContext] = useState(null);
  const [aiRecommendedCourses, setAiRecommendedCourses] = useState([]);
  const [favoritePickerContext, setFavoritePickerContext] = useState(null);
  const [editingPublishSettingsForTripId, setEditingPublishSettingsForTripId] = useState(null);
  const [editingHotelDetails, setEditingHotelDetails] = useState(null); 
  const [editingScheduleForTripId, setEditingScheduleForTripId] = useState(null); 
  const [editingScheduleData, setEditingScheduleData] = useState(null); 

  const fetchUserProfile = async (userId, token) => {
    console.log('[useAppLogic] fetchUserProfile called for userId:', userId);
    if (!token) {
      console.log('[useAppLogic] fetchUserProfile - No token, skipping fetch.');
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data || { nickname: '', bio: '', avatarUrl: '', favoritePlaces: [] });
      console.log('[useAppLogic] fetchUserProfile - Profile fetched:', response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response ? error.response.data : error.message);
    }
  };

  const fetchMyTrips = async (token) => {
    console.log('[useAppLogic] fetchMyTrips called.');
    if (!token) {
      console.log('[useAppLogic] fetchMyTrips - No token, skipping fetch.');
      setTrips([]);
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(response.data || []);
      console.log('[useAppLogic] fetchMyTrips - Trips fetched:', response.data);
    } catch (error) {
      console.error('Failed to fetch trips:', error.response ? error.response.data : error.message);
      setTrips([]);
    }
  };
  
  useEffect(() => {
    console.log('[useAppLogic] Initial useEffect triggered');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const user = JSON.parse(storedUser);
      console.log('[useAppLogic] Found stored user and token:', user);
      setCurrentUser({ ...user, token: storedToken });
    } else {
      console.log('[useAppLogic] No stored user or token, showing login screen.');
      setCurrentScreen('login');
    }
  }, []);

  useEffect(() => {
    console.log('[useAppLogic] currentUser useEffect triggered. currentUser:', currentUser);
    if (currentUser && currentUser.token) {
      console.log('[useAppLogic] currentUser is set, fetching profile and trips.');
      fetchUserProfile(currentUser.id, currentUser.token);
      fetchMyTrips(currentUser.token);
      if (currentScreen === 'login' || currentScreen === 'signup') {
        setCurrentScreen('tripList');
      }
    } else {
      console.log('[useAppLogic] currentUser is null or no token, resetting profile and trips.');
      setUserProfile({ nickname: '', bio: '', avatarUrl: '', favoritePlaces: [] });
      setTrips([]);
      if (currentScreen !== 'signup' && currentScreen !== 'passwordReset') {
         setCurrentScreen('login');
      }
    }
  }, [currentUser]); 

  const handleSignup = async (signupData) => { /* ... */ };
  const handleLogin = async (loginData) => { /* ... */ };
  const handleLogout = () => { /* ... */ };
  const handleSendPasswordResetLink = async (email) => { /* ... */ };
  const handleConfirmCodeAndSetNewPassword = async (code, newPassword) => { /* ... */ };
  const handleShowProfileEdit = () => setCurrentScreen('profileEdit');
  const handleSaveProfile = async (profileDataToUpdate, avatarFile = null) => { /* ... */ };
  const handleShowPlanForm = (planToEdit = null) => { /* ... */ };
  const handleShowTripDetail = (trip) => { /* ... */ };
  const handleSavePlan = async (planData) => { /* ... */ };
  const handleDeleteTrip = async (tripId) => { /* ... */ };
  const handleCancelPlanForm = () => { /* ... */ };
  const handleShowScheduleForm = (tripId, scheduleToEdit = null) => { /* ... */ };
  const handleSaveSchedule = async (tripId, scheduleData, scheduleId = null) => { /* ... */ };
  const handleCancelScheduleForm = () => { /* ... */ };
  
  const handleShowEventForm = (tripId, date, scheduleId, eventToEdit = null) => {
    console.log('[useAppLogic] handleShowEventForm called for trip:', tripId, 'date:', date, 'scheduleId:', scheduleId, 'eventToEdit:', eventToEdit);
    setEditingEventDetails({ tripId, date, scheduleId, event: eventToEdit });
    setCurrentScreen('eventForm');
  };

  const handleSaveEvent = async (tripId, scheduleId, eventData, eventId = null) => {
    console.log('[useAppLogic] handleSaveEvent called for trip:', tripId, 'scheduleId:', scheduleId, 'eventData:', eventData, 'eventId:', eventId);
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    try {
      let response;
      if (eventId) { // 更新
        response = await axios.put(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}/events/${eventId}`, eventData, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
      } else { // 新規作成
        response = await axios.post(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}/events`, eventData, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
      }
      
      // APIのレスポンスは更新/作成されたイベントオブジェクトを期待。
      // 旅程全体を再取得してselectedTripを更新する
      if (response && response.data) { // response.data がイベントオブジェクトだと仮定
        const updatedTripResponse = await axios.get(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` }});
        if (updatedTripResponse.data) {
          setSelectedTrip(updatedTripResponse.data);
          setTrips(prevTrips => prevTrips.map(t => t.id === tripId ? updatedTripResponse.data : t));
        }
      }
      
      setCurrentScreen('tripDetail');
      setEditingEventDetails(null);
      alert(eventId ? '予定を更新しました。' : '新しい予定を作成しました。');
    } catch (error) {
      console.error('Failed to save event:', error.response ? error.response.data : error.message);
      alert(`予定の保存に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteEvent = async (tripId, scheduleId, eventId) => { /* ... */ };
  
  const fetchEventsByScheduleId = async (scheduleId, token) => { /* ... */ };
  const handleShowMyProfile = () => setCurrentScreen('myProfile');
  const handleShowAccountSettings = () => setCurrentScreen('accountSettings');
  const handleDeleteAccountRequest = () => setCurrentScreen('accountDeletionConfirm');
  const handleConfirmAccountDeletion = async () => { /* ... */ };
  const handleChangePasswordRequest = () => setCurrentScreen('passwordChange');
  const handleConfirmPasswordChange = async (oldPassword, newPassword) => { /* ... */ };
  const handleChangeEmailRequest = () => setCurrentScreen('emailChange');
  const handleSendEmailConfirmation = async (newEmail) => { /* ... */ };
  const handleBackToList = () => setCurrentScreen('tripList');
  const handleChangeTripStatus = async (tripId, newStatus) => { /* ... */ };
  const handleToggleTripPublicStatus = async (tripId, isPublic) => { /* ... */ };
  const handleCopyMyOwnTrip = (tripToCopy) => { /* ... */ };
  const handleShowHotelDetailModal = (tripId, date, hotelData = null) => { /* ... */ };
  const handleSaveHotelDetails = async (tripId, date, newHotelData) => { /* ... (previous implementation with detailed log) ... */ };
  const handleCancelHotelDetailModal = () => { /* ... */ };
  const handleSetHotelForDay = (tripId, date) => { /* ... */ };
  const handleShowPlaceSearchGeneral = (callback, returnScreen) => { /* ... */ };
  const handleShowPlaceSearchForPlanForm = (callback) => { /* ... */ };
  const handleShowPlaceSearchForEvent = (callback) => { /* ... */ };
  const newHandlePlaceSelected = (place) => { /* ... */ };
  const handleShowPlaceDetail = (place) => { /* ... */ };
  const handleBackFromPlaceDetail = () => { /* ... */ };
  const handleShowRouteOptions = (origin, destination) => { /* ... */ };
  const handleRouteSelected = (route) => { /* ... */ };
  const handleShowMemoryForm = (tripId, eventName, date, existingMemory = null) => { /* ... */ };
  const handleSaveMemory = async (memoryData) => { /* ... */ };
  const handleShowMemoryView = (tripId) => { /* ... */ };
  const handleShowPublicTripsSearch = () => { /* ... */ };
  const handleSelectPublicTrip = (publicTrip) => { /* ... */ };
  const handleCopyToMyPlans = (publicTrip) => { /* ... */ };
  const handleShowPublishSettings = (tripId) => { /* ... */ };
  const handleSavePublishSettings = async (tripId, settings) => { /* ... */ };
  const handleCancelPublishSettings = () => { /* ... */ };
  const handleShowFavoritePlaces = () => { /* ... */ };
  const handleAddFavoritePlace = async (place) => { /* ... */ };
  const handleRemoveFavoritePlace = async (placeId) => { /* ... */ };
  const handleShowFavoritePickerForEvent = (callback) => { /* ... */ };
  const handleRequestAIForTrip = async (trip) => { /* ... */ };
  const handleShowHotelRecommendations = (hotel) => { /* ... */ };
  const handleRequestAICourse = async (hotel, preferences) => { /* ... */ };

  return {
    currentScreen, setCurrentScreen,
    editingPlan, setEditingPlan,
    selectedTrip, setSelectedTrip,
    selectedPlaceDetail, setSelectedPlaceDetail, 
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
    editingHotelDetails, setEditingHotelDetails,
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
    fetchEventsByScheduleId, 
    handleSaveEvent,         
    handleDeleteEvent,       
    handleShowEventForm, 
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
    handleSetHotelForDay, 
    handleShowHotelDetailModal, 
    handleSaveHotelDetails, 
    handleCancelHotelDetailModal 
  };
};
