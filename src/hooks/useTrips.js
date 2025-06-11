import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useTrips = (currentUser, setCurrentScreen) => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);

  const fetchMyTrips = async (token) => {
    if (!token) {
      setTrips([]);
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trips`, { headers: { Authorization: `Bearer ${token}` } });
      setTrips(response.data || []);
    } catch (error) {
      console.error('Failed to fetch trips:', error.response?.data || error.message);
      setTrips([]);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.token) {
      fetchMyTrips(currentUser.token);
    } else {
      setTrips([]);
      setSelectedTrip(null);
      setEditingPlan(null);
    }
  }, [currentUser]);

  const handleShowPlanForm = (planToEdit = null) => {
    setEditingPlan(planToEdit);
    setSelectedTrip(null); // Clear selected trip when showing plan form
    if (setCurrentScreen) setCurrentScreen('planForm');
  };

  const handleShowTripDetail = (trip) => {
    setSelectedTrip(trip);
    if (setCurrentScreen) setCurrentScreen('tripDetail');
  };

  const handleSavePlan = async (planData) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    try {
      let savedTrip;
      if (editingPlan && editingPlan.id) {
        const response = await axios.put(`${BACKEND_URL}/api/trips/${editingPlan.id}`, planData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedTrip = response.data;
      } else {
        const response = await axios.post(`${BACKEND_URL}/api/trips`, planData, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedTrip = response.data;
      }
      await fetchMyTrips(currentUser.token); // Refresh trips list
      setSelectedTrip(savedTrip); // Set the newly saved/updated trip as selected
      if (setCurrentScreen) setCurrentScreen('tripDetail');
      setEditingPlan(null);
      alert(editingPlan && editingPlan.id ? '旅程を更新しました。' : '新しい旅程を作成しました。');
    } catch (error) {
      alert(`旅程の保存に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    if (window.confirm('本当にこの旅程を削除しますか？')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        await fetchMyTrips(currentUser.token); // Refresh trips list
        if (setCurrentScreen) setCurrentScreen('tripList');
        setSelectedTrip(null); // Clear selected trip
        alert('旅程を削除しました。');
      } catch (error) {
        alert(`旅程の削除に失敗しました: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const handleCancelPlanForm = () => {
    if (setCurrentScreen) setCurrentScreen('tripList');
    setEditingPlan(null);
  };
  
  const handleBackToList = () => {
    if (setCurrentScreen) setCurrentScreen('tripList');
    setSelectedTrip(null);
    setEditingPlan(null);
  };


  return {
    trips,
    setTrips, // If other hooks need to modify trips directly (e.g., after schedule/event save)
    selectedTrip,
    setSelectedTrip,
    editingPlan,
    setEditingPlan,
    fetchMyTrips,
    handleShowPlanForm,
    handleShowTripDetail,
    handleSavePlan,
    handleDeleteTrip,
    handleCancelPlanForm,
    handleBackToList, // Added for TripDetailScreen
  };
};
