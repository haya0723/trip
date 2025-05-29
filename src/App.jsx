import React, { useState } from 'react';
import './App.css';
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
import BottomNavBar from './components/BottomNavBar'; // BottomNavBar をインポート

// ダミーデータ (Appコンポーネントの初期stateとして使用)
const initialDummyTrips = [
  {
    id: 1,
    name: '夏の北海道旅行2024',
    period: '2024/08/10 - 2024/08/15 (5泊6日)',
    destinations: '札幌、小樽、富良野',
    status: '計画中',
    coverImage: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1000&auto=format&fit=crop',
    hotels: [{ name: '札幌グランドホテル', address: '札幌市中央区北1条西4丁目' }] 
  },
  {
    id: 2,
    name: '京都紅葉狩り',
    period: '2023/11/20 - 2023/11/23 (3泊4日)',
    destinations: '京都',
    status: '完了',
    coverImage: 'https://images.unsplash.com/photo-1534564737930-39a482142209?q=80&w=1000&auto=format&fit=crop',
    hotels: [{ name: '京都ホテルオークラ', address: '京都市中京区河原町御池' }]
  },
  {
    id: 3,
    name: '沖縄リゾート満喫',
    period: '2024/07/01 - 2024/07/05 (4泊5日)',
    destinations: '那覇、恩納村',
    status: '予約済み',
    coverImage: null,
    hotels: [{ name: 'ハイアット リージェンシー 那覇 沖縄', address: '那覇市牧志3-6-20' }]
  },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState('tripList');
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);
  const [currentRouteQuery, setCurrentRouteQuery] = useState(null); 
  const [editingMemoryForEvent, setEditingMemoryForEvent] = useState(null); 
  const [viewingMemoriesForTripId, setViewingMemoriesForTripId] = useState(null);
  const [selectedPublicTripDetail, setSelectedPublicTripDetail] = useState(null);
  const [currentHotelForRecommendations, setCurrentHotelForRecommendations] = useState(null);
  const [userProfile, setUserProfile] = useState({ 
    nickname: '旅好きユーザー',
    bio: '週末はいつもどこかへ旅しています！おすすめの場所があれば教えてください。',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', 
  });
  const [currentUser, setCurrentUser] = useState(null); // ログインユーザー情報
  const [trips, setTrips] = useState(initialDummyTrips);

  // 初期表示をログイン画面にする (currentUser がいなければ)
  useState(() => {
    if (!currentUser) {
      setCurrentScreen('login');
    }
  }, [currentUser]);


  const handleShowPlanForm = (planToEdit = null) => {
    setEditingPlan(planToEdit);
    setSelectedTrip(null);
    setCurrentScreen('planForm');
  };

  const handleShowTripDetail = (trip) => {
    setSelectedTrip(trip);
    setCurrentScreen('tripDetail');
  };

  const handleSavePlan = (planData) => {
    if (editingPlan) {
      setTrips(prevTrips => prevTrips.map(t => t.id === editingPlan.id ? { ...t, ...planData } : t));
    } else {
      setTrips(prevTrips => [...prevTrips, { ...planData, id: Date.now(), status: '計画中' }]);
    }
    setCurrentScreen('tripList');
    setEditingPlan(null);
  };

  const handleCancelPlanForm = () => {
    setCurrentScreen('tripList');
    setEditingPlan(null);
  };
  
  const handleBackToList = () => {
    setCurrentScreen('tripList');
    setSelectedTrip(null);
    setEditingPlan(null);
    setCurrentHotelForRecommendations(null); 
  };
  
  const handleRequestAIForTrip = (trip) => {
    console.log('AIに旅程提案を依頼 (対象:', trip.name, ')');
  };

  const handleShowPlaceSearch = () => {
    setCurrentScreen('placeSearch');
  };

  const handlePlaceSelected = (place) => {
    console.log('場所検索から選択された場所:', place);
    setSelectedPlaceDetail(place); 
    setCurrentScreen('placeDetail');
  };
  
  const handleShowPlaceDetail = (place) => { 
    setSelectedPlaceDetail(place);
    setCurrentScreen('placeDetail');
  };

  const handleBackFromPlaceDetail = () => {
    if (currentScreen === 'placeDetail' && currentHotelForRecommendations) { 
      setCurrentScreen('hotelRecommendations');
    } else if (currentScreen === 'placeDetail' && selectedTrip) { 
        setCurrentScreen('tripDetail');
    } else if (currentScreen === 'placeDetail') { 
        setCurrentScreen('placeSearch');
    }
    setSelectedPlaceDetail(null);
  };

  const handleShowRouteOptions = (origin, destination) => {
    setCurrentRouteQuery({ origin, destination });
    setCurrentScreen('routeOptions');
  };

  const handleRouteSelected = (route) => {
    console.log('選択された移動手段:', route);
    setCurrentScreen('tripDetail'); 
    setCurrentRouteQuery(null);
  };

  const handleShowMemoryForm = (eventName, existingMemory = null) => {
    setEditingMemoryForEvent({ eventName, existingMemory });
    setCurrentScreen('memoryForm');
  };

  const handleSaveMemory = (memoryData) => {
    console.log('保存する思い出データ:', memoryData);
    setCurrentScreen('tripDetail'); 
    setEditingMemoryForEvent(null);
  };

  const handleShowMemoryView = (tripId) => {
    setViewingMemoriesForTripId(tripId);
    setCurrentScreen('memoryView');
  };

  const handleShowPublicTripsSearch = () => {
    setCurrentScreen('publicTripsSearch');
  };

  const handleSelectPublicTrip = (publicTrip) => {
    console.log('選択された公開旅程:', publicTrip);
    setSelectedPublicTripDetail(publicTrip); 
    setCurrentScreen('publicTripDetail');
  };

  const handleCopyToMyPlans = (publicTripData) => {
    console.log('自分の計画にコピー:', publicTripData);
    const newPlan = {
      id: Date.now(),
      name: `コピー：${publicTripData.title}`,
      period: publicTripData.duration, 
      destinations: publicTripData.destinations,
      status: '計画中',
    };
    setTrips(prevTrips => [...prevTrips, newPlan]);
    setCurrentScreen('tripList');
  };

  const handleShowHotelRecommendations = (hotel) => {
    setCurrentHotelForRecommendations(hotel);
    setCurrentScreen('hotelRecommendations');
  };

  const handleShowProfileEdit = () => {
    setCurrentScreen('profileEdit');
  };

  const handleSaveProfile = (updatedProfile) => {
    console.log('保存するプロフィール:', updatedProfile);
    setUserProfile(prevProfile => ({ ...prevProfile, ...updatedProfile }));
    setCurrentScreen('accountSettings'); 
  };

  const handleShowAccountSettings = () => {
    setCurrentScreen('accountSettings');
  };

  const handleLogin = (userData) => {
    console.log('ログイン成功:', userData);
    setCurrentUser(userData);
    setUserProfile(prev => ({...prev, ...userData, email: userData.email})); 
    setCurrentScreen('tripList'); 
  };

  const handleSignup = (signupData) => {
    console.log('新規登録成功:', signupData);
    // ダミーでログイン処理も実行
    setCurrentUser({ name: signupData.nickname, email: signupData.email });
    setUserProfile(prev => ({...prev, ...signupData}));
    setCurrentScreen('tripList'); // 新規登録後は旅行一覧へ
  };

  const handleLogout = () => {
    console.log('ログアウト');
    setCurrentUser(null);
    setCurrentScreen('login'); // ログアウト後はログイン画面へ
  };


  if (!currentUser && currentScreen !== 'signup' && currentScreen !== 'passwordReset') { 
    if (currentScreen === 'login') { 
      return <LoginScreen 
               onLogin={handleLogin} 
               onNavigateToSignup={() => setCurrentScreen('signup')} 
               onForgotPassword={() => setCurrentScreen('passwordReset')} 
             />;
    }
    // signup, passwordReset 以外の未ログイン状態は login へ (useEffectで初期表示は制御されるが、念のため)
    // setCurrentScreen('login'); // ここで直接setCurrentScreenを呼ぶと無限ループの可能性
    // このブロックは、初期表示以外の予期せぬ画面遷移を防ぐガードとして機能させる
    // 実際にはuseEffectで初期表示がloginに設定される
    return <LoginScreen 
             onLogin={handleLogin} 
             onNavigateToSignup={() => setCurrentScreen('signup')} 
             onForgotPassword={() => setCurrentScreen('passwordReset')} 
           />;
  }


  if (currentScreen === 'planForm') {
    return <PlanFormScreen currentPlan={editingPlan} onSave={handleSavePlan} onCancel={handleCancelPlanForm} onShowPlaceSearch={handleShowPlaceSearch} />;
  }
  if (currentScreen === 'tripDetail') {
    return <TripDetailScreen trip={selectedTrip} onBack={handleBackToList} onEditPlanBasics={handleShowPlanForm} 
             onRequestAI={() => handleRequestAIForTrip(selectedTrip)}
             onShowRouteOptions={handleShowRouteOptions}
             onAddMemoryForEvent={(eventName) => handleShowMemoryForm(eventName)} 
             onShowHotelRecommendations={(hotel) => handleShowHotelRecommendations(hotel)} />;
  }
  if (currentScreen === 'placeSearch') {
    return <PlaceSearchScreen onSelectPlace={handlePlaceSelected} onCancel={() => setCurrentScreen(editingPlan ? 'planForm' : 'tripList')} />;
  }
  if (currentScreen === 'placeDetail') {
    const dummyPlaceForDetail = selectedPlaceDetail || { 
      name: 'ダミーの場所詳細', address: '東京都サンプル区1-2-3', category: '観光', rating: 4.5, 
      photos: ['https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1000&auto=format&fit=crop'],
      openingHours: "月-金: 9:00-18:00\n土: 10:00-17:00\n日: 定休日",
      reviews: [{author_name: "テストユーザー", rating: 5, text: "素晴らしい場所でした！"}]
    };
    return <PlaceDetailScreen place={dummyPlaceForDetail} onBack={handleBackFromPlaceDetail}
             onAddToList={(place) => console.log('リストに追加:', place.name)}
             onAddToTrip={(place) => console.log('旅程に追加:', place.name)} />;
  }
  if (currentScreen === 'routeOptions') {
    return <RouteOptionsScreen origin={currentRouteQuery?.origin} destination={currentRouteQuery?.destination}
            onSelectRoute={handleRouteSelected} onCancel={() => setCurrentScreen('tripDetail')} />;
  }
  if (currentScreen === 'memoryForm') {
    return <MemoryFormScreen eventName={editingMemoryForEvent?.eventName} existingMemory={editingMemoryForEvent?.existingMemory}
            onSaveMemory={handleSaveMemory} onCancel={() => setCurrentScreen('tripDetail')} />;
  }
  if (currentScreen === 'memoryView') {
    return <MemoryViewScreen tripId={viewingMemoriesForTripId}
            onBack={() => setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList')}
            onEditMemory={(tripId, eventName) => {
              const targetTrip = trips.find(t => t.id === tripId);
              handleShowMemoryForm(eventName || `${targetTrip?.name} 全体の思い出`, null);
            }} />;
  }
  if (currentScreen === 'publicTripsSearch') {
    return <PublicTripsSearchScreen onSelectPublicTrip={handleSelectPublicTrip} onCancel={() => setCurrentScreen('tripList')} />;
  }
  if (currentScreen === 'publicTripDetail') {
    return <PublicTripDetailScreen publicTripId={selectedPublicTripDetail?.id} 
            onBack={() => setCurrentScreen('publicTripsSearch')} onCopyToMyPlans={handleCopyToMyPlans} />;
  }
  if (currentScreen === 'hotelRecommendations') {
    return <HotelRecommendationsScreen hotel={currentHotelForRecommendations} 
            onBack={() => setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList')} 
            onSelectPlace={handleShowPlaceDetail} />;
  }
  if (currentScreen === 'profileEdit') {
    return <ProfileEditScreen userProfile={userProfile} onSaveProfile={handleSaveProfile} 
            onCancel={() => setCurrentScreen('accountSettings')} />; // アカウント設定画面に戻る
  }
  if (currentScreen === 'accountSettings') {
    return <AccountSettingsScreen 
            userEmail={userProfile?.email || 'test@example.com'} // ダミーメールアドレス
            onEditProfile={handleShowProfileEdit}
            onChangeEmail={() => console.log('メールアドレス変更画面へ (未実装)')}
            onChangePassword={() => console.log('パスワード変更画面へ (未実装)')}
            onLogout={handleLogout} // ログアウト処理を接続
            onDeleteAccount={() => console.log('アカウント削除処理 (未実装)')}
            onBack={() => setCurrentScreen('tripList')} 
           />;
  }
  if (currentScreen === 'signup') {
    return <SignupScreen 
            onSignup={handleSignup} 
            onNavigateToLogin={() => setCurrentScreen('login')} 
           />;
  }
  if (currentScreen === 'passwordReset') {
    return <PasswordResetScreen
            onSendResetLink={(email) => console.log('リセットリンク送信指示:', email)} // ダミー
            onNavigateToLogin={() => setCurrentScreen('login')}
           />;
  }
  // TODO: 下部ナビゲーションを実装し、そこから publicTripsSearch や accountSettings に遷移できるようにする
  // ログイン状態によって表示する初期画面を制御 (useEffectで対応済みだが、ここでもガード)
  if (!currentUser && currentScreen !== 'login' && currentScreen !== 'signup' && currentScreen !== 'passwordReset') {
     return <LoginScreen 
              onLogin={handleLogin} 
              onNavigateToSignup={() => setCurrentScreen('signup')} 
              onForgotPassword={() => setCurrentScreen('passwordReset')} 
            />;
  }

  const screensWithoutNavBar = ['login', 'signup', 'passwordReset', 'planForm', 'memoryForm', 'profileEdit']; // NavBarを表示しない画面
  const showNavBar = currentUser && !screensWithoutNavBar.includes(currentScreen);

  let screenComponent;
  if (currentScreen === 'tripList') {
    screenComponent = <TripListScreen trips={trips} onAddNewPlan={() => handleShowPlanForm()} onEditPlan={handleShowPlanForm}
                        onSelectTrip={handleShowTripDetail} onViewMemories={(tripId) => handleShowMemoryView(tripId)} 
                        onShowPublicTripsSearch={handleShowPublicTripsSearch} 
                        onShowProfileEdit={handleShowAccountSettings} />;
  } else if (currentScreen === 'planForm') {
    screenComponent = <PlanFormScreen currentPlan={editingPlan} onSave={handleSavePlan} onCancel={handleCancelPlanForm} onShowPlaceSearch={handleShowPlaceSearch} />;
  } else if (currentScreen === 'tripDetail') {
    screenComponent = <TripDetailScreen trip={selectedTrip} onBack={handleBackToList} onEditPlanBasics={handleShowPlanForm} 
                        onRequestAI={() => handleRequestAIForTrip(selectedTrip)}
                        onShowRouteOptions={handleShowRouteOptions}
                        onAddMemoryForEvent={(eventName) => handleShowMemoryForm(eventName)} 
                        onShowHotelRecommendations={(hotel) => handleShowHotelRecommendations(hotel)} />;
  } else if (currentScreen === 'placeSearch') {
    screenComponent = <PlaceSearchScreen onSelectPlace={handlePlaceSelected} onCancel={() => setCurrentScreen(editingPlan ? 'planForm' : 'tripList')} />;
  } else if (currentScreen === 'placeDetail') {
    const dummyPlaceForDetail = selectedPlaceDetail || { 
      name: 'ダミーの場所詳細', address: '東京都サンプル区1-2-3', category: '観光', rating: 4.5, 
      photos: ['https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1000&auto=format&fit=crop'],
      openingHours: "月-金: 9:00-18:00\n土: 10:00-17:00\n日: 定休日",
      reviews: [{author_name: "テストユーザー", rating: 5, text: "素晴らしい場所でした！"}]
    };
    screenComponent = <PlaceDetailScreen place={dummyPlaceForDetail} onBack={handleBackFromPlaceDetail}
                        onAddToList={(place) => console.log('リストに追加:', place.name)}
                        onAddToTrip={(place) => console.log('旅程に追加:', place.name)} />;
  } else if (currentScreen === 'routeOptions') {
    screenComponent = <RouteOptionsScreen origin={currentRouteQuery?.origin} destination={currentRouteQuery?.destination}
                        onSelectRoute={handleRouteSelected} onCancel={() => setCurrentScreen('tripDetail')} />;
  } else if (currentScreen === 'memoryForm') {
    screenComponent = <MemoryFormScreen eventName={editingMemoryForEvent?.eventName} existingMemory={editingMemoryForEvent?.existingMemory}
                        onSaveMemory={handleSaveMemory} onCancel={() => setCurrentScreen('tripDetail')} />;
  } else if (currentScreen === 'memoryView') {
    screenComponent = <MemoryViewScreen tripId={viewingMemoriesForTripId}
                        onBack={() => setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList')}
                        onEditMemory={(tripId, eventName) => {
                          const targetTrip = trips.find(t => t.id === tripId);
                          handleShowMemoryForm(eventName || `${targetTrip?.name} 全体の思い出`, null);
                        }} />;
  } else if (currentScreen === 'publicTripsSearch') {
    screenComponent = <PublicTripsSearchScreen onSelectPublicTrip={handleSelectPublicTrip} onCancel={() => setCurrentScreen('tripList')} />;
  } else if (currentScreen === 'publicTripDetail') {
    screenComponent = <PublicTripDetailScreen publicTripId={selectedPublicTripDetail?.id} 
                        onBack={() => setCurrentScreen('publicTripsSearch')} onCopyToMyPlans={handleCopyToMyPlans} />;
  } else if (currentScreen === 'hotelRecommendations') {
    screenComponent = <HotelRecommendationsScreen hotel={currentHotelForRecommendations} 
                        onBack={() => setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList')} 
                        onSelectPlace={handleShowPlaceDetail} />;
  } else if (currentScreen === 'profileEdit') {
    screenComponent = <ProfileEditScreen userProfile={userProfile} onSaveProfile={handleSaveProfile} 
                        onCancel={() => setCurrentScreen('accountSettings')} />;
  } else if (currentScreen === 'accountSettings') {
    screenComponent = <AccountSettingsScreen 
                        userEmail={userProfile?.email || 'test@example.com'} 
                        onEditProfile={handleShowProfileEdit}
                        onChangeEmail={() => console.log('メールアドレス変更画面へ (未実装)')}
                        onChangePassword={() => console.log('パスワード変更画面へ (未実装)')}
                        onLogout={handleLogout} 
                        onDeleteAccount={() => console.log('アカウント削除処理 (未実装)')}
                        onBack={() => setCurrentScreen('tripList')} />;
  } else if (currentScreen === 'signup') {
    screenComponent = <SignupScreen onSignup={handleSignup} onNavigateToLogin={() => setCurrentScreen('login')} />;
  } else if (currentScreen === 'passwordReset') {
    screenComponent = <PasswordResetScreen onSendResetLink={(email) => console.log('リセットリンク送信指示:', email)} 
                        onNavigateToLogin={() => setCurrentScreen('login')} />;
  } else if (!currentUser) { // 上記以外の画面で未ログインならログイン画面
    screenComponent = <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} 
                        onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  } else { // デフォルト (ログイン済み)
    screenComponent = <TripListScreen trips={trips} onAddNewPlan={() => handleShowPlanForm()} onEditPlan={handleShowPlanForm}
                        onSelectTrip={handleShowTripDetail} onViewMemories={(tripId) => handleShowMemoryView(tripId)} 
                        onShowPublicTripsSearch={handleShowPublicTripsSearch} 
                        onShowProfileEdit={handleShowAccountSettings} />;
  }

  return (
    <>
      {screenComponent}
      {showNavBar && <BottomNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
    </>
  );
}

export default App;
