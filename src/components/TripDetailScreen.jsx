import React, { useState } from 'react';
// import './TripDetailScreen.css'; // 必要に応じて作成

// ダミーの日毎スケジュールデータ
const dummyDailySchedules = [
  {
    date: '2024-08-10',
    dayDescription: '移動と札幌市内観光',
    events: [
      { time: '14:00', type: 'travel', name: '新千歳空港から札幌市内へ移動', description: 'JR快速エアポート', estimatedDurationMinutes: 40, category: '移動' },
      { time: '15:00', type: 'hotel_checkin', name: '札幌グランドホテル', description: 'チェックイン', estimatedDurationMinutes: 60, category: '宿泊', details: { address: '札幌市中央区北1条西4丁目', isHotel: true } },
      { time: '16:30', type: 'activity', name: '大通公園散策', description: 'テレビ塔や花時計を見る', estimatedDurationMinutes: 90, category: '観光', details: { address: '札幌市中央区大通西1～12丁目' } },
      { time: '18:30', type: 'meal', name: '夕食：ジンギスカン', description: 'だるま 本店', estimatedDurationMinutes: 90, category: '食事', details: { address: '札幌市中央区南5条西4' } },
    ],
  },
  {
    date: '2024-08-11',
    dayDescription: '小樽観光',
    events: [
      { time: '09:00', type: 'travel', name: '札幌から小樽へ移動', description: 'JR函館本線', estimatedDurationMinutes: 50, category: '移動' },
      { time: '10:00', type: 'activity', name: '小樽運河クルーズ', description: '歴史的な運河を巡る', estimatedDurationMinutes: 40, category: '観光', details: { address: '小樽市港町５' } },
      { time: '11:00', type: 'activity', name: '北一硝子・オルゴール堂散策', description: 'ガラス製品やオルゴールを見る', estimatedDurationMinutes: 120, category: '観光', details: { address: '小樽市堺町7-26' } },
      { time: '13:30', type: 'meal', name: '昼食：海鮮丼', description: '小樽の新鮮な海の幸', estimatedDurationMinutes: 60, category: '食事', details: { address: '小樽市堺町周辺' } },
      { time: '15:00', type: 'travel', name: '小樽から札幌へ戻る', description: 'JR函館本線', estimatedDurationMinutes: 50, category: '移動' },
    ],
  },
];

function DailySchedule({ schedule, trip, onSelectTravelSegment, onAddMemoryForEvent, onShowHotelRecommendations }) {
  return (
    <div className="daily-schedule">
      <h3>{schedule.date} <span className="day-description">({schedule.dayDescription})</span></h3>
      <div className="timeline">
        {schedule.events.map((event, index) => (
          <div 
            key={index} 
            className={`timeline-event type-${event.type} ${event.type === 'travel' ? 'clickable' : ''}`}
            onClick={event.type === 'travel' ? () => {
              const originEvent = index > 0 ? schedule.events[index-1] : null;
              const destinationEvent = index < schedule.events.length - 1 ? schedule.events[index+1] : null;
              onSelectTravelSegment(originEvent, event, destinationEvent);
            } : undefined}
          >
            <div className="timeline-time">{event.time}</div>
            <div className="timeline-content">
              <h4>{event.name} <span className="event-category">[{event.category}]</span></h4>
              <p>{event.description}</p>
              {event.estimatedDurationMinutes && <p className="event-duration">所要時間: 約{event.estimatedDurationMinutes}分</p>}
              {event.type !== 'travel' && (
                <button 
                  className="add-memory-button" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddMemoryForEvent(event.name); // existingMemory はApp側で管理想定
                  }}
                >
                  思い出を登録/編集
                </button>
              )}
              {event.type === 'hotel_checkin' && event.details?.isHotel && onShowHotelRecommendations && (
                 <button 
                   className="show-hotel-recommendations-button"
                   onClick={(e) => {
                     e.stopPropagation();
                     onShowHotelRecommendations({ name: event.name, ...event.details });
                   }}
                 >
                   このホテル周辺のおすすめを見る
                 </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TripDetailScreen({ trip, onBack, onEditPlanBasics, onRequestAI, onShowRouteOptions, onAddMemoryForEvent, onShowHotelRecommendations }) {
  const [selectedDate, setSelectedDate] = useState(dummyDailySchedules[0]?.date); 

  if (!trip) {
    return <div>旅行計画が選択されていません。<button onClick={onBack}>戻る</button></div>;
  }

  // 実際のアプリケーションでは、tripオブジェクトに日毎のスケジュールが含まれる想定
  // ここではダミーデータを使用
  const schedulesToDisplay = trip.schedules || dummyDailySchedules;
  const currentSchedule = schedulesToDisplay.find(s => s.date === selectedDate) || schedulesToDisplay[0];


  return (
    <div className="trip-detail-screen">
      <header className="app-header">
        <h1>{trip.name}</h1>
        <div>
          <button onClick={() => onEditPlanBasics(trip)} className="edit-plan-basics-button">基本情報編集</button>
          <button onClick={onBack} className="back-button">一覧へ戻る</button>
        </div>
      </header>

      <div className="trip-summary">
        <p><strong>期間:</strong> {trip.period}</p>
        <p><strong>主な目的地:</strong> {trip.destinations}</p>
        <p><strong>ステータス:</strong> {trip.status}</p>
      </div>
      
      <div className="ai-actions">
        <button onClick={() => onRequestAI(trip)} className="ai-suggest-button">AIに旅程を提案してもらう</button>
      </div>

      <nav className="date-navigation">
        {schedulesToDisplay.map(schedule => (
          <button 
            key={schedule.date} 
            onClick={() => setSelectedDate(schedule.date)}
            className={selectedDate === schedule.date ? 'active' : ''}
          >
            {/* 日付のフォーマットはダミーデータに合わせて調整 */}
            {schedule.date.startsWith('20') ? new Date(schedule.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' }) : schedule.date }
          </button>
        ))}
      </nav>

      {currentSchedule && <DailySchedule 
        schedule={currentSchedule} 
        trip={trip} // ホテル情報などを参照するために渡す
        onSelectTravelSegment={(originEvent, travelEvent, destinationEvent) => {
          const origin = originEvent && originEvent.type !== 'travel' 
            ? { name: originEvent.name, ...(originEvent.details || {}) } 
            : { name: trip.name + 'の出発地（仮）' };
          
          const destination = destinationEvent && destinationEvent.type !== 'travel'
            ? { name: destinationEvent.name, ...(destinationEvent.details || {}) }
            : { name: trip.name + 'の次の目的地（仮）' };
          
          onShowRouteOptions(origin, destination);
        }}
        onAddMemoryForEvent={onAddMemoryForEvent}
        onShowHotelRecommendations={onShowHotelRecommendations}
      />}
    </div>
  );
}

export default TripDetailScreen;
