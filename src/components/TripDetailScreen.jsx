import React, { useState, useEffect } from 'react'; 
// import './TripDetailScreen.css'; 

const tripStatuses = ['計画中', '予約済み', '旅行中', '完了', 'キャンセル'];

function DailySchedule({ 
  schedule, 
  trip, 
  onSelectTravelSegment, 
  onShowMemoryForm, // onAddMemoryForEvent から変更
  onShowHotelRecommendations, 
  onAddEventToDay, 
  onRequestAI, 
  onSetHotelForDay, 
  currentDate, 
  onShowHotelDetailModal, 
  onEditEvent, 
  onDeleteEvent 
}) {
  return (
    <> 
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3>{schedule.date} <span className="day-description">({schedule.day_description})</span></h3>
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
              onClick={() => onAddEventToDay(schedule.date, schedule.id)}
            >
              + 予定追加
            </button>
          )}
        </div>
      </div>

      <div className="hotel-info-section" style={{ marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
        {schedule.hotel_info ? ( 
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <strong>宿泊場所:</strong> {schedule.hotel_info.name} ({schedule.hotel_info.address || '住所未登録'})
                {schedule.hotel_info.checkInTime && <p style={{fontSize: '0.8em', margin: '5px 0 0 0'}}>チェックイン: {schedule.hotel_info.checkInTime} {schedule.hotel_info.checkOutTime && ` / チェックアウト: ${schedule.hotel_info.checkOutTime}`}</p>}
                {schedule.hotel_info.reservationNumber && <p style={{fontSize: '0.8em', margin: '5px 0 0 0'}}>予約番号: {schedule.hotel_info.reservationNumber}</p>}
                {schedule.hotel_info.notes && <p style={{fontSize: '0.8em', margin: '5px 0 0 0'}}>備考: {schedule.hotel_info.notes}</p>}
              </div>
              <div>
                <button onClick={() => onShowHotelDetailModal(trip.id, currentDate, schedule.hotel_info)} style={{ fontSize: '0.8em', padding: '4px 8px', marginRight: '5px' }}>詳細編集</button> 
                <button onClick={() => onSetHotelForDay(currentDate)}>この日の宿泊場所を設定</button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => onSetHotelForDay(currentDate)}>この日の宿泊場所を設定</button>
        )}
      </div>

      <div className="timeline">
        {(schedule.events || []).map((event, index) => ( 
          <div 
            key={event.id || index} 
            className={`timeline-event type-${event.type} ${event.type === 'travel' ? 'clickable' : ''}`}
            onClick={event.type === 'travel' && onSelectTravelSegment ? () => {
              const originEvent = index > 0 ? (schedule.events || [])[index-1] : null; 
              const destinationEvent = index < (schedule.events || []).length - 1 ? (schedule.events || [])[index+1] : null; 
              onSelectTravelSegment(originEvent, event, destinationEvent);
            } : undefined}
          >
            <div className="timeline-time">{event.time}</div>
            <div className="timeline-content">
              <h4>{event.name} <span className="event-category">[{event.category}]</span></h4>
              <p>{event.description}</p>
              {event.estimatedDurationMinutes && <p className="event-duration">所要時間: 約{event.estimatedDurationMinutes}分</p>}
              {event.type !== 'travel' && onShowMemoryForm && (
                <button 
                  className="add-memory-button" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    // onShowMemoryForm(tripId, eventId, eventName, date, existingMemory)
                    onShowMemoryForm(trip.id, event.id, event.name, schedule.date, null); // existingMemory は新規作成なのでnull
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
              <div style={{marginTop: '10px'}}>
                {onEditEvent && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEditEvent(schedule.id, event); }} 
                    style={{fontSize: '0.8em', padding: '4px 8px', marginRight: '5px'}}
                  >
                    編集
                  </button>
                )}
                {onDeleteEvent && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteEvent(schedule.id, event.id); }} 
                    style={{fontSize: '0.8em', padding: '4px 8px', color: 'red'}}
                  >
                    削除
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </> 
  );
}

function TripDetailScreen({ 
  trip, 
  onBack, 
  onEditPlanBasics, 
  onRequestAI, 
  onShowRouteOptions, 
  onShowMemoryForm, // onAddMemoryForEvent から変更
  onShowHotelRecommendations, 
  onAddEventToDay, 
  onViewOverallMemories, 
  onChangeTripStatus, 
  onSetHotelForDay, 
  onTogglePublicStatus, 
  onCopyMyOwnTrip, 
  onShowPublishSettings, 
  onShowHotelDetailModal, 
  onAddSchedule, 
  onDeleteTrip, 
  onEditEvent, 
  onDeleteEvent 
}) {
  const [selectedDate, setSelectedDate] = useState(null); 
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  useEffect(() => {
    if (trip?.schedules && trip.schedules.length > 0) {
      const dateExistsInNewSchedules = trip.schedules.some(s => s.date === selectedDate);
      if (selectedDate && dateExistsInNewSchedules) {
        // 現在選択中の日付が新しいスケジュールリストにも存在する場合、selectedDateは変更しない
      } else {
        setSelectedDate(trip.schedules[0].date);
      }
    } else {
      setSelectedDate(null); 
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
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #eee' }}>
        <div>
          <h1>{trip.name}</h1>
          {trip.start_date && trip.end_date && (
            <p style={{ fontSize: '0.9em', color: '#666', margin: '0 0 5px 0' }}>
              {new Date(trip.start_date).toLocaleDateString('ja-JP')} - {new Date(trip.end_date).toLocaleDateString('ja-JP')}
            </p>
          )}
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          {onCopyMyOwnTrip && <button onClick={() => onCopyMyOwnTrip(trip)} className="action-button">この計画をコピー</button>}
          <button onClick={() => onEditPlanBasics(trip)} className="edit-plan-basics-button">基本情報編集</button>
          {onDeleteTrip && <button onClick={() => onDeleteTrip(trip.id)} className="delete-trip-button" style={{backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer'}}>この旅程を削除</button>}
          <button onClick={onBack} className="back-button">一覧へ戻る</button>
        </div>
      </header>

      <div className="trip-summary card-style" style={{marginBottom: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '4px', marginTop: '15px' }}>
        <p><strong>目的地:</strong> {trip.destinations || '未設定'}</p>
        <p><strong>期間:</strong> {trip.period_summary || (trip.start_date && trip.end_date ? `${new Date(trip.start_date).toLocaleDateString('ja-JP')} から ${new Date(trip.end_date).toLocaleDateString('ja-JP')} まで` : '未設定')}</p>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <strong>ステータス:</strong> 
          {isEditingStatus ? (
            <select value={trip.status} onChange={(e) => handleStatusChange(e.target.value)} onBlur={() => setIsEditingStatus(false)}>
              {tripStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <span onClick={() => setIsEditingStatus(true)} style={{cursor: 'pointer', textDecoration: 'underline'}}>{trip.status || '未設定'}</span>
          )}
        </div>
        {onTogglePublicStatus && (
          <div style={{marginTop: '10px'}}>
            <label>
              <input type="checkbox" checked={!!trip.is_public} onChange={() => onTogglePublicStatus(trip.id, !trip.is_public)} />
              この旅程を公開する
            </label>
            {trip.is_public && onShowPublishSettings && <button onClick={() => onShowPublishSettings(trip.id)} style={{marginLeft: '10px', fontSize: '0.8em'}}>公開設定</button>}
          </div>
        )}
      </div>
      
      <nav className="date-navigation">
        {schedulesToDisplay.map(schedule => (
          <button 
            key={schedule.id || schedule.date} 
            onClick={() => setSelectedDate(schedule.date)}
            className={selectedDate === schedule.date ? 'active' : ''}
          >
            {schedule.date.startsWith('20') ? new Date(schedule.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' }) : schedule.date }
          </button>
        ))}
      </nav>

      {schedulesToDisplay.length === 0 && onAddSchedule && ( 
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>この旅程にはまだスケジュールがありません。</p>
          <button 
            onClick={() => onAddSchedule(trip.id)} 
            style={{padding: '10px 15px', fontSize: '1em'}}
          >
            最初のスケジュールを追加する
          </button>
        </div>
      )}

      {currentSchedule && <DailySchedule 
        schedule={currentSchedule} 
        trip={trip}
        onSelectTravelSegment={(originEvent, travelEvent, destinationEvent) => {
          const origin = originEvent && originEvent.type !== 'travel' 
            ? { name: originEvent.name, ...(originEvent.details || {}) } 
            : (currentSchedule.hotel_info || { name: trip.name + 'の出発地（仮）' }); 
          const destination = destinationEvent && destinationEvent.type !== 'travel'
            ? { name: destinationEvent.name, ...(destinationEvent.details || {}) }
            : { name: trip.name + 'の次の目的地（仮）' };
          onShowRouteOptions(origin, destination);
        }}
        onShowMemoryForm={onShowMemoryForm} // onAddMemoryForEvent から変更
        onShowHotelRecommendations={onShowHotelRecommendations}
        onAddEventToDay={onAddEventToDay} 
        onRequestAI={onRequestAI}
        onSetHotelForDay={onSetHotelForDay}
        currentDate={selectedDate}
        onShowHotelDetailModal={onShowHotelDetailModal}
        onEditEvent={(scheduleId, event) => onEditEvent(trip.id, scheduleId, event)}
        onDeleteEvent={(scheduleId, eventId) => onDeleteEvent(trip.id, scheduleId, eventId)}
      />}
      
      {schedulesToDisplay.length > 0 && onAddSchedule && (
         <div style={{ textAlign: 'center', padding: '10px 0'}}>
            <button onClick={() => onAddSchedule(trip.id)} style={{padding: '8px 12px'}}>別の日程を追加</button>
         </div>
      )}


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
