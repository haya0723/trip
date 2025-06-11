import { useState, useEffect } from 'react';

export const useNavigation = (currentUser) => {
  const [currentScreen, setCurrentScreen] = useState('login');
  console.log(`[useNavigation] Hook initialized. Initial currentScreen: ${currentScreen}, currentUser:`, currentUser);

  useEffect(() => {
    console.log(`[useNavigation] useEffect triggered. currentUser:`, currentUser, `currentScreen: ${currentScreen}`);
    if (!currentUser && !['login', 'signup', 'passwordReset'].includes(currentScreen)) {
      console.log(`[useNavigation] Not authenticated and not on public screen. Navigating to login.`);
      setCurrentScreen('login');
    } else if (currentUser && (currentScreen === 'login' || currentScreen === 'signup')) {
      console.log(`[useNavigation] Authenticated and on login/signup screen. Navigating to tripList.`);
      setCurrentScreen('tripList');
    } else {
      console.log(`[useNavigation] No navigation change needed.`);
    }
  }, [currentUser, currentScreen]);

  const customSetCurrentScreen = (newScreen) => {
    console.log(`[useNavigation] customSetCurrentScreen called with: ${newScreen}. Current screen is: ${currentScreen}`);
    if (newScreen !== currentScreen) {
        setCurrentScreen(newScreen);
    } else {
        console.log(`[useNavigation] customSetCurrentScreen: ${newScreen} is already the current screen. No change.`);
    }
  };

  return {
    currentScreen,
    setCurrentScreen: customSetCurrentScreen, // Use the wrapped version
  };
};
