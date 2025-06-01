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
import BottomNavBar from './components/BottomNavBar';
import EventFormScreen from './components/EventFormScreen.jsx'; // 正しい大文字・小文字に戻す
import AccountDeletionConfirmScreen from './components/AccountDeletionConfirmScreen';
import PasswordChangeScreen from './components/PasswordChangeScreen';
import EmailChangeScreen from './components/EmailChangeScreen';
import MyProfileScreen from './components/MyProfileScreen';

const dummyDailySchedulesForTrip1 = [
  { date: '2024-08-10', dayDescription: '移動と札幌市内観光', hotel: { name: '札幌グランドホテル', address: '札幌市中央区北1条西4丁目', checkIn: '15:00', checkOut: '11:00', notes: '予約番号: XYZ123' }, events: [ { id: 'evt1-1', time: '14:00', type: 'travel', name: '新千歳空港から札幌市内へ移動', description: 'JR快速エアポート', estimatedDurationMinutes: 40, category: '移動', memory: null }, { id: 'evt1-2', time: '15:00', type: 'hotel_checkin', name: '札幌グランドホテル', description: 'チェックイン', estimatedDurationMinutes: 60, category: '宿泊', details: { address: '札幌市中央区北1条西4丁目', isHotel: true }, memory: null }, { id: 'evt1-3', time: '16:30', type: 'activity', name: '大通公園散策', description: 'テレビ塔や花時計を見る', estimatedDurationMinutes: 90, category: '観光', details: { address: '札幌市中央区大通西1～12丁目' }, memory: { notes: "楽しかった！", rating: 4, photos: ["https://via.placeholder.com/150/FF0000/FFFFFF?Text=DummyMem1"], videos: ["dummy_video.mp4"] } } , { id: 'evt1-4', time: '18:30', type: 'meal', name: '夕食：ジンギスカン', description: 'だるま 本店', estimatedDurationMinutes: 90, category: '食事', details: { address: '札幌市中央区南5条西4' }, memory: null }, ] },
  { date: '2024-08-11', dayDescription: '小樽観光', hotel: { name: '札幌グランドホテル', address: '札幌市中央区北1条西4丁目', checkIn: '15:00', checkOut: '11:00', notes: '連泊' }, events: [ { id: 'evt1-5', time: '09:00', type: 'travel', name: '札幌から小樽へ移動', description: 'JR函館本線', estimatedDurationMinutes: 50, category: '移動', memory: null }, { id: 'evt1-6', time: '10:00', type: 'activity', name: '小樽運河クルーズ', description: '歴史的な運河を巡る', estimatedDurationMinutes: 40, category: '観光', details: { address: '小樽市港町５' }, memory: null }, ] },
  { date: '2024-08-12', dayDescription: '富良野日帰り', hotel: null, events: []} 
];
const initialDummyTrips = [
  { id: 1, name: '夏の北海道旅行2024', period: '2024/08/10 - 2024/08/15 (5泊6日)', destinations: '札幌、小樽、富良野', status: '計画中', coverImage: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1000&auto=format&fit=crop', schedules: dummyDailySchedulesForTrip1, overallMemory: { notes: "全体的に素晴らしい旅行だった。", rating: 5, photos: [], videos: [] }, isPublic: false },
  { id: 2, name: '京都紅葉狩り', period: '2023/11/20 - 2023/11/23 (3泊4日)', destinations: '京都', status: '完了', coverImage: 'https://images.unsplash.com/photo-1534564737930-39a482142209?q=80&w=1000&auto=format&fit=crop', schedules: [], overallMemory: null, isPublic: true, publicDescription: "紅葉シーズンの京都は最高でした！特に清水寺のライトアップは必見です。", publicTags: ["紅葉", "京都", "寺社仏閣"] },
  { id: 3, name: '沖縄リゾート満喫', period: '2024/07/01 - 2024/07/05 (4泊5日)', destinations: '那覇、恩納村', status: '予約済み', coverImage: null, schedules: [], overallMemory: null, isPublic: false },
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
  const [userProfile, setUserProfile] = useState({ nickname: '旅好きユーザー', bio: '週末はいつもどこかへ旅しています！おすすめの場所があれば教えてください。', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' });
  const [currentUser, setCurrentUser] = useState(null);
  const [trips, setTrips] = useState(initialDummyTrips);
  const [editingEventDetails, setEditingEventDetails] = useState(null);
  const [placeSearchContext, setPlaceSearchContext] = useState(null);
  const [aiRecommendedCourses, setAiRecommendedCourses] = useState([]);

  React.useEffect(() => {
    const authScreens = ['login', 'signup', 'passwordReset', 'accountDeletionConfirm'];
    if (!currentUser && !authScreens.includes(currentScreen)) { setCurrentScreen('login'); } 
    else if (currentUser && authScreens.includes(currentScreen) && currentScreen !== 'accountDeletionConfirm') { setCurrentScreen('tripList'); }
  }, [currentUser, currentScreen]);

  const handleShowPlanForm = (planToEdit = null) => { setCurrentScreen('planForm'); setEditingPlan(planToEdit); setSelectedTrip(null); };
  const handleShowTripDetail = (trip) => { setSelectedTrip(trip); setCurrentScreen('tripDetail'); };
  const handleSavePlan = (planData) => {
    let updatedTrip;
    if (editingPlan) { 
      setTrips(prevTrips => prevTrips.map(t => {
        if (t.id === editingPlan.id) { updatedTrip = { ...t, ...planData }; return updatedTrip; } return t;
      })); 
      if (selectedTrip && selectedTrip.id === editingPlan.id) { setSelectedTrip(updatedTrip); }
    } else { 
      updatedTrip = { ...planData, id: Date.now(), schedules: [], overallMemory: null }; 
      setTrips(prevTrips => [...prevTrips, updatedTrip]); 
    }
    setCurrentScreen('tripList'); setEditingPlan(null);
  };
  const handleCancelPlanForm = () => { setCurrentScreen('tripList'); setEditingPlan(null); };
  const handleBackToList = () => { setCurrentScreen('tripList'); setSelectedTrip(null); setEditingPlan(null); setCurrentHotelForRecommendations(null); setAiRecommendedCourses([]); }; // AI提案もクリア
  const handleRequestAIForTrip = (trip) => console.log('AIに旅程提案を依頼 (対象:', trip.name, ')');
  const handleShowPlaceSearchGeneral = () => { setPlaceSearchContext({ returnScreen: currentScreen, from: 'general' }); setCurrentScreen('placeSearch'); };
  const handleShowPlaceSearchForPlanForm = (callback) => { setPlaceSearchContext({ returnScreen: 'planForm', callback, from: 'planFormDestination' }); setCurrentScreen('placeSearch'); };
  const handleShowPlaceSearchForEvent = (callbackForPlace) => { setPlaceSearchContext({ returnScreen: 'eventForm', callback: callbackForPlace, from: 'eventForm' }); setCurrentScreen('placeSearch'); };
  const handleSetHotelForDay = (tripId, date) => { setPlaceSearchContext({ returnScreen: 'tripDetail', tripId, date, callback: handleHotelSelectedForDay, from: 'setHotelForDay' }); setCurrentScreen('placeSearch'); };
  const handleHotelSelectedForDay = (tripId, date, hotelInfo) => {
    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id === tripId) {
        const newSchedules = (trip.schedules || []).map(schedule => {
          if (schedule.date === date) { return { ...schedule, hotel: { name: hotelInfo.name, address: hotelInfo.address, notes: '', checkIn: '', checkOut: '' } }; }
          return schedule;
        });
        const updatedTrip = { ...trip, schedules: newSchedules };
        if (selectedTrip && selectedTrip.id === tripId) { setSelectedTrip(updatedTrip); }
        return updatedTrip;
      }
      return trip;
    }));
    setCurrentScreen('tripDetail');
  };
  const newHandlePlaceSelected = (place) => {
    if (placeSearchContext) {
      if (placeSearchContext.from === 'eventForm' && placeSearchContext.callback) { placeSearchContext.callback(place); setCurrentScreen('eventForm'); } 
      else if (placeSearchContext.from === 'planFormDestination' && placeSearchContext.callback) { placeSearchContext.callback(place.name); setCurrentScreen('planForm'); } 
      else if (placeSearchContext.from === 'setHotelForDay' && placeSearchContext.callback) { placeSearchContext.callback(placeSearchContext.tripId, placeSearchContext.date, place); } 
      else { setSelectedPlaceDetail(place); setCurrentScreen('placeDetail'); }
      setPlaceSearchContext(null);
    } else { setSelectedPlaceDetail(place); setCurrentScreen('placeDetail'); }
  };
  const handleShowPlaceDetail = (place) => { setSelectedPlaceDetail(place); setCurrentScreen('placeDetail'); };
  const handleBackFromPlaceDetail = () => {
    if (placeSearchContext && placeSearchContext.returnScreen) { setCurrentScreen(placeSearchContext.returnScreen); } 
    else if (currentHotelForRecommendations) { setCurrentScreen('hotelRecommendations'); } 
    else if (selectedTrip) { setCurrentScreen('tripDetail'); } 
    else { setCurrentScreen('placeSearch'); }
    setSelectedPlaceDetail(null); 
  };
  const handleShowRouteOptions = (origin, destination) => { setCurrentRouteQuery({ origin, destination }); setCurrentScreen('routeOptions'); };
  const handleRouteSelected = (route) => { console.log('選択された移動手段:', route); setCurrentScreen('tripDetail'); setCurrentRouteQuery(null); };
  const handleShowMemoryForm = (tripId, eventName, dateForEvent) => { 
    const targetTrip = trips.find(t => t.id === tripId);
    let existingMemory = null;
    if (targetTrip) {
      if (eventName && dateForEvent) { 
        const schedule = targetTrip.schedules?.find(s => s.date === dateForEvent);
        const event = schedule?.events?.find(e => e.name === eventName);
        existingMemory = event?.memory || { photos: [], videos: [], notes: '', rating: 0 }; 
      } else { 
        existingMemory = targetTrip.overallMemory || { photos: [], videos: [], notes: '', rating: 0 }; 
      }
    }
    setEditingMemoryForEvent({ tripId, eventName, dateForEvent, existingMemory });
    setCurrentScreen('memoryForm');
  };
  const handleSaveMemory = (memoryData) => {
    const { tripId, eventName, dateForEvent, notes, rating, photos, videos } = memoryData;
    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id === tripId) {
        let updatedTrip = { ...trip };
        if (eventName) { 
          updatedTrip.schedules = (updatedTrip.schedules || []).map(schedule => {
            if (schedule.date === dateForEvent) {
              return { ...schedule, events: (schedule.events || []).map(event => {
                  if (event.name === eventName) { return { ...event, memory: { notes, rating, photos, videos } }; }
                  return event;
                })
              };
            }
            return schedule;
          });
        } else { 
          updatedTrip.overallMemory = { notes, rating, photos, videos };
        }
        if (selectedTrip && selectedTrip.id === tripId) { setSelectedTrip(updatedTrip); }
        return updatedTrip;
      }
      return trip;
    }));
    setCurrentScreen('memoryView'); 
    setEditingMemoryForEvent(null);
  };
  const handleShowMemoryView = (tripId) => { setViewingMemoriesForTripId(tripId); setCurrentScreen('memoryView'); };
  const handleShowPublicTripsSearch = () => setCurrentScreen('publicTripsSearch');
  // handleSelectPublicTrip は PublicTripsSearchScreen から渡された publicTrip オブジェクト全体をセットする
  const handleSelectPublicTrip = (publicTrip) => { 
    setSelectedPublicTripDetail(publicTrip); // publicTrip オブジェクト全体をセット
    setCurrentScreen('publicTripDetail'); 
  };
  const handleCopyToMyPlans = (publicTripData) => {
    const newSchedules = (publicTripData.schedules || []).map(day => ({
      ...day,
      events: (day.events || []).map(event => {
        // コピーするイベント情報をフィルタリング
        const { publicPhotos, publicNotes, ...restOfEvent } = event;
        return {
          ...restOfEvent, // time, name, category, description, locationDetails など
          id: `evt-copied-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 新しいユニークID
          memory: null // 思い出は初期化
        };
      })
    }));

    const newPlan = { 
      id: Date.now(), 
      name: `コピー：${publicTripData.title}`, 
      period: publicTripData.duration, 
      destinations: Array.isArray(publicTripData.destinations) ? publicTripData.destinations.join(', ') : publicTripData.destinations, 
      status: '計画中', 
      schedules: newSchedules, 
      overallMemory: null, // 旅行全体の思い出も初期化
      coverImage: publicTripData.coverImage || null, // カバー画像は引き継ぐ
      // 元の旅程の作者やタグ、評価などはコピーしない
    }; 
    setTrips(prevTrips => [...prevTrips, newPlan]); 
    alert(`旅程「${newPlan.name}」をマイプランにコピーしました。計画一覧で確認・編集できます。`);
    setCurrentScreen('tripList'); 
  };
  const handleShowHotelRecommendations = (hotel) => { setCurrentHotelForRecommendations(hotel); setAiRecommendedCourses([]); setCurrentScreen('hotelRecommendations'); }; // AI提案もクリア
  const handleShowProfileEdit = () => setCurrentScreen('profileEdit');
  const handleSaveProfile = (updatedProfile) => { setUserProfile(prevProfile => ({ ...prevProfile, ...updatedProfile })); setCurrentScreen('myProfile'); };
  const handleShowAccountSettings = () => setCurrentScreen('accountSettings');
  const handleLogin = (userData) => { setCurrentUser({name: userData.name, email: userData.email}); setUserProfile(prev => ({...prev, nickname: userData.name, email: userData.email})); setCurrentScreen('tripList'); };
  const handleSignup = (signupData) => { setCurrentUser({ name: signupData.nickname, email: signupData.email }); setUserProfile(prev => ({...prev, nickname: signupData.nickname, email: signupData.email, bio: '' })); setCurrentScreen('tripList'); };
  const handleLogout = () => { setCurrentUser(null); setCurrentScreen('login'); };
  const handleChangeTripStatus = (tripId, newStatus) => { setTrips(prevTrips => prevTrips.map(trip => trip.id === tripId ? { ...trip, status: newStatus } : trip )); if (selectedTrip && selectedTrip.id === tripId) { setSelectedTrip(prevSelectedTrip => ({ ...prevSelectedTrip, status: newStatus })); } };
  const handleToggleTripPublicStatus = (tripId) => {
    setTrips(prevTrips => prevTrips.map(trip => 
      trip.id === tripId ? { ...trip, isPublic: !trip.isPublic } : trip
    ));
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(prevSelectedTrip => ({ ...prevSelectedTrip, isPublic: !prevSelectedTrip.isPublic }));
    }
    // 公開状態が変更されたことをユーザーに通知（任意）
    const updatedTrip = trips.find(t => t.id === tripId);
    if (updatedTrip) {
        alert(`旅程「${updatedTrip.name}」は現在 ${!updatedTrip.isPublic ? "公開" : "非公開"}状態です。`);
    }
  };
  const handleShowEventForm = (tripId, date, existingEvent = null) => { setEditingEventDetails({ tripId, date, existingEvent }); setCurrentScreen('eventForm'); };
  const handleSaveEvent = (date, eventData, existingEventToUpdate) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id === editingEventDetails.tripId) {
          let newSchedules = [...(trip.schedules || [])];
          let scheduleForDate = newSchedules.find(s => s.date === date);
          let scheduleWasFound = !!scheduleForDate;
          if (!scheduleForDate) { scheduleForDate = { date: date, dayDescription: '', events: [] }; } 
          else { scheduleForDate = { ...scheduleForDate, events: [...(scheduleForDate.events || [])] }; }
          if (existingEventToUpdate && existingEventToUpdate.id) { scheduleForDate.events = scheduleForDate.events.map(e => e.id === existingEventToUpdate.id ? { ...e, ...eventData, id: existingEventToUpdate.id } : e ); } 
          else { scheduleForDate.events.push({ ...eventData, id: Date.now() }); }
          scheduleForDate.events.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));
          if (!scheduleWasFound) { newSchedules.push(scheduleForDate); newSchedules.sort((a, b) => new Date(a.date) - new Date(b.date)); } 
          else { newSchedules = newSchedules.map(s => s.date === date ? scheduleForDate : s); }
          const updatedTrip = { ...trip, schedules: newSchedules };
          if (selectedTrip && selectedTrip.id === trip.id) { setSelectedTrip(updatedTrip); }
          return updatedTrip;
        }
        return trip;
      });
    });
    setCurrentScreen('tripDetail'); setEditingEventDetails(null);
  };
  const handleDeleteAccountRequest = () => setCurrentScreen('accountDeletionConfirm');
  const handleConfirmAccountDeletion = (password) => { console.log('アカウント削除実行'); handleLogout(); };
  const handleChangePasswordRequest = () => { setCurrentScreen('passwordChange'); };
  const handleConfirmPasswordChange = (currentPassword, newPassword) => { console.log('パスワード変更実行'); setCurrentScreen('accountSettings'); };
  const handleChangeEmailRequest = () => { setCurrentScreen('emailChange'); };
  const handleSendEmailConfirmation = (currentPassword, newEmail) => { alert(`新しいメールアドレス ${newEmail} に確認メールを送信しました。（ダミー処理）`); setCurrentScreen('accountSettings'); };
  const handleSendPasswordResetLink = (email) => { console.log('パスワードリセットメール送信要求:', email); };
  const handleConfirmCodeAndSetNewPassword = (email, code, newPassword) => { console.log('確認コードと新パスワードでパスワード更新:', { email, code, newPassword }); };
  const handleShowMyProfile = () => { setCurrentScreen('myProfile'); };
  const handleRequestAICourse = (hotel, params) => {
    console.log('AIコース提案リクエスト:', { hotel, params });
    // ダミーのAI提案コースデータ
    const dummyCourses = [
      { id: 'course1', name: `${params.categories.join(', ')}巡り (${params.duration}時間コース)`, duration: `${params.duration}時間`, spots: [ {name: 'ダミースポットA (ホテル近く)', time: '30分'}, {name: 'ダミースポットB', time: '60分'} ], transport: '徒歩とバス', totalTime: `${params.duration}時間`},
      { id: 'course2', name: `のんびり${params.categories[0] || 'お散歩'}コース`, duration: `${params.duration}時間`, spots: [ {name: 'ダミー公園', time: '90分'}, {name: '眺めの良いカフェ', time: '45分'} ], transport: '徒歩', totalTime: `${params.duration}時間`},
    ];
    setAiRecommendedCourses(dummyCourses);
    // setCurrentScreen('hotelRecommendations'); // 既にその画面のはず
  };

  let screenComponent;
  if (!currentUser && !['login', 'signup', 'passwordReset', 'accountDeletionConfirm'].includes(currentScreen)) {
    screenComponent = <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  } else if (currentScreen === 'login') {
    screenComponent = <LoginScreen onLogin={handleLogin} onNavigateToSignup={() => setCurrentScreen('signup')} onForgotPassword={() => setCurrentScreen('passwordReset')} />;
  } else if (currentScreen === 'planForm') {
    screenComponent = <PlanFormScreen currentPlan={editingPlan} onSave={handleSavePlan} onCancel={handleCancelPlanForm} onShowPlaceSearch={handleShowPlaceSearchForPlanForm} />;
  } else if (currentScreen === 'tripDetail') {
    screenComponent = <TripDetailScreen trip={selectedTrip} onBack={handleBackToList} onEditPlanBasics={handleShowPlanForm} onRequestAI={() => handleRequestAIForTrip(selectedTrip)} onShowRouteOptions={handleShowRouteOptions} onAddMemoryForEvent={(eventName, date) => handleShowMemoryForm(selectedTrip.id, eventName, date)} onShowHotelRecommendations={(hotel) => handleShowHotelRecommendations(hotel)} onAddEventToDay={(date) => handleShowEventForm(selectedTrip.id, date)} onViewOverallMemories={handleShowMemoryView} onChangeTripStatus={handleChangeTripStatus} onSetHotelForDay={(date) => handleSetHotelForDay(selectedTrip.id, date)} onTogglePublicStatus={handleToggleTripPublicStatus} />;
  } else if (currentScreen === 'placeSearch') {
    screenComponent = <PlaceSearchScreen onSelectPlace={newHandlePlaceSelected} onCancel={() => { if (placeSearchContext && placeSearchContext.returnScreen) { setCurrentScreen(placeSearchContext.returnScreen); } else if (editingPlan) { setCurrentScreen('planForm'); } else { setCurrentScreen('tripList'); } setPlaceSearchContext(null); }} />;
  } else if (currentScreen === 'placeDetail') {
    const dummyPlace = selectedPlaceDetail || { name: 'ダミー場所', address: '住所未定', category: '不明', rating: 0 };
    screenComponent = <PlaceDetailScreen place={dummyPlace} onBack={handleBackFromPlaceDetail} onAddToList={(p) => console.log('リスト追加:', p.name)} onAddToTrip={(p) => console.log('旅程追加:', p.name)} />;
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
    // selectedPublicTripDetail には旅程オブジェクト全体が入っている想定
    screenComponent = <PublicTripDetailScreen publicTripData={selectedPublicTripDetail} onBack={() => setCurrentScreen('publicTripsSearch')} onCopyToMyPlans={handleCopyToMyPlans} />;
  } else if (currentScreen === 'hotelRecommendations') {
    screenComponent = <HotelRecommendationsScreen hotel={currentHotelForRecommendations} onBack={() => { setAiRecommendedCourses([]); setCurrentScreen(selectedTrip ? 'tripDetail' : 'tripList');}} onSelectPlace={handleShowPlaceDetail} onAICourseRequest={handleRequestAICourse} aiRecommendedCourses={aiRecommendedCourses} />;
  } else if (currentScreen === 'profileEdit') {
    screenComponent = <ProfileEditScreen userProfile={userProfile} onSaveProfile={handleSaveProfile} onCancel={() => setCurrentScreen('myProfile')} />;
  } else if (currentScreen === 'accountSettings') {
    screenComponent = <AccountSettingsScreen userEmail={userProfile?.email || 'test@example.com'} onChangeEmail={handleChangeEmailRequest} onChangePassword={handleChangePasswordRequest} onLogout={handleLogout} onDeleteAccount={handleDeleteAccountRequest} onBack={handleShowMyProfile} />;
  } else if (currentScreen === 'signup') {
    screenComponent = <SignupScreen onSignup={handleSignup} onNavigateToLogin={() => setCurrentScreen('login')} />;
  } else if (currentScreen === 'passwordReset') {
    screenComponent = <PasswordResetScreen onSendResetLink={handleSendPasswordResetLink} onNavigateToLogin={() => setCurrentScreen('login')} onConfirmCodeAndSetNewPassword={handleConfirmCodeAndSetNewPassword} />;
  } else if (currentScreen === 'eventForm' && editingEventDetails) {
    screenComponent = <EventFormScreen date={editingEventDetails.date} existingEvent={editingEventDetails.existingEvent} onSaveEvent={handleSaveEvent} onCancel={() => setCurrentScreen('tripDetail')} onShowPlaceSearch={handleShowPlaceSearchForEvent} />;
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
    screenComponent = <MyProfileScreen userProfile={userProfile} onEditProfile={handleShowProfileEdit} onShowAccountSettings={handleShowAccountSettings} onLogout={handleLogout} />;
  }
  else { 
    screenComponent = <TripListScreen trips={trips} onAddNewPlan={() => handleShowPlanForm()} onEditPlan={handleShowPlanForm} onSelectTrip={handleShowTripDetail} onViewMemories={(tripId) => handleShowMemoryView(tripId)} onShowPublicTripsSearch={handleShowPublicTripsSearch} onShowProfileEdit={handleShowMyProfile} />;
  }
  
  const screensWithoutNavBar = ['login', 'signup', 'passwordReset', 'planForm', 'memoryForm', 'profileEdit', 'placeSearch', 'routeOptions', 'eventForm', 'accountDeletionConfirm', 'passwordChange', 'emailChange', 'accountSettings'];
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
