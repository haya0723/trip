import React, { useState, useEffect } from 'react';

function ScheduleFormScreen({ tripId, existingSchedule, onSave, onCancel }) {
  const [date, setDate] = useState('');
  const [dayDescription, setDayDescription] = useState('');
  // ホテル情報用のステートも後で追加

  useEffect(() => {
    if (existingSchedule) {
      setDate(existingSchedule.date || '');
      setDayDescription(existingSchedule.day_description || '');
      // TODO: ホテル情報もセット
    } else {
      // 新規作成時はtripIdに基づいてデフォルトの日付を設定するなどしても良い
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [existingSchedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {
      date,
      day_description: dayDescription,
      // TODO: hotel_info オブジェクトを構築
    };
    onSave(tripId, scheduleData, existingSchedule ? existingSchedule.id : null);
  };

  return (
    <div className="schedule-form-screen" style={{ padding: '20px' }}>
      <h2>{existingSchedule ? 'スケジュール編集' : '新しいスケジュール日を追加'}</h2>
      <p>対象の旅程ID: {tripId}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="schedule-date">日付:</label>
          <input
            type="date"
            id="schedule-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="schedule-description">その日の概要:</label>
          <textarea
            id="schedule-description"
            value={dayDescription}
            onChange={(e) => setDayDescription(e.target.value)}
            placeholder="例: 午前は市内観光、午後は美術館巡り"
            rows="3"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        {/* TODO: ホテル情報入力フォーム */}
        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={{ marginRight: '10px' }}>保存</button>
          <button type="button" onClick={onCancel}>キャンセル</button>
        </div>
      </form>
    </div>
  );
}

export default ScheduleFormScreen;
