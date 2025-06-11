import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useEvents = (currentUser, setCurrentScreen, setTripsGlobally, setSelectedTripGlobally) => {
  const [editingEventDetails, setEditingEventDetails] = useState(null);

  const handleShowEventForm = (tripId, date, scheduleId, eventToEdit = null) => {
    setEditingEventDetails({ tripId, date, scheduleId, event: eventToEdit });
    if (setCurrentScreen) setCurrentScreen('eventForm');
  };

  const handleSaveEvent = async (tripId, scheduleId, eventData, eventId = null) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    try {
      let response;
      if (eventId) {
        response = await axios.put(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}/events/${eventId}`, eventData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      } else {
        response = await axios.post(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}/events`, eventData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      }
      
      // After saving, update the global trips list and the selected trip
      if (response?.data) { // Assuming the response for event save might be the updated event or schedule
        // It's often better to refetch the whole trip to ensure all data is consistent
        const updatedTripResponse = await axios.get(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` }});
        if (updatedTripResponse.data) {
          if (setSelectedTripGlobally) setSelectedTripGlobally(updatedTripResponse.data);
          if (setTripsGlobally) {
             const freshTripsResponse = await axios.get(`${BACKEND_URL}/api/trips`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
             setTripsGlobally(freshTripsResponse.data || []);
          }
        }
      }
      
      if (setCurrentScreen) setCurrentScreen('tripDetail');
      setEditingEventDetails(null);
      alert(eventId ? '予定を更新しました。' : '新しい予定を作成しました。');
    } catch (error) {
      alert(`予定の保存に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteEvent = async (tripId, scheduleId, eventId) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    if (window.confirm('本当にこの予定を削除しますか？')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/trips/${tripId}/schedules/${scheduleId}/events/${eventId}`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        
        // Refetch the trip data to reflect the deletion
        const updatedTripResponse = await axios.get(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` }});
        if (updatedTripResponse.data) {
          if (setSelectedTripGlobally) setSelectedTripGlobally(updatedTripResponse.data);
           if (setTripsGlobally) {
             const freshTripsResponse = await axios.get(`${BACKEND_URL}/api/trips`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
             setTripsGlobally(freshTripsResponse.data || []);
          }
        }
        alert('予定を削除しました。');
        // No need to change screen, TripDetailScreen should re-render with updated selectedTrip
      } catch (error) {
        alert(`予定の削除に失敗しました: ${error.response?.data?.error || error.message}`);
      }
    }
  };
  
  const fetchEventsByScheduleId = async (scheduleId) => {
    // This function might be better placed if it directly sets some state,
    // or it could be a utility function if it just returns data.
    // For now, keeping it as an alert.
    alert('個別イベント取得機能は現在開発中です。');
    // if (!currentUser || !currentUser.token) return [];
    // try {
    //   const response = await axios.get(`${BACKEND_URL}/api/schedules/${scheduleId}/events`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
    //   return response.data || [];
    // } catch (error) {
    //   console.error(`Failed to fetch events for schedule ${scheduleId}:`, error);
    //   return [];
    // }
  };


  return {
    editingEventDetails,
    setEditingEventDetails,
    handleShowEventForm,
    handleSaveEvent,
    handleDeleteEvent,
    fetchEventsByScheduleId,
  };
};
