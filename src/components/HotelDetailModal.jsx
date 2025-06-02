import React, { useState, useEffect } from 'react';

function HotelDetailModal({ hotelData, onSave, onCancel }) {
  const [details, setDetails] = useState({
    name: '',
    address: '',
    checkIn: '',
    checkOut: '',
    reservationNumber: '',
    notes: '',
    // isHotel: true, // これは場所検索時に設定される想定
  });

  useEffect(() => {
    if (hotelData) {
      setDetails({
        name: hotelData.name || '',
        address: hotelData.address || '',
        checkIn: hotelData.checkIn || '',
        checkOut: hotelData.checkOut || '',
        reservationNumber: hotelData.reservationNumber || '',
        notes: hotelData.notes || '',
      });
    }
  }, [hotelData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(details);
  };

  if (!hotelData) return null; // hotelDataがない場合は何も表示しない

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px'}}>
        <h2>ホテル情報編集</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hotelName">ホテル名:</label>
            <input type="text" id="hotelName" name="name" value={details.name} onChange={handleChange} disabled style={{backgroundColor: '#f0f0f0'}} />
          </div>
          <div className="form-group">
            <label htmlFor="hotelAddress">住所:</label>
            <input type="text" id="hotelAddress" name="address" value={details.address} onChange={handleChange} disabled style={{backgroundColor: '#f0f0f0'}} />
          </div>
          <div className="form-group">
            <label htmlFor="checkIn">チェックイン時間:</label>
            <input type="time" id="checkIn" name="checkIn" value={details.checkIn} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="checkOut">チェックアウト時間:</label>
            <input type="time" id="checkOut" name="checkOut" value={details.checkOut} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="reservationNumber">予約番号:</label>
            <input type="text" id="reservationNumber" name="reservationNumber" value={details.reservationNumber} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="hotelNotes">備考:</label>
            <textarea id="hotelNotes" name="notes" value={details.notes} onChange={handleChange} rows="3"></textarea>
          </div>
          <div className="form-actions" style={{marginTop: '20px'}}>
            <button type="submit" className="primary-button">保存</button>
            <button type="button" onClick={onCancel} className="secondary-button" style={{marginLeft: '10px'}}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HotelDetailModal;
