import React, { useState, useEffect } from 'react'; // useEffect をインポート
// import './TripDetailScreen.css'; // 必要に応じて作成

const tripStatuses = ['計画中', '予約済み', '旅行中', '完了', 'キャンセル'];

function DailySchedule({ schedule, trip, onSelectTravelSegment, onAddMemoryForEvent, onShowHotelRecommendations, onAddEventToDay, onRequestAI, onSetHotelForDay, currentDate }) {
  return (
    <div className="daily-schedule">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3>{schedule.date} <span className="day-description">({schedule.dayDescription})</span></h3>
        <div style={{display: 'flex', gap: '10px'}}>
          {onRequestAI && (
            <button 
              onClick={() => onRequestAI(trip)} 
              className="ai-suggest-button"
              style={{fontSize: '0.9em', padding: '6px 10px'}}
            >
              AI提案
            </button>
          )}
          {onAddEventToDay && ( 
            <button 
              className="add-event-to-day-button" 
              onClick={() => onAddEventToDay(schedule.date)}
            >
              + 予定追加
            </button>
          )}
        </div>
      </div>

      {/* ホテル情報表示と設定ボタン */}
      <div className="hotel-info-section" style={{ marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
        {schedule.hotel ? (
          <div>
            <strong>宿泊場所:</strong> {schedule.hotel.name} ({schedule.hotel.address})
            <button onClick={() => onSetHotelForDay(currentDate)} style={{ marginLeft: '10px', fontSize: '0.8em' }}>変更</button>
            {schedule.hotel.checkIn && <p style={{fontSize: '0.8em', margin: '5px 0 0 0'}}>チェックイン: {schedule.hotel.checkIn} {schedule.hotel.checkOut && ` / チェックアウト: ${schedule.hotel.checkOut}`}</p>}
            {schedule.hotel.notes && <p style={{fontSize: '0.8em', margin: '5px 0 0 0'}}>メモ: {schedule.hotel.notes}</p>}
          </div>
        ) : (
          <button onClick={() => onSetHotelForDay(currentDate)}>この日の宿泊場所を設定</button>
        )}
      </div>

      <div className="timeline">
        {schedule.events.map((event, index) => (
          <div 
            key={event.id || index} 
            className={`timeline-event type-${event.type} ${event.type === 'travel' ? 'clickable' : ''}`}
            onClick={event.type === 'travel' && onSelectTravelSegment ? () => {
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
              {event.type !== 'travel' && onAddMemoryForEvent && (
                <button 
                  className="add-memory-button" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddMemoryForEvent(event.name, schedule.date); // 日付情報も渡す
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

function TripDetailScreen({ trip, onBack, onEditPlanBasics, onRequestAI, onShowRouteOptions, onAddMemoryForEvent, onShowHotelRecommendations, onAddEventToDay, onViewOverallMemories, onChangeTripStatus, onSetHotelForDay, onTogglePublicStatus, onCopyMyOwnTrip, onShowPublishSettings }) { // onShowPublishSettings を追加
  const [selectedDate, setSelectedDate] = useState(null); 
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  useEffect(() => {
    if (trip?.schedules && trip.schedules.length > 0) {
      setSelectedDate(trip.schedules[0].date);
    } else {
      setSelectedDate(null); // スケジュールがない場合はnull
    }
  }, [trip]);

  if (!trip) {
    return <div className="trip-detail-screen" style={{padding: '20px'}}><p>旅行データが見つかりません。</p><button onClick={onBack}>戻る</button></div>;
  }

  const schedulesToDisplay = trip.schedules && trip.schedules.length > 0 ? trip.schedules : [];
  const currentSchedule = selectedDate ? schedulesToDisplay.find(s => s.date === selectedDate) : (schedulesToDisplay[0] || null);


  const handleStatusChange = (newStatus) => {
    if (onChangeTripStatus) {
      onChangeTripStatus(trip.id, newStatus);
    }
    setIsEditingStatus(false);
  };

  return (
    <div className="trip-detail-screen">
      <header className="app-header">
        <h1>{trip.name}</h1>
        <div>
          {onCopyMyOwnTrip && <button onClick={() => onCopyMyOwnTrip(trip)} className="action-button" style={{marginRight: '10px'}}>この計画をコピー</button>}
          <button onClick={() => onEditPlanBasics(trip)} className="edit-plan-basics-button" style={{marginRight: '10px'}}>基本情報編集</button>
          <button onClick={onBack} className="back-button">一覧へ戻る</button>
        </div>
      </header>

      <div className="trip-summary card-style" style={{marginBottom: '15px'}}>
        <p><strong>期間:</strong> {trip.period}</p>
        <p><strong>主な目的地:</strong> {trip.destinations}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <p style={{ margin: 0 }}><strong>ステータス:</strong></p>
          {isEditingStatus ? (
            <select 
              value={trip.status} 
              onChange={(e) => handleStatusChange(e.target.value)}
              onBlur={() => setIsEditingStatus(false)}
              autoFocus
            >
              {tripStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          ) : (
            <p style={{ margin: 0 }}>{trip.status}</p>
          )}
          {!isEditingStatus && onChangeTripStatus && (
            <button onClick={() => setIsEditingStatus(true)} className="edit-status-button" style={{fontSize: '0.8em', padding: '4px 8px'}}>変更</button>
          )}
        </div>
        {/* 公開設定UIの改善 */}
        {onTogglePublicStatus && (
          <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
            <h4 style={{marginTop: 0, marginBottom: '5px'}}>公開設定</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input 
                type="checkbox" 
                id={`public-toggle-${trip.id}`} 
                checked={trip.isPublic || false} 
                onChange={() => onTogglePublicStatus(trip.id)} 
              />
              <label htmlFor={`public-toggle-${trip.id}`}>この旅程を他のユーザーに公開する</label>
            </div>
            {trip.isPublic && (
              <p style={{fontSize: '0.8em', color: '#555', margin: '5px 0 0 0'}}>
                公開すると、他のユーザーがこの旅程を検索・閲覧できるようになります。
              </p>
            )}
            <button 
              onClick={() => onShowPublishSettings(trip.id)} 
              style={{fontSize: '0.9em', padding: '6px 10px', marginTop: '10px'}}
            >
              公開の詳細設定...
            </button>
            {/* TODO: Issue #62 - 公開範囲や公開情報の詳細設定UIをここに追加 は TripPublishSettingsScreen で対応 */}
          </div>
        )}
      </div>
      
      <nav className="date-navigation">
        {schedulesToDisplay.map(schedule => (
          <button 
            key={schedule.date} 
            onClick={() => setSelectedDate(schedule.date)}
            className={selectedDate === schedule.date ? 'active' : ''}
          >
            {schedule.date.startsWith('20') ? new Date(schedule.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' }) : schedule.date }
          </button>
        ))}
      </nav>

      {currentSchedule ? <DailySchedule 
        schedule={currentSchedule} 
        trip={trip}
        onSelectTravelSegment={(originEvent, travelEvent, destinationEvent) => {
          const origin = originEvent && originEvent.type !== 'travel' 
            ? { name: originEvent.name, ...(originEvent.details || {}) } 
            : (currentSchedule.hotel || { name: trip.name + 'の出発地（仮）' }); // ホテルがあればホテルを起点に
          
          const destination = destinationEvent && destinationEvent.type !== 'travel'
            ? { name: destinationEvent.name, ...(destinationEvent.details || {}) }
            : { name: trip.name + 'の次の目的地（仮）' };
          
          onShowRouteOptions(origin, destination);
        }}
        onAddMemoryForEvent={onAddMemoryForEvent}
        onShowHotelRecommendations={onShowHotelRecommendations}
        onAddEventToDay={onAddEventToDay} 
        onRequestAI={onRequestAI}
        onSetHotelForDay={onSetHotelForDay} // Propを渡す
        currentDate={selectedDate} // 現在選択中の日付を渡す
      /> : <p>この日のスケジュールはありません。</p>}

      {onViewOverallMemories && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => onViewOverallMemories(trip.id)} 
            className="view-memories-button"
            style={{padding: '10px 20px', fontSize: '1em'}}
          >
            この旅行の思い出を見る・編集する
          </button>
        </div>
      )}
    </div>
  );
}

export default TripDetailScreen;
