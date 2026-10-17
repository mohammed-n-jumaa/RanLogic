import { createContext, useContext } from 'react';

export const ProfileFeedbackContext = createContext({
  toast: () => {},
  celebrate: () => {},
});

/**
 * toast(message, type?)  — type: 'success' (default) | 'error' | 'info'
 * celebrate(message)     — fireworks + a success toast, for completed goals
 */
export const useProfileFeedback = () => useContext(ProfileFeedbackContext);
