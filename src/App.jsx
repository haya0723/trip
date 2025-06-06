import React, { Suspense } from 'react'; // Suspense をインポート
import './App.css';
import { useAppLogic } from './hooks/useAppLogic'; 
import AppRouter from './AppRouter'; // AppRouter をインポート
import { BottomNavBar, HotelDetailModal } from './components'; // BottomNavBar と HotelDetailModal をインポート

const LoadingFallback = () => <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>読み込み中...</div>;

function App() {
  const appLogic = useAppLogic(); 
  const {
    currentScreen,
    currentUser,
    editingHotelDetails,
    handleSaveHotelDetails,
    handleCancelHotelDetailModal,
    setCurrentScreen // BottomNavBar に渡すため
  } = appLogic;
  
  const screensWithoutNavBar = ['login', 'signup', 'passwordReset', 'planForm', 'scheduleForm', 'memoryForm', 'profileEdit', 'placeSearch', 'routeOptions', 'eventForm', 'accountDeletionConfirm', 'passwordChange', 'emailChange', 'accountSettings', 'favoritePlacesList', 'favoritePicker', 'tripPublishSettings', 'backendTest'];
  const showNavBar = currentUser && !screensWithoutNavBar.includes(currentScreen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flexGrow: 1, paddingBottom: showNavBar ? '70px' : '0' }}>
        <Suspense fallback={<LoadingFallback />}>
          <AppRouter appLogic={appLogic} />
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
