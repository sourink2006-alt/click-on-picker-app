export const permissionService = {
  async queryPermission(type) {
    if (type === 'notifications') {
      // Check notification permission support
      if (!('Notification' in window)) {
        return 'denied';
      }
      const status = Notification.permission;
      if (status === 'granted') return 'granted';
      if (status === 'denied') return 'permanently_denied';
      return 'denied'; // prompt
    }
    
    if (type === 'camera') {
      try {
        if (!navigator.permissions || !navigator.permissions.query) {
          return 'denied';
        }
        const result = await navigator.permissions.query({ name: 'camera' });
        if (result.state === 'granted') return 'granted';
        if (result.state === 'denied') return 'permanently_denied';
        return 'denied';
      } catch (e) {
        return 'denied';
      }
    }
    
    if (type === 'location') {
      try {
        if (!navigator.permissions || !navigator.permissions.query) {
          return 'denied';
        }
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'granted') return 'granted';
        if (result.state === 'denied') return 'permanently_denied';
        return 'denied';
      } catch (e) {
        return 'denied';
      }
    }
    
    return 'denied';
  },

  async requestPermission(type) {
    if (type === 'notifications') {
      if (!('Notification' in window)) {
        return 'denied';
      }
      try {
        const status = await Notification.requestPermission();
        if (status === 'granted') return 'granted';
        if (status === 'denied') return 'permanently_denied';
        return 'denied';
      } catch (e) {
        return 'denied';
      }
    }
    
    if (type === 'camera') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return 'granted';
      } catch (err) {
        console.error('Camera permission request error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          return 'permanently_denied';
        }
        return 'denied';
      }
    }
    
    if (type === 'location') {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve('denied');
          return;
        }
        navigator.geolocation.getCurrentPosition(
          () => {
            resolve('granted');
          },
          (err) => {
            console.error('Location permission request error:', err);
            if (err.code === err.PERMISSION_DENIED) {
              resolve('permanently_denied');
            } else {
              resolve('denied');
            }
          },
          { timeout: 5000 }
        );
      });
    }
    
    return 'denied';
  },

  openSettings() {
    alert(
      "Permission Settings Guide:\n\n" +
      "1. Click the lock/settings icon next to the website URL in your browser's address bar.\n" +
      "2. Toggle Camera, Location, and Notifications settings to 'Allow'.\n" +
      "3. Refresh the page to apply changes."
    );
  }
};
