import React, { useState } from 'react';
// import './PublicTripDetailScreen.css'; // 必要に応じて作成

// ダミーの公開旅程詳細データ (PublicTripsSearchScreenのdummyPublicTripsと連携)
const dummyPublicTripDetail = {
  id: 'pub1',
  title: '週末行く！東京下町グルメ旅',
  author: '旅好き太郎',
  destinations: '浅草、月島',
  duration: '1泊2日',
  coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
  tags: ['グルメ', '下町'],
  description: '週末にふらっと行ける、東京の下町グルメを満喫する旅程です。浅草の定番から月島のもんじゃまで、美味しいものをたくさん食べましょう！',
  estimatedCost: '約20,000円',
  dailySchedules: [
    {
      date: 'Day 1',
      dayDescription: '浅草食べ歩きとスカイツリー',
      events: [
        { time: '11:00', name: '浅草寺・仲見世通り散策', category: '観光' },
        { time: '13:00', name: '昼食：天丼', category: '食事' },
        { time: '15:00', name: '東京スカイツリー', category: '観光' },
        { time: '18:00', name: '夕食：どぜう鍋', category: '食事' },
      ]
    },
    {
      date: 'Day 2',
      dayDescription: '月島もんじゃと築地場外市場',
      events: [
        { time: '10:00', name: '築地場外市場で朝食兼ブランチ', category: '食事' },
        { time: '12:00', name: '月島へ移動', category: '移動' },
        { time: '13:00', name: '月島もんじゃストリートで昼食', category: '食事' },
        { time: '15:00', name: '解散', category: 'その他' },
      ]
    }
  ],
  comments: [
    { user: '旅子', text: 'このプラン参考にしました！楽しかったです！' },
    { user: '食いしん坊', text: 'もんじゃ美味しそう！' },
  ]
};

function PublicTripDetailScreen({ publicTripId, onBack, onCopyToMyPlans }) {
  // TODO: publicTripId を元に実際の公開旅程詳細データを取得する処理
  const [tripDetail, setTripDetail] = useState(dummyPublicTripDetail);

  if (!tripDetail) {
    return <div>公開旅程情報がありません。<button onClick={onBack}>戻る</button></div>;
  }

  return (
    <div className="public-trip-detail-screen">
      <header className="app-header">
        <h1>{tripDetail.title}</h1>
        <div>
          <button onClick={() => onCopyToMyPlans(tripDetail)} className="copy-to-my-plans-button">この旅程を自分の計画にコピー</button>
          <button onClick={onBack} className="back-button">検索結果へ戻る</button>
        </div>
      </header>

      <div className="public-trip-summary">
        {tripDetail.coverImage && <img src={tripDetail.coverImage} alt={tripDetail.title} className="public-trip-detail-image" />}
        <h2>{tripDetail.title}</h2>
        <p>作成者: {tripDetail.author}</p>
        <p>主な目的地: {tripDetail.destinations}</p>
        <p>期間: {tripDetail.duration}</p>
        <p>タグ: {tripDetail.tags?.join(', ')}</p>
        <p>概要: {tripDetail.description}</p>
        <p>概算費用: {tripDetail.estimatedCost}</p>
      </div>

      <div className="public-trip-daily-schedules">
        <h3>スケジュール詳細</h3>
        {tripDetail.dailySchedules.map((daily, index) => (
          <div key={index} className="daily-schedule-item">
            <h4>{daily.date} ({daily.dayDescription})</h4>
            <ul>
              {daily.events.map((event, eventIndex) => (
                <li key={eventIndex}><strong>{event.time}</strong> - {event.name} ({event.category})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {tripDetail.comments && tripDetail.comments.length > 0 && (
        <div className="public-trip-comments">
          <h3>コメント</h3>
          {tripDetail.comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <p><strong>{comment.user}:</strong> {comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicTripDetailScreen;
