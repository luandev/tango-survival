import React, { useState, useCallback, Fragment } from 'react';

const withPersistentStorage = (WrappedComponent, localStorageKey) => {
  return (props) => {
    // Initialize visibility state based on localStorage
    const [isVisible, setIsVisible] = useState(() => {
      try {
        return localStorage.getItem(localStorageKey) !== 'true';
      } catch (error) {
        console.error(`Error accessing localStorage: ${error}`);
        return true;
      }
    });

    // Toggle visibility and update localStorage accordingly
    const togglePersistentStorage = useCallback(() => {
      updateVisibility(!isVisible);
    }, [isVisible]);

    // Update visibility and localStorage
    const updateVisibility = useCallback((shouldShow) => {
      try {
        localStorage.setItem(localStorageKey, shouldShow ? 'false' : 'true');
        setIsVisible(shouldShow);
      } catch (error) {
        console.error(`Error updating localStorage: ${error}`);
      }
    }, []);

    return isVisible ? <WrappedComponent {...props} onPersistentStorage={togglePersistentStorage} /> : null;
  };
};

export default withPersistentStorage;
