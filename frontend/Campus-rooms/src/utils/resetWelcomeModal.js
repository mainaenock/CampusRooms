// Utility function to reset the welcome modal flag
// This can be called from the browser console for testing
export const resetWelcomeModal = () => {
  localStorage.removeItem('hasSeenStudentWelcome');
  console.log('Welcome modal flag reset. Students will see the welcome modal on next login.');
};

// Also expose it globally for easy testing
if (typeof window !== 'undefined') {
  window.resetWelcomeModal = resetWelcomeModal;
} 