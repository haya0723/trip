import React, { Suspense, lazy } from 'react';

const LoadingFallback = () => <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>読み込み中...</div>;

// Lazy load screen components
const LoginScreen = lazy(() => import('./components/LoginScreen'));
const SignupScreen = lazy(() => import('./components/SignupScreen'));
const PasswordResetScreen = lazy(() => import('./components/PasswordResetScreen'));
const TripListScreen = lazy(() => import('./components/TripListScreen'));
const PlanFormScreen = lazy(() => import('./components/PlanFormScreen'));
const TripDetailScreen = lazy(() => import('./components/TripDetailScreen'));
const ScheduleFormScreen = lazy(() => import('./components/ScheduleFormScreen'));
const MyProfileScreen = lazy(() => import('./components/MyProfileScreen'));
const ProfileEditScreen = lazy(() => import('./components/ProfileEditScreen'));
const AccountSettingsScreen = lazy(() => import('./components/AccountSettingsScreen'));
const BackendTestScreen = lazy(() => import('./components/BackendTestScreen'));
const AccountDeletionConfirmScreen = lazy(() => import('./components/AccountDeletionConfirmScreen'));
const PasswordChangeScreen = lazy(() => import('./components/PasswordChangeScreen'));
const EmailChangeScreen = lazy(() => import('./components/EmailChangeScreen'));
const FavoritePlacesScreen = lazy(() => import('./components/FavoritePlacesScreen'));
const TripPublishSettingsScreen = lazy(() => import('./components/TripPublishSettingsScreen'));
const MemoryFormScreen = lazy(() => import('./components/MemoryFormScreen'));
const MemoryViewScreen = lazy(() => import('./components/MemoryViewScreen'));
const PublicTripsSearchScreen = lazy(() => import('./components/PublicTripsSearchScreen'));
const PlaceSearchScreen = lazy(() => import('./components/PlaceSearchScreen'));
const PlaceDetailScreen = lazy(() => import('./components/PlaceDetailScreen'));
const RouteOptionsScreen = lazy(() => import('./components/RouteOptionsScreen'));
const HotelRecommendationsScreen = lazy(() => import('./components/HotelRecommendationsScreen'));
const EventFormScreen = lazy(() => import('./components/EventFormScreen'));


function AppRouter({ appLogic }) {
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
    handleShowEventForm, handleSaveEvent, handleSetHotelForDay, 
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
    editingEventDetails,
    currentHotelForRecommendations, aiRecommendedCourses,
    placeSearchContext,
    favoritePickerContext, setFavoritePickerContext,
    editingPublishSettingsForTripId,
    editingHotelDetails,
    handleConfirmPasswordChange,
    handleDeleteEvent
  } = appLogic;

  if (!currentUser && !['login', 'signup', 'passwordReset'].includes(currentScreen)) {
    return <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  }

  switch (currentScreen) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
    case 'signup':
      return <SignupScreen onSignup={handleSignup} onNavigateToLogin={() => setCurrentScreen('login')} />;
    case 'passwordReset':
      return <PasswordResetScreen onSendResetLink={handleSendPasswordResetLink} onNavigateToLogin={() => setCurrentScreen('login')} onConfirmCodeAndSetNewPassword={handleConfirmCodeAndSetNewPassword} />;
    case 'planForm':
      return <PlanFormScreen currentPlan={editingPlan} onSave={handleSavePlan} onCancel={handleCancelPlanForm} onShowPlaceSearch={handleShowPlaceSearchForPlanForm} />;
    case 'tripDetail':
      return <TripDetailScreen 
                trip={selectedTrip} 
                onBack={handleBackToList} 
                onEditPlanBasics={handleShowPlanForm} 
                onRequestAI={() => handleRequestAIForTrip(selectedTrip)} 
                onShowRouteOptions={handleShowRouteOptions} 
                onAddMemoryForEvent={(eventName, date) => handleShowMemoryForm(selectedTrip.id, eventName, date)} 
                onShowHotelRecommendations={(hotel) => handleShowHotelRecommendations(hotel)} 
                onAddEventToDay={(date, scheduleId) => handleShowEventForm(selectedTrip.id, date, scheduleId)} 
                onViewOverallMemories={handleShowMemoryView}
                onChangeTripStatus={handleChangeTripStatus} 
                onSetHotelForDay={(date) => handleSetHotelForDay(selectedTrip.id, date)} 
                onTogglePublicStatus={handleToggleTripPublicStatus} 
                onCopyMyOwnTrip={handleCopyMyOwnTrip} 
                onShowPublishSettings={handleShowPublishSettings} 
                onShowHotelDetailModal={handleShowHotelDetailModal}
                onAddSchedule={handleShowScheduleForm}
                onDeleteTrip={handleDeleteTrip}
                onEditEvent={(tripId, scheduleId, event) => handleShowEventForm(tripId, event.date, scheduleId, event)} // event.date を渡す
                onDeleteEvent={handleDeleteEvent}
              />;
    case 'scheduleForm':
      return <ScheduleFormScreen 
                tripId={editingScheduleForTripId} 
                existingSchedule={editingScheduleData} 
                onSave={handleSaveSchedule} 
                onCancel={handleCancelScheduleForm} 
              />;
    case 'myProfile':
      return <MyProfileScreen 
                userProfile={userProfile} 
                onEditProfile={handleShowProfileEdit} 
                onShowAccountSettings={handleShowAccountSettings} 
                onLogout={handleLogout} 
                onShowFavoritePlaces={handleShowFavoritePlaces} 
                onShowBackendTest={handleShowBackendTest} 
              />;
    case 'profileEdit':
      return <ProfileEditScreen userProfile={userProfile} onSaveProfile={handleSaveProfile} onCancel={handleShowMyProfile} />;
    case 'accountSettings':
      return <AccountSettingsScreen userEmail={currentUser?.email} onChangeEmail={handleChangeEmailRequest} onChangePassword={handleChangePasswordRequest} onLogout={handleLogout} onDeleteAccount={handleDeleteAccountRequest} onBack={handleShowMyProfile} />;
    case 'backendTest':
      return <BackendTestScreen onBack={handleShowMyProfile} />;
    case 'accountDeletionConfirm':
      return <AccountDeletionConfirmScreen userEmail={currentUser?.email} onConfirm={handleConfirmAccountDeletion} onCancel={() => setCurrentScreen('accountSettings')} />;
    case 'passwordChange':
      return <PasswordChangeScreen onConfirm={handleConfirmPasswordChange} onCancel={() => setCurrentScreen('accountSettings')} />;
    case 'emailChange':
      return <EmailChangeScreen currentEmail={currentUser?.email} onSendConfirm={handleSendEmailConfirmation} onCancel={() => setCurrentScreen('accountSettings')} />;
    case 'favoritePlacesList':
      return <FavoritePlacesScreen 
                favoritePlaces={userProfile.favoritePlaces} 
                onSelectPlace={handleShowPlaceDetail} 
                onRemoveFavorite={handleRemoveFavoritePlace} 
                onBack={handleShowMyProfile} 
              />;
    case 'favoritePicker':
      if (!favoritePickerContext) return <LoadingFallback />;
      return <FavoritePlacesScreen 
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
    case 'tripPublishSettings':
      if (!editingPublishSettingsForTripId) return <LoadingFallback />;
      const tripToEditPublishSettings = trips.find(t => t.id === editingPublishSettingsForTripId);
      return <TripPublishSettingsScreen 
                trip={tripToEditPublishSettings} 
                onSave={handleSavePublishSettings} 
                onCancel={handleCancelPublishSettings} 
              />;
    case 'memoryForm':
      return <MemoryFormScreen tripId={editingMemoryForEvent?.tripId} eventName={editingMemoryForEvent?.eventName} existingMemory={editingMemoryForEvent?.existingMemory} onSaveMemory={handleSaveMemory} onCancel={() => setCurrentScreen(editingMemoryForEvent?.tripId ? 'memoryView' : 'tripDetail')} />;
    case 'memoryView':
      if (!viewingMemoriesForTripId) return <LoadingFallback />;
      const memoryTripData = trips.find(t => t.id === viewingMemoriesForTripId);
      return <MemoryViewScreen tripId={viewingMemoriesForTripId} tripData={memoryTripData} onBack={() => setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList')} onEditOverallMemory={(tid) => handleShowMemoryForm(tid, null, null)} onEditEventMemory={(tid, date, eventName) => handleShowMemoryForm(tid, eventName, date)} />;
    case 'publicTripsSearch':
      return <PublicTripsSearchScreen onSelectPublicTrip={handleSelectPublicTrip} onCancel={() => setCurrentScreen('tripList')} />;
    case 'placeSearch':
      return <PlaceSearchScreen onSelectPlace={newHandlePlaceSelected} onCancel={() => { if (placeSearchContext && placeSearchContext.returnScreen) { setCurrentScreen(placeSearchContext.returnScreen); } else if (editingPlan) { setCurrentScreen('planForm'); } else { setCurrentScreen('tripList'); } }} context={placeSearchContext} />;
    case 'placeDetail':
      const dummyPlace = selectedPlaceDetail || { id: 'temp-dummy', name: 'ダミー場所', address: '住所未定', category: '不明', rating: 0 };
      const isFavorite = userProfile.favoritePlaces.some(fp => (fp.id || fp.name) === (dummyPlace.id || dummyPlace.name));
      return <PlaceDetailScreen 
                place={dummyPlace} 
                onBack={handleBackFromPlaceDetail} 
                onAddToList={(p) => console.log('リスト追加:', p.name)} 
                onAddToTrip={(p) => console.log('旅程追加:', p.name)}
                isFavorite={isFavorite}
                onAddFavorite={handleAddFavoritePlace}
                onRemoveFavorite={handleRemoveFavoritePlace} 
              />;
    case 'routeOptions':
      if (!currentRouteQuery) return <LoadingFallback />;
      return <RouteOptionsScreen origin={currentRouteQuery?.origin} destination={currentRouteQuery?.destination} onSelectRoute={handleRouteSelected} onCancel={() => setCurrentScreen('tripDetail')} />;
    case 'hotelRecommendations':
      if (!currentHotelForRecommendations) return <LoadingFallback />;
      return <HotelRecommendationsScreen hotel={currentHotelForRecommendations} onBack={() => { setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList');}} onSelectPlace={handleShowPlaceDetail} onAICourseRequest={handleRequestAICourse} aiRecommendedCourses={aiRecommendedCourses} />;
    case 'eventForm':
      if (!editingEventDetails) return <LoadingFallback />;
      return <EventFormScreen 
                tripId={editingEventDetails.tripId}
                scheduleId={editingEventDetails.scheduleId}
                date={editingEventDetails.date} 
                existingEvent={editingEventDetails.event} // existingEvent を editingEventDetails.event に変更
                onSaveEvent={handleSaveEvent} // handleSaveEvent を直接渡す (引数はEventFormScreen側で調整済み)
                onCancel={() => setCurrentScreen('tripDetail')} 
                onShowPlaceSearch={handleShowPlaceSearchForEvent} 
                onShowFavoritePicker={handleShowFavoritePickerForEvent} 
             />;
    default:
      return <TripListScreen trips={trips} onAddNewPlan={() => handleShowPlanForm()} onEditPlan={handleShowPlanForm} onSelectTrip={handleShowTripDetail} onViewMemories={(tripId) => handleShowMemoryView(tripId)} onShowPublicTripsSearch={handleShowPublicTripsSearch} onShowProfileEdit={handleShowMyProfile} />;
  }
}

export default AppRouter;
