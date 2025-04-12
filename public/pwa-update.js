// PWA Update Handler
// This script handles update notifications from the service worker

let refreshing = false;

// Listen for messages from the service worker
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
    console.log('New version available:', event.data.newVersion);
    
    // Show update notification to the user
    showUpdateNotification();
  }
});

// Function to show update notification UI
function showUpdateNotification() {
  // Create notification element if it doesn't exist
  if (!document.getElementById('pwa-update-toast')) {
    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    toast.style.zIndex = '10000';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.justifyContent = 'space-between';
    toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    toast.style.fontSize = '14px';
    toast.style.backdropFilter = 'blur(8px)';
    toast.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    toast.style.maxWidth = '90%';
    toast.style.width = '400px';
    
    const message = document.createElement('div');
    message.textContent = 'New version available!';
    message.style.marginRight = '16px';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Now';
    updateButton.style.backgroundColor = '#4F46E5';
    updateButton.style.color = 'white';
    updateButton.style.border = 'none';
    updateButton.style.padding = '8px 12px';
    updateButton.style.borderRadius = '6px';
    updateButton.style.cursor = 'pointer';
    updateButton.style.fontWeight = '500';
    updateButton.style.transition = 'background-color 0.2s';
    updateButton.style.fontSize = '14px';
    
    updateButton.addEventListener('mouseover', () => {
      updateButton.style.backgroundColor = '#4338CA';
    });
    
    updateButton.addEventListener('mouseout', () => {
      updateButton.style.backgroundColor = '#4F46E5';
    });
    
    updateButton.addEventListener('click', () => {
      // Reload the page to get the new version
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
    
    const dismissButton = document.createElement('button');
    dismissButton.textContent = 'Later';
    dismissButton.style.backgroundColor = 'transparent';
    dismissButton.style.color = '#A1A1AA';
    dismissButton.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    dismissButton.style.padding = '8px 12px';
    dismissButton.style.borderRadius = '6px';
    dismissButton.style.cursor = 'pointer';
    dismissButton.style.fontWeight = '500';
    dismissButton.style.transition = 'background-color 0.2s';
    dismissButton.style.fontSize = '14px';
    
    dismissButton.addEventListener('mouseover', () => {
      dismissButton.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    });
    
    dismissButton.addEventListener('mouseout', () => {
      dismissButton.style.backgroundColor = 'transparent';
    });
    
    dismissButton.addEventListener('click', () => {
      document.body.removeChild(toast);
    });
    
    buttonContainer.appendChild(updateButton);
    buttonContainer.appendChild(dismissButton);
    
    toast.appendChild(message);
    toast.appendChild(buttonContainer);
    
    document.body.appendChild(toast);
  }
}

// Check if the page is controlled by a service worker
if ('serviceWorker' in navigator) {
  // When the page loads, check if there's a new service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.ready.then(registration => {
      // Check for updates every 60 minutes
      setInterval(() => {
        registration.update();
        console.log('Checking for service worker updates...');
      }, 60 * 60 * 1000);
      
      // Handle controller change (when a new service worker takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  });
}
