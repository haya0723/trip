import React from 'react';
import './App.css';
import { useAppLogic } from './hooks/useAppLogic'; 

// component imports
import TripListScreen from './components/TripListScreen';
import PlanFormScreen from './components/PlanFormScreen';
import TripDetailScreen from './components/TripDetailScreen';
import PlaceSearchScreen from './components/PlaceSearchScreen';
import PlaceDetailScreen from './components/PlaceDetailScreen';
import RouteOptionsScreen from './components/RouteOptionsScreen';
import MemoryFormScreen from './components/MemoryFormScreen';
import MemoryViewScreen from './components/MemoryViewScreen';
import PublicTripsSearchScreen from './components/PublicTripsSearchScreen';
import PublicTripDetailScreen from './components/PublicTripDetailScreen';
import HotelRecommendationsScreen from './components/HotelRecommendationsScreen';
import ProfileEditScreen from './components/ProfileEditScreen';
import AccountSettingsScreen from './components/AccountSettingsScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import PasswordResetScreen from './components/PasswordResetScreen';
import BottomNavBar from './components/BottomNavBar';
import EventFormScreen from './components/EventFormScreen.jsx';
import AccountDeletionConfirmScreen from './components/AccountDeletionConfirmScreen';
import PasswordChangeScreen from './components/PasswordChangeScreen';
import EmailChangeScreen from './components/EmailChangeScreen';
import MyProfileScreen from './components/MyProfileScreen';
import FavoritePlacesScreen from './components/FavoritePlacesScreen';
import TripPublishSettingsScreen from './components/TripPublishSettingsScreen';
import HotelDetailModal from './components/HotelDetailModal';
import BackendTestScreen from './components/BackendTestScreen';
import ScheduleFormScreen from './components/ScheduleFormScreen';

function App() {
  const appLogic = useAppLogic(); 
  const {
    currentScreen, setCurrentScreen,
    editingPlan,
    selectedTrip,
    userProfile,
    currentUser,
    trips,
    editingScheduleForTripId, 
    editingScheduleData,
    handleLogin, handleSignup, handleLogout,
    handleShowMyProfile, handleShowProfileEdit, handleSaveProfile,
    handleShowAccountSettings, handleDeleteAccountRequest, handleConfirmAccountDeletion,
    handleChangePasswordRequest, handleChangeEmailRequest, handleSendEmailConfirmation,
    handleSendPasswordResetLink, handleConfirmCodeAndSetNewPassword,
    handleShowPlanForm, handleShowTripDetail, handleSavePlan, handleDeleteTrip,
    handleBackToList, handleChangeTripStatus, handleToggleTripPublicStatus,
    handleCopyMyOwnTrip, handleCancelPlanForm,
    handleShowScheduleForm, handleSaveSchedule, handleCancelScheduleForm,
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
    handleShowBackendTest,
    selectedPlaceDetail,
    viewingMemoriesForTripId,
    // handleDeleteTrip, // 重複のため削除
    editingEventDetails,
    currentHotelForRecommendations, aiRecommendedCourses,
    placeSearchContext,
    favoritePickerContext, setFavoritePickerContext,
    editingPublishSettingsForTripId,
    editingHotelDetails,
    handleConfirmPasswordChange 
  } = appLogic;

  let screenComponent;
  if (!currentUser && !['login', 'signup', 'passwordReset'].includes(currentScreen)) {
    screenComponent = <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  } else if (currentScreen === 'login') {
    screenComponent = <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  } else if (currentScreen === 'signup') {
    screenComponent = <SignupScreen onSignup={handleSignup} onNavigateToLogin={() => setCurrentScreen('login')} />;
  } else if (currentScreen === 'passwordReset') {
    screenComponent = <PasswordResetScreen onSendResetLink={handleSendPasswordResetLink} onNavigateToLogin={() => setCurrentScreen('login')} onConfirmCodeAndSetNewPassword={handleConfirmCodeAndSetNewPassword} />;
  } else if (currentScreen === 'planForm') {
    screenComponent = <PlanFormScreen currentPlan={editingPlan} onSave={handleSavePlan} onCancel={handleCancelPlanForm} onShowPlaceSearch={handleShowPlaceSearchForPlanForm} />;
  } else if (currentScreen === 'tripDetail') {
    screenComponent = <TripDetailScreen 
                        trip={selectedTrip} 
                        onBack={handleBackToList} 
                        onEditPlanBasics={handleShowPlanForm} 
                        onRequestAI={() => handleRequestAIForTrip(selectedTrip)} 
                        onShowRouteOptions={handleShowRouteOptions} 
                        onAddMemoryForEvent={(eventName, date) => handleShowMemoryForm(selectedTrip.id, eventName, date)} 
                        onShowHotelRecommendations={(hotel) => handleShowHotelRecommendations(hotel)} 
                        onAddEventToDay={(date) => handleShowEventForm(selectedTrip.id, date)} 
                        onViewOverallMemories={handleShowMemoryView} 
                        onChangeTripStatus={handleChangeTripStatus} 
                        onSetHotelForDay={(date) => handleSetHotelForDay(selectedTrip.id, date)} 
                        onTogglePublicStatus={handleToggleTripPublicStatus} 
                        onCopyMyOwnTrip={handleCopyMyOwnTrip} 
                        onShowPublishSettings={handleShowPublishSettings} 
                        onShowHotelDetailModal={handleShowHotelDetailModal}
                        onAddSchedule={handleShowScheduleForm}
                        onDeleteTrip={handleDeleteTrip} // onDeleteTrip prop を追加
                      />;
  } else if (currentScreen === 'scheduleForm') { 
    screenComponent = <ScheduleFormScreen 
                        tripId={editingScheduleForTripId} 
                        existingSchedule={editingScheduleData} 
                        onSave={handleSaveSchedule} 
                        onCancel={handleCancelScheduleForm} 
                      />;
  } else if (currentScreen === 'myProfile') { 
    screenComponent = <MyProfileScreen 
                        userProfile={userProfile} 
                        onEditProfile={handleShowProfileEdit} 
                        onShowAccountSettings={handleShowAccountSettings} 
                        onLogout={handleLogout} 
                        onShowFavoritePlaces={handleShowFavoritePlaces} 
                        onShowBackendTest={handleShowBackendTest} 
                      />;
  } else if (currentScreen === 'profileEdit') {
    screenComponent = <ProfileEditScreen userProfile={userProfile} onSaveProfile={handleSaveProfile} onCancel={handleShowMyProfile} />;
  } else if (currentScreen === 'accountSettings') {
    screenComponent = <AccountSettingsScreen userEmail={currentUser?.email} onChangeEmail={handleChangeEmailRequest} onChangePassword={handleChangePasswordRequest} onLogout={handleLogout} onDeleteAccount={handleDeleteAccountRequest} onBack={handleShowMyProfile} />;
  } else if (currentScreen === 'backendTest') { 
    screenComponent = <BackendTestScreen onBack={handleShowMyProfile} />;
  } else if (currentScreen === 'accountDeletionConfirm') { 
    screenComponent = <AccountDeletionConfirmScreen userEmail={currentUser?.email} onConfirm={handleConfirmAccountDeletion} onCancel={() => setCurrentScreen('accountSettings')} />;
  } else if (currentScreen === 'passwordChange') { 
    screenComponent = <PasswordChangeScreen onConfirm={handleConfirmPasswordChange} onCancel={() => setCurrentScreen('accountSettings')} />;
  } else if (currentScreen === 'emailChange') { 
    screenComponent = <EmailChangeScreen currentEmail={currentUser?.email} onSendConfirm={handleSendEmailConfirmation} onCancel={() => setCurrentScreen('accountSettings')} />;
  } else if (currentScreen === 'favoritePlacesList') {
    screenComponent = <FavoritePlacesScreen 
                        favoritePlaces={userProfile.favoritePlaces} 
                        onSelectPlace={handleShowPlaceDetail} 
                        onRemoveFavorite={handleRemoveFavoritePlace} 
                        onBack={handleShowMyProfile} 
                      />;
  } else if (currentScreen === 'favoritePicker' && favoritePickerContext) {
    screenComponent = <FavoritePlacesScreen 
                        favoritePlaces={userProfile.favoritePlaces} 
                        onSelectPlace={(place) => { 
                          favoritePickerContext.callback(place);
                          setCurrentScreen(favoritePickerContext.returnScreen);
                          setFavoritePickerContext(null);
                        }}
                        onRemoveFavorite={null} 
                        onBack={() => {
                           setCurrentScreen(favoritePickerContext.returnScreen);
                           setFavoritePickerContext(null);
                        }}
                        isPickerMode={true} 
                      />;
  } else if (currentScreen === 'tripPublishSettings' && editingPublishSettingsForTripId) {
    const tripToEditPublishSettings = trips.find(t => t.id === editingPublishSettingsForTripId);
    screenComponent = <TripPublishSettingsScreen 
                        trip={tripToEditPublishSettings} 
                        onSave={handleSavePublishSettings} 
                        onCancel={handleCancelPublishSettings} 
                      />;
  } else if (currentScreen === 'memoryForm') {
    screenComponent = <MemoryFormScreen tripId={editingMemoryForEvent?.tripId} eventName={editingMemoryForEvent?.eventName} existingMemory={editingMemoryForEvent?.existingMemory} onSaveMemory={handleSaveMemory} onCancel={() => setCurrentScreen(editingMemoryForEvent?.tripId ? 'memoryView' : 'tripDetail')} />;
  } else if (currentScreen === 'memoryView') {
    const memoryTripData = trips.find(t => t.id === viewingMemoriesForTripId);
    screenComponent = <MemoryViewScreen tripId={viewingMemoriesForTripId} tripData={memoryTripData} onBack={() => setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList')} onEditOverallMemory={(tid) => handleShowMemoryForm(tid, null, null)} onEditEventMemory={(tid, date, eventName) => handleShowMemoryForm(tid, eventName, date)} />;
  } else if (currentScreen === 'publicTripsSearch') { 
    screenComponent = <PublicTripsSearchScreen onSelectPublicTrip={handleSelectPublicTrip} onCancel={() => setCurrentScreen('tripList')} />;
  } else if (currentScreen === 'placeSearch') {
    screenComponent = <PlaceSearchScreen onSelectPlace={newHandlePlaceSelected} onCancel={() => { if (placeSearchContext && placeSearchContext.returnScreen) { setCurrentScreen(placeSearchContext.returnScreen); } else if (editingPlan) { setCurrentScreen('planForm'); } else { setCurrentScreen('tripList'); } }} context={placeSearchContext} />;
  } else if (currentScreen === 'placeDetail') {
    const dummyPlace = selectedPlaceDetail || { id: 'temp-dummy', name: 'ダミー場所', address: '住所未定', category: '不明', rating: 0 };
    const isFavorite = userProfile.favoritePlaces.some(fp => (fp.id || fp.name) === (dummyPlace.id || dummyPlace.name));
    screenComponent = <PlaceDetailScreen 
                        place={dummyPlace} 
                        onBack={handleBackFromPlaceDetail} 
                        onAddToList={(p) => console.log('リスト追加:', p.name)} 
                        onAddToTrip={(p) => console.log('旅程追加:', p.name)}
                        isFavorite={isFavorite}
                        onAddFavorite={handleAddFavoritePlace}
                        onRemoveFavorite={handleRemoveFavoritePlace} 
                      />;
  } else if (currentScreen === 'routeOptions') {
    screenComponent = <RouteOptionsScreen origin={currentRouteQuery?.origin} destination={currentRouteQuery?.destination} onSelectRoute={handleRouteSelected} onCancel={() => setCurrentScreen('tripDetail')} />;
  } else if (currentScreen === 'hotelRecommendations') {
    screenComponent = <HotelRecommendationsScreen hotel={currentHotelForRecommendations} onBack={() => { setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList');}} onSelectPlace={handleShowPlaceDetail} onAICourseRequest={handleRequestAICourse} aiRecommendedCourses={aiRecommendedCourses} />;
  } else if (currentScreen === 'eventForm' && editingEventDetails) {
    screenComponent = <EventFormScreen date={editingEventDetails.date} existingEvent={editingEventDetails.existingEvent} onSaveEvent={handleSaveEvent} onCancel={() => setCurrentScreen('tripDetail')} onShowPlaceSearch={handleShowPlaceSearchForEvent} onShowFavoritePicker={handleShowFavoritePickerForEvent} />;
  }
  else { 
    screenComponent = <TripListScreen trips={trips} onAddNewPlan={() => handleShowPlanForm()} onEditPlan={handleShowPlanForm} onSelectTrip={handleShowTripDetail} onViewMemories={(tripId) => handleShowMemoryView(tripId)} onShowPublicTripsSearch={handleShowPublicTripsSearch} onShowProfileEdit={handleShowMyProfile} />;
  }
  
  const screensWithoutNavBar = ['login', 'signup', 'passwordReset', 'planForm', 'scheduleForm', 'memoryForm', 'profileEdit', 'placeSearch', 'routeOptions', 'eventForm', 'accountDeletionConfirm', 'passwordChange', 'emailChange', 'accountSettings', 'favoritePlacesList', 'favoritePicker', 'tripPublishSettings', 'backendTest'];
  const showNavBar = currentUser && !screensWithoutNavBar.includes(currentScreen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flexGrow: 1, paddingBottom: showNavBar ? '70px' : '0' }}>
        {screenComponent}
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
