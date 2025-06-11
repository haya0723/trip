import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useFavorites = (currentUser, userProfile, fetchUserProfileExt, setCurrentScreenExt) => {
  // Favorite places are part of userProfile, so this hook primarily manages actions related to them.

  const handleShowFavoritePlaces = () => {
    if (setCurrentScreenExt) setCurrentScreenExt('favoritePlacesList');
  };

  const handleAddFavoritePlace = async (place) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    if (!place || !place.id) { // Assuming place object has an id from Google Places or similar
        alert('お気に入りに追加する場所が無効です。');
        return;
    }
    try {
      // Backend should handle preventing duplicates if necessary
      await axios.post(`${BACKEND_URL}/api/users/favorites`, 
        { place_id: place.id, name: place.name, address: place.address, category: place.category, latitude: place.latitude, longitude: place.longitude }, // Send necessary place details
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      alert(`${place.name} をお気に入りに追加しました。`);
      if (fetchUserProfileExt) fetchUserProfileExt(currentUser.id, currentUser.token); // Refresh profile to update favorites list
    } catch (error) {
      alert(`お気に入りへの追加に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleRemoveFavoritePlace = async (placeId) => {
    if (!currentUser || !currentUser.token) {
      alert('ログインしていません。');
      return;
    }
    if (!placeId) {
        alert('削除するお気に入りの場所が無効です。');
        return;
    }
    if (window.confirm('この場所をお気に入りから削除しますか？')) {
        try {
          await axios.delete(`${BACKEND_URL}/api/users/favorites/${placeId}`, { 
            headers: { Authorization: `Bearer ${currentUser.token}` } 
          });
          alert('お気に入りから削除しました。');
          if (fetchUserProfileExt) fetchUserProfileExt(currentUser.id, currentUser.token); // Refresh profile
        } catch (error) {
          alert(`お気に入りの削除に失敗しました: ${error.response?.data?.error || error.message}`);
        }
    }
  };
  
  // For FavoritePicker component, if used
  const [favoritePickerContext, setFavoritePickerContext] = useState(null);
  const handleShowFavoritePickerForEvent = (callback) => { 
    setFavoritePickerContext({ callback, returnScreen: 'eventForm' }); // Assuming it's for eventForm
    if (setCurrentScreenExt) setCurrentScreenExt('favoritePicker');
  };


  return {
    // favoritePlaces are part of userProfile, so they are accessed via userProfile.favoritePlaces
    handleShowFavoritePlaces,
    handleAddFavoritePlace,
    handleRemoveFavoritePlace,
    favoritePickerContext, // If FavoritePicker is used
    setFavoritePickerContext, // If FavoritePicker is used
    handleShowFavoritePickerForEvent, // If FavoritePicker is used
  };
};
