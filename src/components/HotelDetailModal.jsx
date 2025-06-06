import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
// import './HotelDetailModal.css'; // 必要に応じてCSSファイルを作成

function HotelDetailModal({ hotelData, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [reservationNumber, setReservationNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (hotelData) {
      setName(hotelData.name || '');
      setAddress(hotelData.address || '');
      setCheckInTime(hotelData.checkInTime ? new Date(hotelData.checkInTime) : null);
      setCheckOutTime(hotelData.checkOutTime ? new Date(hotelData.checkOutTime) : null);
      setReservationNumber(hotelData.reservationNumber || '');
      setNotes(hotelData.notes || '');
    } else {
      // 新規作成時のデフォルト値（必要に応じて）
      setName('');
      setAddress('');
      setCheckInTime(null);
      setCheckOutTime(null);
      setReservationNumber('');
      setNotes('');
    }
  }, [hotelData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedHotelData = {
      name,
      address,
      checkInTime: checkInTime ? checkInTime.toISOString() : null,
      checkOutTime: checkOutTime ? checkOutTime.toISOString() : null,
      reservationNumber,
      notes,
    };
    onSave(updatedHotelData);
  };

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-content" style={styles.content}>
        <h2>ホテル情報 {hotelData?.name ? '編集' : '追加'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="hotelName">ホテル名:</label>
            <input type="text" id="hotelName" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="hotelAddress">住所:</label>
            <input type="text" id="hotelAddress" value={address} onChange={(e) => setAddress(e.target.value)} style={styles.input} />
            {/* TODO: 場所検索ボタン */}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="checkInTime">チェックイン日時:</label>
            <DatePicker
              selected={checkInTime}
              onChange={(date) => setCheckInTime(date)}
              showTimeSelect
              dateFormat="yyyy/MM/dd HH:mm"
              placeholderText="チェックイン日時を選択"
              className="date-picker-input" // App.cssなどでスタイル調整
              wrapperClassName="date-picker-wrapper"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="checkOutTime">チェックアウト日時:</label>
            <DatePicker
              selected={checkOutTime}
              onChange={(date) => setCheckOutTime(date)}
              showTimeSelect
              dateFormat="yyyy/MM/dd HH:mm"
              minDate={checkInTime} // チェックアウトはチェックイン以降
              placeholderText="チェックアウト日時を選択"
              className="date-picker-input"
              wrapperClassName="date-picker-wrapper"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="reservationNumber">予約番号:</label>
            <input type="text" id="reservationNumber" value={reservationNumber} onChange={(e) => setReservationNumber(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="hotelNotes">備考:</label>
            <textarea id="hotelNotes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={styles.textarea}></textarea>
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>保存</button>
            <button type="button" onClick={onCancel} style={{ ...styles.button, ...styles.cancelButton }}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: 'calc(100% - 10px)',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    width: 'calc(100% - 10px)',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    minHeight: '60px',
  },
  buttonGroup: {
    marginTop: '20px',
    textAlign: 'right',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white',
  }
};

export default HotelDetailModal;
