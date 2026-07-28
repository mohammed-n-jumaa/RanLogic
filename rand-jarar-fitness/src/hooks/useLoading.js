import { useState, useEffect } from 'react';

/**
 * Custom hook for managing loading states
 * @param {number} minLoadingTime - Minimum time to show loader (in ms)
 * @returns {[boolean, function]} - [isLoading, setIsLoading]
 */
const useLoading = (minLoadingTime = 1500) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  return [isLoading, setIsLoading];
};

export default useLoading;