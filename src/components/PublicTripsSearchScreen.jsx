import React, { useState, useEffect } from 'react';
// import './PublicTripsSearchScreen.css'; // 必要に応じて作成

// ダミーの公開旅程データ
const initialDummyPublicTrips = [
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
  // 他のダミーデータも同様に schedules を追加する想定
  { id: 'pub3', title: '北海道大自然満喫（夏）', author: 'アウトドア好き', destinations: ['富良野', '美瑛', '旭川'], duration: '4泊5日', durationDays: 5, coverImage: 'https://images.unsplash.com/photo-1536009098083-d4f520d07093?q=80&w=400', tags: ['絶景', '自然', '動物園'], rating: 4.2, copiedCount: 80, createdAt: '2023-07-10T09:00:00Z', description: '夏の北海道でラベンダー畑や青い池を巡り、旭山動物園も楽しむ大自然満喫の旅。', schedules: [] },
  { id: 'pub4', title: '古都鎌倉・江ノ島歴史散歩', author: '歴史マニア', destinations: ['鎌倉', '江ノ島'], duration: '日帰り', durationDays: 1, coverImage: 'https://images.unsplash.com/photo-1615861030057-c49053879993?q=80&w=400', tags: ['歴史', '寺社仏閣', '海'], rating: 4.0, copiedCount: 95, createdAt: '2024-03-01T11:00:00Z', description: '鎌倉の大仏や鶴岡八幡宮を訪れ、江ノ島まで足を延ばす歴史と自然を感じる散歩コース。', schedules: [] },
];

function PublicTripCard({ trip, onSelect }) {
  return (
    <div className="public-trip-card card-style" onClick={() => onSelect(trip)} style={{marginBottom: '15px'}}>
      {trip.coverImage && <img src={trip.coverImage} alt={trip.title} className="public-trip-card-image" style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px 4px 0 0'}} />}
      <div className="public-trip-card-content" style={{padding: '10px'}}>
        <h3 style={{marginTop: 0, marginBottom: '5px'}}>{trip.title}</h3>
        <p style={{fontSize: '0.8em', color: '#555', margin: '0 0 5px 0'}}>作成者: {trip.author}</p>
        <p style={{fontSize: '0.9em', margin: '0 0 5px 0'}}>主な目的地: {trip.destinations.join(', ')}</p>
        <p style={{fontSize: '0.9em', margin: '0 0 10px 0'}}>期間: {trip.duration}</p>
        <div className="tags" style={{marginBottom: '5px'}}>
          {trip.tags?.map(tag => <span key={tag} className="tag" style={{fontSize: '0.75em', background: '#eee', padding: '2px 6px', borderRadius: '3px', marginRight: '5px'}}>#{tag}</span>)}
        </div>
        <p style={{fontSize: '0.8em', color: '#777'}}>評価: {trip.rating}★ | コピー数: {trip.copiedCount}</p>
      </div>
    </div>
  );
}

function PublicTripsSearchScreen({ onSelectPublicTrip, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    destination: '',
    duration: 'any', // 'any', 'day_trip', '1_night', '2_nights', '3_plus_nights'
    theme: '',
  });
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'newest', 'rating'
  const [filteredAndSortedResults, setFilteredAndSortedResults] = useState(initialDummyPublicTrips);

  useEffect(() => {
    let results = [...initialDummyPublicTrips];

    // 検索語フィルター
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      results = results.filter(trip => 
        trip.title.toLowerCase().includes(lowerSearchTerm) ||
        trip.destinations.some(d => d.toLowerCase().includes(lowerSearchTerm)) ||
        trip.tags.some(t => t.toLowerCase().includes(lowerSearchTerm)) ||
        (trip.description && trip.description.toLowerCase().includes(lowerSearchTerm)) ||
        trip.author.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 目的地フィルター
    if (filters.destination.trim()) {
      const lowerDest = filters.destination.toLowerCase();
      results = results.filter(trip => trip.destinations.some(d => d.toLowerCase().includes(lowerDest)));
    }

    // 期間フィルター
    if (filters.duration !== 'any') {
      results = results.filter(trip => {
        if (filters.duration === 'day_trip') return trip.durationDays === 1;
        if (filters.duration === '1_night') return trip.durationDays === 2;
        if (filters.duration === '2_nights') return trip.durationDays === 3;
        if (filters.duration === '3_plus_nights') return trip.durationDays > 3;
        return true;
      });
    }
    
    // テーマフィルター
    if (filters.theme.trim()) {
      const lowerTheme = filters.theme.toLowerCase();
      results = results.filter(trip => trip.tags.some(t => t.toLowerCase().includes(lowerTheme)));
    }

    // ソート
    if (sortBy === 'popular') {
      results.sort((a, b) => b.copiedCount - a.copiedCount);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    setFilteredAndSortedResults(results);
  }, [searchTerm, filters, sortBy]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="public-trips-search-screen">
      <header className="app-header">
        <h1>公開旅程を探す</h1>
        <button onClick={onCancel} className="back-button">戻る</button>
      </header>

      <div className="search-form" style={{padding: '10px', background: '#f0f0f0', marginBottom: '15px'}}>
        <input
          type="text"
          placeholder="キーワードで検索 (例: 東京 グルメ)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
          style={{width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
        <div className="filter-sort-area" style={{display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center'}}>
          <input 
            type="text" 
            placeholder="目的地 (例: 京都)" 
            value={filters.destination} 
            onChange={(e) => handleFilterChange('destination', e.target.value)}
            style={{padding: '8px', flexGrow: 1, minWidth: '120px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
          <select value={filters.duration} onChange={(e) => handleFilterChange('duration', e.target.value)} style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
            <option value="any">期間指定なし</option>
            <option value="day_trip">日帰り</option>
            <option value="1_night">1泊2日</option>
            <option value="2_nights">2泊3日</option>
            <option value="3_plus_nights">3泊以上</option>
          </select>
          <input 
            type="text" 
            placeholder="テーマ (例: 温泉)" 
            value={filters.theme} 
            onChange={(e) => handleFilterChange('theme', e.target.value)}
            style={{padding: '8px', flexGrow: 1, minWidth: '120px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
            <option value="popular">人気順</option>
            <option value="newest">新着順</option>
            <option value="rating">評価順</option>
          </select>
        </div>
      </div>

      <div className="public-trips-list" style={{padding: '0 10px'}}>
        {filteredAndSortedResults.length > 0 ? (
          filteredAndSortedResults.map(trip => <PublicTripCard key={trip.id} trip={trip} onSelect={onSelectPublicTrip} />)
        ) : (
          <p>条件に合う旅程が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
}

export default PublicTripsSearchScreen;
