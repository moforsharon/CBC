import useShouldShowPrompt from './useShouldShowPrompt';

const iosInstallPromptedAt = 'iosInstallPromptedAt';

const isIOS = () => {
  if (navigator.standalone) {
    return false; // User has already installed the app
  }
  const ua = window.navigator.userAgent;
  return !!ua.match(/iPad|iPhone/i);
};

const useIosInstallPrompt = () => {
  const [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt] = useShouldShowPrompt(iosInstallPromptedAt);

  return [isIOS() && userShouldBePromptedToInstall, handleUserSeeingInstallPrompt];
};

export default useIosInstallPrompt;
