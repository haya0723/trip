import React from 'react';
import './App.css';
import { useAppLogic } from './hooks/useAppLogic'; // カスタムフックをインポート

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

function App() {
  const {
    currentScreen, setCurrentScreen,
    editingPlan,
    selectedTrip,
    selectedPlaceDetail,
    currentRouteQuery,
    editingMemoryForEvent,
    viewingMemoriesForTripId,
    selectedPublicTripDetail,
    currentHotelForRecommendations,
    userProfile,
    currentUser,
    trips,
    editingEventDetails,
    placeSearchContext,
    aiRecommendedCourses,
    favoritePickerContext, setFavoritePickerContext,
    handleShowPlanForm, handleShowTripDetail, handleSavePlan, handleCancelPlanForm, handleBackToList,
    handleRequestAIForTrip, handleShowPlaceSearchGeneral, handleShowPlaceSearchForPlanForm,
    handleShowPlaceSearchForEvent, handleSetHotelForDay, newHandlePlaceSelected,
    handleShowPlaceDetail, handleBackFromPlaceDetail, handleShowRouteOptions, handleRouteSelected,
    handleShowMemoryForm, handleSaveMemory, handleShowMemoryView, handleShowPublicTripsSearch,
    handleSelectPublicTrip, handleCopyToMyPlans, handleCopyMyOwnTrip, handleAddFavoritePlace,
    handleRemoveFavoritePlace, handleShowHotelRecommendations, handleShowProfileEdit, handleSaveProfile,
    handleShowAccountSettings, handleLogin, handleSignup, handleLogout, handleChangeTripStatus,
    handleToggleTripPublicStatus, handleShowEventForm, handleSaveEvent, handleDeleteAccountRequest,
    handleConfirmAccountDeletion, handleChangePasswordRequest, handleConfirmPasswordChange,
    handleChangeEmailRequest, handleSendEmailConfirmation, handleSendPasswordResetLink,
    handleConfirmCodeAndSetNewPassword, handleShowMyProfile, handleShowFavoritePlaces,
    handleShowFavoritePickerForEvent, handleRequestAICourse
  } = useAppLogic();

  let screenComponent;
  if (!currentUser && !['login', 'signup', 'passwordReset', 'accountDeletionConfirm'].includes(currentScreen)) {
    screenComponent = <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  } else if (currentScreen === 'login') {
    screenComponent = <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  } else if (currentScreen === 'planForm') {
    screenComponent = <PlanFormScreen currentPlan={editingPlan} onSave={handleSavePlan} onCancel={handleCancelPlanForm} onShowPlaceSearch={handleShowPlaceSearchForPlanForm} />;
  } else if (currentScreen === 'tripDetail') {
    screenComponent = <TripDetailScreen trip={selectedTrip} onBack={handleBackToList} onEditPlanBasics={handleShowPlanForm} onRequestAI={() => handleRequestAIForTrip(selectedTrip)} onShowRouteOptions={handleShowRouteOptions} onAddMemoryForEvent={(eventName, date) => handleShowMemoryForm(selectedTrip.id, eventName, date)} onShowHotelRecommendations={(hotel) => handleShowHotelRecommendations(hotel)} onAddEventToDay={(date) => handleShowEventForm(selectedTrip.id, date)} onViewOverallMemories={handleShowMemoryView} onChangeTripStatus={handleChangeTripStatus} onSetHotelForDay={(date) => handleSetHotelForDay(selectedTrip.id, date)} onTogglePublicStatus={handleToggleTripPublicStatus} onCopyMyOwnTrip={handleCopyMyOwnTrip} />;
  } else if (currentScreen === 'placeSearch') {
    screenComponent = <PlaceSearchScreen onSelectPlace={newHandlePlaceSelected} onCancel={() => { if (placeSearchContext && placeSearchContext.returnScreen) { setCurrentScreen(placeSearchContext.returnScreen); } else if (editingPlan) { setCurrentScreen('planForm'); } else { setCurrentScreen('tripList'); } }} />;
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
  } else if (currentScreen === 'memoryForm') {
    screenComponent = <MemoryFormScreen tripId={editingMemoryForEvent?.tripId} eventName={editingMemoryForEvent?.eventName} existingMemory={editingMemoryForEvent?.existingMemory} onSaveMemory={handleSaveMemory} onCancel={() => setCurrentScreen(editingMemoryForEvent?.tripId ? 'memoryView' : 'tripDetail')} />;
  } else if (currentScreen === 'memoryView') {
    const memoryTripData = trips.find(t => t.id === viewingMemoriesForTripId);
    screenComponent = <MemoryViewScreen tripId={viewingMemoriesForTripId} tripData={memoryTripData} onBack={() => setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList')} onEditOverallMemory={(tid) => handleShowMemoryForm(tid, null, null)} onEditEventMemory={(tid, date, eventName) => handleShowMemoryForm(tid, eventName, date)} />;
  } else if (currentScreen === 'publicTripsSearch') {
    screenComponent = <PublicTripsSearchScreen onSelectPublicTrip={handleSelectPublicTrip} onCancel={() => setCurrentScreen('tripList')} />;
  } else if (currentScreen === 'publicTripDetail') {
    screenComponent = <PublicTripDetailScreen publicTripData={selectedPublicTripDetail} onBack={() => setCurrentScreen('publicTripsSearch')} onCopyToMyPlans={handleCopyToMyPlans} />;
  } else if (currentScreen === 'hotelRecommendations') {
    screenComponent = <HotelRecommendationsScreen hotel={currentHotelForRecommendations} onBack={() => { setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList');}} onSelectPlace={handleShowPlaceDetail} onAICourseRequest={handleRequestAICourse} aiRecommendedCourses={aiRecommendedCourses} />;
  } else if (currentScreen === 'profileEdit') {
    screenComponent = <ProfileEditScreen userProfile={userProfile} onSaveProfile={handleSaveProfile} onCancel={() => setCurrentScreen('myProfile')} />;
  } else if (currentScreen === 'accountSettings') {
    screenComponent = <AccountSettingsScreen userEmail={userProfile?.email || 'test@example.com'} onChangeEmail={handleChangeEmailRequest} onChangePassword={handleChangePasswordRequest} onLogout={handleLogout} onDeleteAccount={handleDeleteAccountRequest} onBack={handleShowMyProfile} />;
  } else if (currentScreen === 'signup') {
    screenComponent = <SignupScreen onSignup={handleSignup} onNavigateToLogin={() => setCurrentScreen('login')} />;
  } else if (currentScreen === 'passwordReset') {
    screenComponent = <PasswordResetScreen onSendResetLink={handleSendPasswordResetLink} onNavigateToLogin={() => setCurrentScreen('login')} onConfirmCodeAndSetNewPassword={handleConfirmCodeAndSetNewPassword} />;
  } else if (currentScreen === 'eventForm' && editingEventDetails) {
    screenComponent = <EventFormScreen date={editingEventDetails.date} existingEvent={editingEventDetails.existingEvent} onSaveEvent={handleSaveEvent} onCancel={() => setCurrentScreen('tripDetail')} onShowPlaceSearch={handleShowPlaceSearchForEvent} onShowFavoritePicker={handleShowFavoritePickerForEvent} />;
  } 
  else if (currentScreen === 'accountDeletionConfirm') { 
    screenComponent = <AccountDeletionConfirmScreen userEmail={currentUser?.email} onConfirm={handleConfirmAccountDeletion} onCancel={() => setCurrentScreen('accountSettings')} />;
  } 
  else if (currentScreen === 'passwordChange') { 
    screenComponent = <PasswordChangeScreen onConfirm={handleConfirmPasswordChange} onCancel={() => setCurrentScreen('accountSettings')} />;
  }
  else if (currentScreen === 'emailChange') { 
    screenComponent = <EmailChangeScreen currentEmail={currentUser?.email} onSendConfirm={handleSendEmailConfirmation} onCancel={() => setCurrentScreen('accountSettings')} />;
  }
  else if (currentScreen === 'myProfile') {
    screenComponent = <MyProfileScreen userProfile={userProfile} onEditProfile={handleShowProfileEdit} onShowAccountSettings={handleShowAccountSettings} onLogout={handleLogout} onShowFavoritePlaces={handleShowFavoritePlaces} />; 
  }
  else if (currentScreen === 'favoritePlacesList') {
    screenComponent = <FavoritePlacesScreen 
                        favoritePlaces={userProfile.favoritePlaces} 
                        onSelectPlace={handleShowPlaceDetail} 
                        onRemoveFavorite={handleRemoveFavoritePlace} 
                        onBack={handleShowMyProfile} 
                      />;
  }
  else if (currentScreen === 'favoritePicker' && favoritePickerContext) {
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
  }
  else { 
    screenComponent = <TripListScreen trips={trips} onAddNewPlan={() => handleShowPlanForm()} onEditPlan={handleShowPlanForm} onSelectTrip={handleShowTripDetail} onViewMemories={(tripId) => handleShowMemoryView(tripId)} onShowPublicTripsSearch={handleShowPublicTripsSearch} onShowProfileEdit={handleShowMyProfile} />;
  }
  
  const screensWithoutNavBar = ['login', 'signup', 'passwordReset', 'planForm', 'memoryForm', 'profileEdit', 'placeSearch', 'routeOptions', 'eventForm', 'accountDeletionConfirm', 'passwordChange', 'emailChange', 'accountSettings', 'favoritePlacesList', 'favoritePicker'];
  const showNavBar = currentUser && !screensWithoutNavBar.includes(currentScreen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flexGrow: 1, paddingBottom: showNavBar ? '70px' : '0' }}>
        {screenComponent}
      </div>
      {showNavBar && <BottomNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
    </div>
  );
}

export default App;
