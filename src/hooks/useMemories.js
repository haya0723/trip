import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const mapMemoryToFrontend = (memoryFromBackend) => {
  if (!memoryFromBackend) return null;
  const frontendMemory = { ...memoryFromBackend };
  if (frontendMemory.media_urls !== undefined) {
    frontendMemory.mediaUrls = frontendMemory.media_urls;
    delete frontendMemory.media_urls;
  }
  if (frontendMemory.event_id !== undefined) {
    frontendMemory.eventId = frontendMemory.event_id;
    delete frontendMemory.event_id;
  }
  if (frontendMemory.trip_id !== undefined) {
    frontendMemory.tripId = frontendMemory.trip_id;
    delete frontendMemory.trip_id;
  }
  return frontendMemory;
};

const mapMemoryToBackend = (memoryFromFrontend) => {
  const memoryForBackend = { ...memoryFromFrontend };
  if (memoryForBackend.mediaUrls !== undefined) {
    memoryForBackend.media_urls = memoryForBackend.mediaUrls;
    delete memoryForBackend.mediaUrls;
  }
  if (memoryForBackend.eventId !== undefined) {
    memoryForBackend.event_id = memoryForBackend.eventId;
    delete memoryForBackend.eventId;
  }
  if (memoryForBackend.tripId !== undefined) {
    memoryForBackend.trip_id = memoryForBackend.tripId;
    delete memoryForBackend.tripId;
  }
  return memoryForBackend;
};


export const useMemories = (currentUser, setCurrentScreen, selectedTrip, setSelectedTripGlobally, trips) => {
  const [editingMemoryForEvent, setEditingMemoryForEvent] = useState(null); 
  const [viewingMemoriesForTripId, setViewingMemoriesForTripId] = useState(null);
  const [tripMemories, setTripMemories] = useState([]); 

  const uploadMediaFile = async (file) => {
    if (!currentUser || !currentUser.token) { 
      throw new Error('Not authenticated for media upload.'); 
    }
    const formData = new FormData(); 
    formData.append('mediaFile', file);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/upload/media`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${currentUser.token}` } });
      return response.data.fileUrl;
    } catch (error) { 
      console.error('Failed to upload media file:', error.response?.data || error.message, error); 
      throw error; 
    }
  };

  const handleShowMemoryForm = (tripId, eventId, eventName, date, existingMemory = null) => { 
    const mappedExistingMemory = existingMemory ? mapMemoryToFrontend(existingMemory) : null;
    setEditingMemoryForEvent({ tripId, eventId, eventName, date, existingMemory: mappedExistingMemory }); 
    if (setCurrentScreen) setCurrentScreen('memoryForm'); 
  };
  
  const handleSaveMemory = async (memoryDataFromForm, filesToUpload = []) => { 
    if (!currentUser || !currentUser.token) { alert('ログインしていません。'); return; }
    try {
      let uploadedMediaUrls = [];
      if (filesToUpload && filesToUpload.length > 0) { 
        uploadedMediaUrls = await Promise.all(filesToUpload.map(file => uploadMediaFile(file))); 
      }
      
      let memoryWithFrontendKeys = { 
        ...memoryDataFromForm, 
        mediaUrls: [...(memoryDataFromForm.mediaUrls || []), ...uploadedMediaUrls],
      };

      const currentEventId = memoryDataFromForm.eventId || editingMemoryForEvent?.eventId;
      const currentTripId = memoryDataFromForm.tripId || editingMemoryForEvent?.tripId;

      if (currentEventId) {
        memoryWithFrontendKeys.eventId = currentEventId;
        memoryWithFrontendKeys.tripId = null; 
      } else if (currentTripId) {
        memoryWithFrontendKeys.tripId = currentTripId;
        memoryWithFrontendKeys.eventId = null;
      } else {
        alert('思い出を紐付ける旅行またはイベントが指定されていません。');
        return;
      }
      
      const finalMemoryDataForBackend = mapMemoryToBackend(memoryWithFrontendKeys);

      let savedOrUpdatedMemory;
      if (finalMemoryDataForBackend.id) { 
        const response = await axios.put(`${BACKEND_URL}/api/memories/${finalMemoryDataForBackend.id}`, finalMemoryDataForBackend, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedOrUpdatedMemory = response.data; 
        alert('思い出を更新しました。');
      } else { 
        const response = await axios.post(`${BACKEND_URL}/api/memories`, finalMemoryDataForBackend, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        savedOrUpdatedMemory = response.data; 
        alert('思い出を保存しました。');
      }
      
      const targetTripIdForView = currentTripId || savedOrUpdatedMemory?.trip_id || selectedTrip?.id;

      if (targetTripIdForView) { 
        await fetchMemoriesForTrip(targetTripIdForView); 
        setViewingMemoriesForTripId(targetTripIdForView);
        if (setSelectedTripGlobally) {
            const currentTripData = trips.find(t => t.id === targetTripIdForView);
            if (currentTripData) {
                setSelectedTripGlobally(currentTripData);
            } else {
                try {
                    const tripResponse = await axios.get(`${BACKEND_URL}/api/trips/${targetTripIdForView}`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
                    setSelectedTripGlobally(tripResponse.data);
                } catch (tripError) {
                    console.error(`Failed to fetch trip ${targetTripIdForView} for setSelectedTrip.`, tripError);
                }
            }
        }
      }
      
      if (setCurrentScreen) setCurrentScreen('memoryView'); 
      setEditingMemoryForEvent(null);
    } catch (error) { 
      console.error('Failed to save memory:', error.response?.data || error.message, error); 
      alert(`思い出の保存に失敗しました: ${error.response?.data?.error || error.message}`); 
    }
  };

  const fetchMemoriesForTrip = async (tripId) => {
    if (!currentUser || !currentUser.token || !tripId) {
      setTripMemories([]); 
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trips/${tripId}/memories`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
      setTripMemories((response.data || []).map(mapMemoryToFrontend));
    } catch (error) { 
      console.error(`Failed to fetch memories for trip ${tripId}:`, error.response?.data || error.message); 
      setTripMemories([]); 
    }
  };

  const handleShowMemoryView = (tripId) => { 
    setViewingMemoriesForTripId(tripId); 
    if (setSelectedTripGlobally) {
        const tripData = trips.find(t => t.id === tripId);
        if (tripData) { 
            setSelectedTripGlobally(tripData); 
        } else {
            axios.get(`${BACKEND_URL}/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${currentUser.token}` } })
                .then(response => setSelectedTripGlobally(response.data))
                .catch(err => console.error(`Failed to fetch trip ${tripId} for memory view`, err));
        }
    }
    fetchMemoriesForTrip(tripId); 
    if (setCurrentScreen) setCurrentScreen('memoryView'); 
  };

  const handleDeleteMemory = async (memoryId) => {
    if (!currentUser || !currentUser.token || !memoryId) { 
      alert('削除する思い出が指定されていないか、ログインしていません。'); 
      return; 
    }
    if (window.confirm('本当にこの思い出を削除しますか？')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/memories/${memoryId}`, { headers: { Authorization: `Bearer ${currentUser.token}` } });
        alert('思い出を削除しました。');
        setTripMemories(prevMemories => prevMemories.filter(mem => mem.id !== memoryId));
        if (viewingMemoriesForTripId) { 
          await fetchMemoriesForTrip(viewingMemoriesForTripId); 
        }
      } catch (error) { 
        console.error('Failed to delete memory:', error.response?.data || error.message); 
        alert(`思い出の削除に失敗しました: ${error.response?.data?.error || error.message}`); 
      }
    }
  };

  return {
    editingMemoryForEvent,
    setEditingMemoryForEvent,
    viewingMemoriesForTripId,
    setViewingMemoriesForTripId,
    tripMemories,
    setTripMemories,
    uploadMediaFile,
    handleShowMemoryForm,
    handleSaveMemory,
    fetchMemoriesForTrip,
    handleShowMemoryView,
    handleDeleteMemory,
    handleCancelMemoryForm, // 追加
  };

  function handleCancelMemoryForm() {
    const returnToTripId = editingMemoryForEvent?.tripId;
    const cameFromEvent = !!editingMemoryForEvent?.eventId;

    setEditingMemoryForEvent(null); // フォームの編集状態をクリア

    if (returnToTripId) {
      // イベントの思い出編集から、または旅行全体の思い出編集からキャンセルした場合
      // memoryView に戻るのが自然
      handleShowMemoryView(returnToTripId); // これにより viewingMemoriesForTripId と selectedTrip が設定される
    } else if (selectedTrip) {
      // 何らかの理由で tripId が取れないが、selectedTrip がある場合 (通常はあまりないケース)
      if (setCurrentScreen) setCurrentScreen('tripDetail');
    } else {
      if (setCurrentScreen) setCurrentScreen('tripList');
    }
  }
};
