import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';

/**
 * Overrides the hero's main button for signed-in visitors:
 *  - subscribed   → "Go to my profile" → /profile
 *  - not subscribed → keeps its label, but goes to /plans (instead of the login form)
 * Returns null for guests, so the button keeps its normal behaviour.
 */
const useHeroPrimaryCta = (isArabic) => {
  const navigate = useNavigate();
  if (!authApi.isAuthenticated()) return null;

  const user = authApi.getUser();
  if (user?.has_active_subscription) {
    return {
      label: isArabic ? 'اذهب للملف الشخصي' : 'Go to my profile',
      onClick: () => navigate('/profile'),
    };
  }
  return { label: null, onClick: () => navigate('/plans') };
};

export default useHeroPrimaryCta;
