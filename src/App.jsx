import React, { Suspense, lazy, useEffect, useRef } from 'react'; // useRef を追加
import './App.css';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { useTrips } from './hooks/useTrips'; 
import { useSchedules } from './hooks/useSchedules';
import { useEvents } from './hooks/useEvents';
import { useMemories } from './hooks/useMemories';
import { useHotels } from './hooks/useHotels';
import { useFavorites } from './hooks/useFavorites';
import AppRouter from './AppRouter';
import { BottomNavBar, HotelDetailModal } from './components';

const LoadingFallback = () => <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>読み込み中...</div>;

function App() {
  // setCurrentScreen の参照を保持するための ref
  const setCurrentScreenRef = useRef(null);

  // useAuth フックを初期化。setCurrentScreen は ref を介して後から設定
  const auth = useAuth((screen) => {
    if (setCurrentScreenRef.current) {
      setCurrentScreenRef.current(screen);
    } else {
      console.warn("setCurrentScreenRef.current is not yet set in useAuth callback");
    }
  });
  const { 
    currentUser, 
    userProfile, 
    fetchUserProfile,
    handleLogin, 
    handleSignup, 
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
  } = auth;

  // useNavigation フックを currentUser を使って初期化
  const navigation = useNavigation(currentUser);
  const { currentScreen, setCurrentScreen } = navigation;

  // useNavigation から取得した setCurrentScreen を ref に設定
  useEffect(() => {
    setCurrentScreenRef.current = setCurrentScreen;
  }, [setCurrentScreen]);


  const tripsHook = useTrips(currentUser, setCurrentScreen);
  const {
    trips, setTrips, 
    selectedTrip, setSelectedTrip, 
    editingPlan,
    handleShowPlanForm,
    handleShowTripDetail,
    handleSavePlan,
    handleDeleteTrip,
    handleCancelPlanForm,
    handleBackToList,
  } = tripsHook;

  const schedulesHook = useSchedules(currentUser, setCurrentScreen, setTrips, setSelectedTrip);
  const {
    editingScheduleForTripId,
    editingScheduleData,
    handleShowScheduleForm,
    handleSaveSchedule,
    handleCancelScheduleForm,
  } = schedulesHook;

  const eventsHook = useEvents(currentUser, setCurrentScreen, setTrips, setSelectedTrip);
  const {
    editingEventDetails,
    handleShowEventForm,
    handleSaveEvent,
    handleDeleteEvent,
    fetchEventsByScheduleId,
  } = eventsHook;

  const memoriesHook = useMemories(currentUser, setCurrentScreen, selectedTrip, setSelectedTrip, trips);
  const {
    editingMemoryForEvent,
    viewingMemoriesForTripId,
    tripMemories,
    handleShowMemoryForm,
    handleSaveMemory,
    fetchMemoriesForTrip,
    handleShowMemoryView,
    handleDeleteMemory,
  } = memoriesHook;
  
  const hotelsHook = useHotels(currentUser, trips, setTrips, setSelectedTrip);
  const {
    editingHotelDetails,
    handleShowHotelDetailModal,
    handleSaveHotelDetails,
    handleCancelHotelDetailModal,
    handleSetHotelForDay,
  } = hotelsHook;
  
  const favoritesHook = useFavorites(currentUser, userProfile, fetchUserProfile, setCurrentScreen);
  const {
    handleShowFavoritePlaces,
    handleAddFavoritePlace,
    handleRemoveFavoritePlace,
    favoritePickerContext,
    setFavoritePickerContext,
    handleShowFavoritePickerForEvent,
  } = favoritesHook;

  const handleShowMyProfile = () => setCurrentScreen('myProfile');
  const handleShowPublicTripsSearch = () => setCurrentScreen('publicTripsSearch');
  
  const appLogicProps = {
    currentScreen, setCurrentScreen,
    currentUser, userProfile, 
    handleLogin, handleSignup, handleLogout,
    handleSendPasswordResetLink, handleConfirmCodeAndSetNewPassword,
    handleShowProfileEdit, handleSaveProfile,
    handleShowAccountSettings, handleChangePasswordRequest, handleConfirmPasswordChange,
    handleChangeEmailRequest, handleSendEmailConfirmation, handleDeleteAccountRequest, handleConfirmAccountDeletion,
    
    trips, selectedTrip, editingPlan,
    handleShowPlanForm, handleShowTripDetail, handleSavePlan, handleDeleteTrip, handleCancelPlanForm, handleBackToList,

    editingScheduleForTripId, editingScheduleData,
    handleShowScheduleForm, handleSaveSchedule, handleCancelScheduleForm,

    editingEventDetails,
    handleShowEventForm, handleSaveEvent, handleDeleteEvent, fetchEventsByScheduleId,

    editingMemoryForEvent, viewingMemoriesForTripId, tripMemories,
    handleShowMemoryForm, handleSaveMemory, fetchMemoriesForTrip, handleShowMemoryView, handleDeleteMemory,

    editingHotelDetails, handleShowHotelDetailModal, handleSaveHotelDetails, handleCancelHotelDetailModal, handleSetHotelForDay,

    handleShowFavoritePlaces, handleAddFavoritePlace, handleRemoveFavoritePlace,
    favoritePickerContext, setFavoritePickerContext, handleShowFavoritePickerForEvent,

    handleShowMyProfile, handleShowPublicTripsSearch,

    // Placeholders for remaining props
    selectedPlaceDetail: null, currentRouteQuery: null, selectedPublicTripDetail: null, 
    currentHotelForRecommendations: null, placeSearchContext: null, 
    aiRecommendedCourses: [], editingPublishSettingsForTripId: null,
  };
  
  const screensWithoutNavBar = ['login', 'signup', 'passwordReset'];
  const showNavBar = currentUser && !screensWithoutNavBar.includes(currentScreen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flexGrow: 1, paddingBottom: showNavBar ? '70px' : '0' }}>
        <Suspense fallback={<LoadingFallback />}>
          <AppRouter appLogic={appLogicProps} />
        </Suspense>
      </div>
      {showNavBar && <BottomNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}

      {editingHotelDetails && (
        <HotelDetailModal 
          hotelData={editingHotelDetails.hotelData}
          onSave={(newHotelData) => handleSaveHotelDetails(editingHotelDetails.tripId, editingHotelDetails.date, newHotelData)}
          onCancel={handleCancelHotelDetailModal}
        />
      )}
    </div>
  );
}

export default App;
