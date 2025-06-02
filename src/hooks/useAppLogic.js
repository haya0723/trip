import React, { useState, useEffect } from 'react';

const dummyDailySchedulesForTrip1 = [
  { date: '2024-08-10', dayDescription: '移動と札幌市内観光', hotel: { name: '札幌グランドホテル', address: '札幌市中央区北1条西4丁目', checkIn: '15:00', checkOut: '11:00', notes: '予約番号: XYZ123' }, events: [ { id: 'evt1-1', time: '14:00', type: 'travel', name: '新千歳空港から札幌市内へ移動', description: 'JR快速エアポート', estimatedDurationMinutes: 40, category: '移動', memory: null }, { id: 'evt1-2', time: '15:00', type: 'hotel_checkin', name: '札幌グランドホテル', description: 'チェックイン', estimatedDurationMinutes: 60, category: '宿泊', details: { address: '札幌市中央区北1条西4丁目', isHotel: true }, memory: null }, { id: 'evt1-3', time: '16:30', type: 'activity', name: '大通公園散策', description: 'テレビ塔や花時計を見る', estimatedDurationMinutes: 90, category: '観光', details: { address: '札幌市中央区大通西1～12丁目' }, memory: { notes: "楽しかった！", rating: 4, photos: ["https://via.placeholder.com/150/FF0000/FFFFFF?Text=DummyMem1"], videos: ["dummy_video.mp4"] } } , { id: 'evt1-4', time: '18:30', type: 'meal', name: '夕食：ジンギスカン', description: 'だるま 本店', estimatedDurationMinutes: 90, category: '食事', details: { address: '札幌市中央区南5条西4' }, memory: null }, ] },
  { date: '2024-08-11', dayDescription: '小樽観光', hotel: { name: '札幌グランドホテル', address: '札幌市中央区北1条西4丁目', checkIn: '15:00', checkOut: '11:00', notes: '連泊' }, events: [ { id: 'evt1-5', time: '09:00', type: 'travel', name: '札幌から小樽へ移動', description: 'JR函館本線', estimatedDurationMinutes: 50, category: '移動', memory: null }, { id: 'evt1-6', time: '10:00', type: 'activity', name: '小樽運河クルーズ', description: '歴史的な運河を巡る', estimatedDurationMinutes: 40, category: '観光', details: { address: '小樽市港町５' }, memory: null }, ] },
  { date: '2024-08-12', dayDescription: '富良野日帰り', hotel: null, events: []} 
];
const initialDummyTrips = [
  { id: 1, name: '夏の北海道旅行2024', period: '2024/08/10 - 2024/08/15 (5泊6日)', destinations: '札幌、小樽、富良野', status: '計画中', coverImage: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1000&auto=format&fit=crop', schedules: dummyDailySchedulesForTrip1, overallMemory: { notes: "全体的に素晴らしい旅行だった。", rating: 5, photos: [], videos: [] }, isPublic: false },
  { id: 2, name: '京都紅葉狩り', period: '2023/11/20 - 2023/11/23 (3泊4日)', destinations: '京都', status: '完了', coverImage: 'https://images.unsplash.com/photo-1534564737930-39a482142209?q=80&w=1000&auto=format&fit=crop', schedules: [], overallMemory: null, isPublic: true, publicDescription: "紅葉シーズンの京都は最高でした！特に清水寺のライトアップは必見です。", publicTags: ["紅葉", "京都", "寺社仏閣"], overallAuthorComment: "清水寺のライトアップは本当に幻想的でした。人も多かったですが、それだけの価値はあります。食事は先斗町で京料理をいただきましたが、こちらもおすすめです。" },
  { id: 3, name: '沖縄リゾート満喫', period: '2024/07/01 - 2024/07/05 (4泊5日)', destinations: '那覇、恩納村', status: '予約済み', coverImage: null, schedules: [], overallMemory: null, isPublic: false },
];

// PublicTripsSearchScreen.jsx からダミーデータを移動
export const initialDummyPublicTrips = [
  { 
    id: 'pub1', 
    title: '週末行く！東京下町グルメ旅', 
    author: '旅好き太郎', 
    destinations: ['浅草', '月島'], 
    duration: '1泊2日', 
    durationDays: 2, 
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop', 
    tags: ['グルメ', '下町'], 
    rating: 4.5, 
    copiedCount: 120, 
    createdAt: '2024-05-15T10:00:00Z', 
    description: '浅草の雷門や仲見世通りを散策し、月島でもんじゃ焼きを堪能するグルメ旅。思い出の写真もたくさん！',
    overallAuthorComment: "浅草と月島、どちらも食べ歩きが楽しい最高のエリアでした！特に月島のもんじゃは種類が豊富で選ぶのも一苦労（笑）また行きたいです。",
    schedules: [
      { 
        date: '2024-07-20', 
        dayDescription: '浅草満喫デー',
        events: [
          { time: '10:00', name: '雷門・仲見世通り散策', category: '観光', description: '定番スポットをぶらり。人形焼もゲット。', locationDetails: { name: '雷門', address: '東京都台東区浅草２丁目３−１' }, publicPhotos: ['https://images.unsplash.com/photo-1580130379628-f009b3170699?q=80&w=400'], publicNotes: 'すごい人だったけど、活気があって楽しかった！' },
          { time: '12:30', name: '昼食：天丼', category: '食事', description: '老舗の天丼屋さん「大黒家天麩羅」へ。', locationDetails: { name: '大黒家天麩羅', address: '東京都台東区浅草１丁目３８−１０' }, publicPhotos: [], publicNotes: '海老が大きくて美味しかった。少し並んだけど価値あり。' },
          { time: '14:30', name: '浅草寺参拝', category: '観光', description: 'お線香をあげてお参り。', locationDetails: { name: '浅草寺', address: '東京都台東区浅草２丁目３−１' }, publicPhotos: [], publicNotes: null },
          { time: '16:00', name: '月島へ移動', category: '移動', description: '電車で移動。', locationDetails: null, publicPhotos: [], publicNotes: null },
          { time: '17:00', name: '夕食：もんじゃ焼き', category: '食事', description: '月島もんじゃストリートで「もへじ」へ。', locationDetails: { name: '月島もんじゃ もへじ', address: '東京都中央区月島３丁目１６−２' }, publicPhotos: ['https://images.unsplash.com/photo-1604019613188-40900604750a?q=80&w=400'], publicNotes: '明太もちチーズもんじゃが最高！お店の人が焼いてくれた。' },
        ]
      },
      {
        date: '2024-07-21',
        dayDescription: '月島散策と帰路',
        events: [
          { time: '10:00', name: '月島界隈散策', category: '観光', description: 'レトロな街並みを楽しむ。', locationDetails: { name: '月島西仲通り商店街', address: '東京都中央区月島' }, publicPhotos: [], publicNotes: '朝の静かな月島も良い雰囲気。' },
          { time: '12:00', name: '昼食：海鮮丼', category: '食事', description: '佃の「かねます」で海鮮丼。', locationDetails: { name: 'かねます', address: '東京都中央区佃１丁目１１−８' }, publicPhotos: [], publicNotes: '新鮮で美味しかった！' },
        ]
      }
    ]
  },
  { 
    id: 'pub2', 
    title: '絶景！富士山一周ドライブ', 
    author: '山ガール花子', 
    destinations: ['富士五湖', '御殿場'], 
    duration: '日帰り', 
    durationDays: 1, 
    coverImage: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1000&auto=format&fit=crop', 
    tags: ['絶景', 'ドライブ', '自然'], 
    rating: 4.8, 
    copiedCount: 250, 
    createdAt: '2024-04-20T14:30:00Z', 
    description: '富士山の周りをドライブし、各地の絶景ポイントや温泉を楽しむ日帰りプラン。最高の景色に癒されました。',
    overallAuthorComment: "富士山はどこから見ても本当に美しい！特に早朝の河口湖からの眺めは格別でした。白糸の滝も迫力満点でおすすめです。",
    schedules: [
      {
        date: '2024-08-05',
        dayDescription: '富士山一周',
        events: [
          { time: '09:00', name: '河口湖出発', category: '移動', description: '時計回りに一周開始！', locationDetails: { name: '河口湖駅', address: '山梨県南都留郡富士河口湖町船津３６４１' }, publicPhotos: [], publicNotes: null },
          { time: '10:00', name: '忍野八海', category: '観光', description: '湧水の池が美しい。', locationDetails: { name: '忍野八海', address: '山梨県南都留郡忍野村忍草' }, publicPhotos: ['https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=400'], publicNotes: '水が本当に綺麗で感動。' },
          { time: '12:00', name: '昼食：ほうとう', category: '食事', description: '山梨名物ほうとうを「小作」で。', locationDetails: { name: '小作 河口湖店', address: '山梨県南都留郡富士河口湖町船津１６３８−１' }, publicPhotos: [], publicNotes: '野菜たっぷりで温まる。' },
          { time: '14:00', name: '白糸の滝', category: '観光', description: 'マイナスイオンたっぷり。', locationDetails: { name: '白糸の滝', address: '静岡県富士宮市上井出' }, publicPhotos: [], publicNotes: '思ったより規模が大きくて迫力があった。' },
          { time: '16:00', name: '御殿場プレミアム・アウトレット', category: 'ショッピング', description: '少しだけお買い物。', locationDetails: { name: '御殿場プレミアム・アウトレット', address: '静岡県御殿場市深沢１３１２' }, publicPhotos: [], publicNotes: '富士山が見えるアウトレットは最高！' },
        ]
      }
    ]
  },
  { id: 'pub3', title: '北海道大自然満喫（夏）', author: 'アウトドア好き', destinations: ['富良野', '美瑛', '旭川'], duration: '4泊5日', durationDays: 5, coverImage: 'https://images.unsplash.com/photo-1536009098083-d4f520d07093?q=80&w=400', tags: ['絶景', '自然', '動物園'], rating: 4.2, copiedCount: 80, createdAt: '2023-07-10T09:00:00Z', description: '夏の北海道でラベンダー畑や青い池を巡り、旭山動物園も楽しむ大自然満喫の旅。', overallAuthorComment: "ラベンダーの香りに癒されました。美瑛の丘の景色は絵葉書のよう。旭山動物園の行動展示も面白かったです。", schedules: [] },
  { id: 'pub4', title: '古都鎌倉・江ノ島歴史散歩', author: '歴史マニア', destinations: ['鎌倉', '江ノ島'], duration: '日帰り', durationDays: 1, coverImage: 'https://images.unsplash.com/photo-1615861030057-c49053879993?q=80&w=400', tags: ['歴史', '寺社仏閣', '海'], rating: 4.0, copiedCount: 95, createdAt: '2024-03-01T11:00:00Z', description: '鎌倉の大仏や鶴岡八幡宮を訪れ、江ノ島まで足を延ばす歴史と自然を感じる散歩コース。', overallAuthorComment: "鎌倉は何度行っても新しい発見があります。江ノ島の夕日も綺麗でした。", schedules: [] },
];


export const useAppLogic = () => {
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
    favoritePlaces: [
      { id: 'fav1', name: '東京タワー', category: '観光', address: '東京都港区芝公園４丁目２−８' },
      { id: 'fav2', name: '金閣寺', category: '観光', address: '京都府京都市北区金閣寺町１' },
    ]
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [trips, setTrips] = useState(initialDummyTrips);
  const [editingEventDetails, setEditingEventDetails] = useState(null);
  const [placeSearchContext, setPlaceSearchContext] = useState(null);
  const [aiRecommendedCourses, setAiRecommendedCourses] = useState([]);
  const [favoritePickerContext, setFavoritePickerContext] = useState(null);
  const [editingPublishSettingsForTripId, setEditingPublishSettingsForTripId] = useState(null);
  const [editingHotelDetails, setEditingHotelDetails] = useState(null); // { tripId, date, hotelData }

  useEffect(() => {
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
  const handleBackToList = () => { setCurrentScreen('tripList'); setSelectedTrip(null); setEditingPlan(null); setCurrentHotelForRecommendations(null); setAiRecommendedCourses([]); };
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
  const handleSelectPublicTrip = (publicTrip) => { 
    setSelectedPublicTripDetail(publicTrip); 
    setCurrentScreen('publicTripDetail'); 
  };
  const handleCopyToMyPlans = (publicTripData) => {
    const newSchedules = (publicTripData.schedules || []).map(day => ({
      ...day,
      events: (day.events || []).map(event => {
        const { publicPhotos, publicNotes, ...restOfEvent } = event;
        return {
          ...restOfEvent, 
          id: `evt-copied-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
          memory: null 
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
      overallMemory: null, 
      coverImage: publicTripData.coverImage || null, 
    }; 
    setTrips(prevTrips => [...prevTrips, newPlan]); 
    alert(`旅程「${newPlan.name}」をマイプランにコピーしました。計画一覧で確認・編集できます。`);
    setCurrentScreen('tripList'); 
  };
  const handleCopyMyOwnTrip = (tripToCopy) => {
    const newSchedules = (tripToCopy.schedules || []).map(day => ({
      ...day,
      events: (day.events || []).map(event => {
        const { memory, id, ...restOfEvent } = event; 
        return {
          ...restOfEvent,
          id: `evt-mycopy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
          memory: null 
        };
      })
    }));
    const newPlan = {
      id: Date.now(),
      name: `コピー：${tripToCopy.name}`,
      period: tripToCopy.period,
      destinations: tripToCopy.destinations, 
      status: '計画中',
      schedules: newSchedules,
      overallMemory: null,
      coverImage: tripToCopy.coverImage || null,
      isPublic: false, 
    };
    setTrips(prevTrips => [...prevTrips, newPlan]);
    alert(`旅程「${newPlan.name}」をコピーして新しい計画を作成しました。`);
    setCurrentScreen('tripList');
  };
  const handleAddFavoritePlace = (placeData) => {
    setUserProfile(prev => {
      const placeId = placeData.id || placeData.name; 
      if (prev.favoritePlaces.find(p => (p.id || p.name) === placeId)) {
        alert(`${placeData.name} は既にお気に入りに追加されています。`);
        return prev;
      }
      const newFavorite = { ...placeData, id: placeId }; 
      return { ...prev, favoritePlaces: [...prev.favoritePlaces, newFavorite] };
    });
    alert(`${placeData.name} をお気に入りに追加しました。`);
  };
  const handleRemoveFavoritePlace = (placeIdOrName) => {
    setUserProfile(prev => ({
      ...prev,
      favoritePlaces: prev.favoritePlaces.filter(p => (p.id || p.name) !== placeIdOrName)
    }));
    const removedPlace = userProfile.favoritePlaces.find(p => (p.id || p.name) === placeIdOrName);
    if (removedPlace) {
        alert(`${removedPlace.name} をお気に入りから削除しました。`);
    }
  };
  const handleShowHotelRecommendations = (hotel) => { setCurrentHotelForRecommendations(hotel); setAiRecommendedCourses([]); setCurrentScreen('hotelRecommendations'); };
  const handleShowProfileEdit = () => setCurrentScreen('profileEdit');
  const handleSaveProfile = (updatedProfile) => { setUserProfile(prevProfile => ({ ...prevProfile, ...updatedProfile })); setCurrentScreen('myProfile'); };
  const handleShowAccountSettings = () => setCurrentScreen('accountSettings');
  const handleLogin = (userData) => { setCurrentUser({name: userData.name, email: userData.email}); setUserProfile(prev => ({...prev, nickname: userData.name, email: userData.email})); setCurrentScreen('tripList'); };
  const handleSignup = (signupData) => { setCurrentUser({ name: signupData.nickname, email: signupData.email }); setUserProfile(prev => ({...prev, nickname: signupData.nickname, email: signupData.email, bio: '' })); setCurrentScreen('tripList'); };
  const handleLogout = () => { 
    if (window.confirm('本当にログアウトしますか？')) {
      setCurrentUser(null); 
      setCurrentScreen('login'); 
    }
  };
  const handleChangeTripStatus = (tripId, newStatus) => { setTrips(prevTrips => prevTrips.map(trip => trip.id === tripId ? { ...trip, status: newStatus } : trip )); if (selectedTrip && selectedTrip.id === tripId) { setSelectedTrip(prevSelectedTrip => ({ ...prevSelectedTrip, status: newStatus })); } };
  const handleToggleTripPublicStatus = (tripId) => {
    setTrips(prevTrips => prevTrips.map(trip => 
      trip.id === tripId ? { ...trip, isPublic: !trip.isPublic } : trip
    ));
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(prevSelectedTrip => ({ ...prevSelectedTrip, isPublic: !prevSelectedTrip.isPublic }));
    }
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
          if (selectedTrip && selectedTrip.id === trip.id) { 
            setSelectedTrip(updatedTrip); 
          }
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
  const handleShowFavoritePlaces = () => { setCurrentScreen('favoritePlacesList'); };
  const handleShowFavoritePickerForEvent = (callback) => {
    setFavoritePickerContext({ returnScreen: 'eventForm', callback });
    setCurrentScreen('favoritePicker'); 
  };

  const handleShowPublishSettings = (tripId) => {
    setEditingPublishSettingsForTripId(tripId);
    setCurrentScreen('tripPublishSettings');
  };

  const handleSavePublishSettings = (tripId, settings) => {
    setTrips(prevTrips => prevTrips.map(t => 
      t.id === tripId ? { ...t, publishSettings: settings, isPublic: true } : t
    ));
    // selectedTripも更新する必要がある場合
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(prev => ({ ...prev, publishSettings: settings, isPublic: true }));
    }
    setEditingPublishSettingsForTripId(null);
    setCurrentScreen('tripDetail');
    alert('公開設定を保存しました。');
  };

  const handleCancelPublishSettings = () => {
    setEditingPublishSettingsForTripId(null);
    setCurrentScreen('tripDetail');
  };

  const handleShowHotelDetailModal = (tripId, date, hotelData) => {
    setEditingHotelDetails({ tripId, date, hotelData });
    // currentScreen は変更しない（モーダルなので裏の画面はそのまま）
  };

  const handleSaveHotelDetails = (tripId, date, newHotelData) => {
    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id === tripId) {
        const newSchedules = (trip.schedules || []).map(schedule => {
          if (schedule.date === date) {
            return { ...schedule, hotel: { ...schedule.hotel, ...newHotelData } };
          }
          return schedule;
        });
        const updatedTrip = { ...trip, schedules: newSchedules };
        if (selectedTrip && selectedTrip.id === tripId) {
          setSelectedTrip(updatedTrip);
        }
        return updatedTrip;
      }
      return trip;
    }));
    setEditingHotelDetails(null);
    alert('ホテル情報を更新しました。');
  };

  const handleCancelHotelDetailModal = () => {
    setEditingHotelDetails(null);
  };

  const handleRequestAICourse = (hotel, params) => {
    console.log('AIコース提案リクエスト:', { hotel, params });
    const dummyCourses = [
      { id: 'course1', name: `${params.categories.join(', ')}巡り (${params.duration}時間コース)`, duration: `${params.duration}時間`, spots: [ {name: 'ダミースポットA (ホテル近く)', time: '30分'}, {name: 'ダミースポットB', time: '60分'} ], transport: '徒歩とバス', totalTime: `${params.duration}時間`},
      { id: 'course2', name: `のんびり${params.categories[0] || 'お散歩'}コース`, duration: `${params.duration}時間`, spots: [ {name: 'ダミー公園', time: '90分'}, {name: '眺めの良いカフェ', time: '45分'} ], transport: '徒歩', totalTime: `${params.duration}時間`},
    ];
    setAiRecommendedCourses(dummyCourses);
  };

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
    editingHotelDetails, // 追加
    handleShowPlanForm, handleShowTripDetail, handleSavePlan, handleCancelPlanForm, handleBackToList,
    handleRequestAIForTrip, handleShowPlaceSearchGeneral, handleShowPlaceSearchForPlanForm,
    handleShowPlaceSearchForEvent, handleSetHotelForDay, handleHotelSelectedForDay, newHandlePlaceSelected,
    handleShowPlaceDetail, handleBackFromPlaceDetail, handleShowRouteOptions, handleRouteSelected,
    handleShowMemoryForm, handleSaveMemory, handleShowMemoryView, handleShowPublicTripsSearch,
    handleSelectPublicTrip, handleCopyToMyPlans, handleCopyMyOwnTrip, handleAddFavoritePlace,
    handleRemoveFavoritePlace, handleShowHotelRecommendations, handleShowProfileEdit, handleSaveProfile,
    handleShowAccountSettings, handleLogin, handleSignup, handleLogout, handleChangeTripStatus,
    handleToggleTripPublicStatus, handleShowEventForm, handleSaveEvent, handleDeleteAccountRequest,
    handleConfirmAccountDeletion, handleChangePasswordRequest, handleConfirmPasswordChange,
    handleChangeEmailRequest, handleSendEmailConfirmation, handleSendPasswordResetLink,
    handleConfirmCodeAndSetNewPassword, handleShowMyProfile, handleShowFavoritePlaces,
    handleShowFavoritePickerForEvent, handleRequestAICourse,
    handleShowPublishSettings, handleSavePublishSettings, handleCancelPublishSettings,
    handleShowHotelDetailModal, handleSaveHotelDetails, handleCancelHotelDetailModal,
    handleShowBackendTest: () => setCurrentScreen('backendTest') // 追加
  };
};
