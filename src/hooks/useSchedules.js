import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useSchedules = (currentUser, setCurrentScreen, setTripsGlobally, setSelectedTripGlobally) => {
  const [editingScheduleForTripId, setEditingScheduleForTripId] = useState(null);
  const [editingScheduleData, setEditingScheduleData] = useState(null);

  const handleShowScheduleForm = (tripId, scheduleToEdit = null) => {
    setEditingScheduleForTripId(tripId);
    setEditingScheduleData(scheduleToEdit);
    if (setCurrentScreen) setCurrentScreen('scheduleForm');
  };

  const handleSaveSchedule = async (tripId, scheduleData, scheduleId = null) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    try {
      let response;
      if (scheduleId) {
        response = await axios.put(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}`, scheduleData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      } else {
        response = await axios.post(`${BACKEND_URL}/api/trips/${tripId}/schedules`, scheduleData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      }
      
      // After saving, update the global trips list and the selected trip
      if (response?.data) {
        if (setSelectedTripGlobally) setSelectedTripGlobally(response.data); // Update selected trip
        if (setTripsGlobally) { // Update trips list
            const freshTripsResponse = await axios.get(`${BACKEND_URL}/api/trips`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
            setTripsGlobally(freshTripsResponse.data || []);
        }
      }
      
      if (setCurrentScreen) setCurrentScreen('tripDetail');
      setEditingScheduleForTripId(null);
      setEditingScheduleData(null);
      alert(scheduleId ? 'スケジュールを更新しました。' : '新しいスケジュールを作成しました。');
    } catch (error) {
      alert(`スケジュールの保存に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCancelScheduleForm = () => {
    if (setCurrentScreen) setCurrentScreen('tripDetail');
    setEditingScheduleForTripId(null);
    setEditingScheduleData(null);
  };

  return {
    editingScheduleForTripId,
    setEditingScheduleForTripId,
    editingScheduleData,
    setEditingScheduleData,
    handleShowScheduleForm,
    handleSaveSchedule,
    handleCancelScheduleForm,
  };
};
