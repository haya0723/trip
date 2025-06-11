import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useHotels = (currentUser, trips, setTripsGlobally, setSelectedTripGlobally) => {
  const [editingHotelDetails, setEditingHotelDetails] = useState(null); // { tripId, date, hotelData }

  const handleShowHotelDetailModal = (tripId, date, hotelData = null) => {
    setEditingHotelDetails({ tripId, date, hotelData: hotelData || {} });
    // This hook doesn't manage setCurrentScreen, App.jsx or useNavigation does.
    // If opening a modal doesn't change the main screen, no setCurrentScreen call is needed here.
  };

  const handleSaveHotelDetails = async (tripId, date, newHotelData) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    try {
      // Find the specific schedule to update its hotel_info
      // This requires trips data to be available or fetched.
      const trip = trips.find(t => t.id === tripId);
      if (!trip) {
        alert('対象の旅程が見つかりません。');
        return;
      }
      const schedule = trip.schedules.find(s => s.date === date);
      if (!schedule) {
        alert('対象のスケジュール日が見つかりません。');
        // Potentially create a new schedule for this date if that's desired behavior
        // For now, assume schedule for the date must exist.
        return;
      }

      // API call to update hotel_info for a specific schedule
      // The backend should handle updating the hotel_info field of the schedules table row
      await axios.put(
        `${BACKEND_URL}/api/trips/${tripId}/schedules/${schedule.id}`, 
        { hotel_info: newHotelData }, 
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      
      // Refetch the updated trip data to reflect changes
      const updatedTripResponse = await axios.get(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` }});
      const updatedTripData = updatedTripResponse.data;

      if (updatedTripData) {
        if (setSelectedTripGlobally) setSelectedTripGlobally(updatedTripData);
        if (setTripsGlobally) {
            // Update the trips list in App.jsx
            const freshTripsResponse = await axios.get(`${BACKEND_URL}/api/trips`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
            setTripsGlobally(freshTripsResponse.data || []);
        }
      }
      
      setEditingHotelDetails(null); // Close the modal
      alert('ホテル情報を保存しました。');
    } catch (error) {
      alert(`ホテル情報の保存に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCancelHotelDetailModal = () => {
    setEditingHotelDetails(null);
  };

  // This function is typically called from TripDetailScreen to initiate setting/editing hotel for a day
  const handleSetHotelForDay = (tripId, date) => {
    // Find existing hotel data for this day if available, otherwise pass null
    const trip = trips.find(t => t.id === tripId);
    const schedule = trip?.schedules.find(s => s.date === date);
    const existingHotelData = schedule?.hotel_info;
    handleShowHotelDetailModal(tripId, date, existingHotelData);
  };

  return {
    editingHotelDetails,
    setEditingHotelDetails, // If needed externally
    handleShowHotelDetailModal,
    handleSaveHotelDetails,
    handleCancelHotelDetailModal,
    handleSetHotelForDay,
  };
};
