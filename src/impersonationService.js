const API_URL = `${import.meta.env.VITE_API_BASE}`;

class ImpersonationService {
  // Start impersonating a user
  async impersonateUser(userId) {
    console.log('Starting impersonation for user:', userId); // Debug log
    
    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token ? 'exists' : 'missing'); // Debug log
      
      const response = await fetch(`${API_URL}/admin/impersonate/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to impersonate user: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Impersonation response:', data); // Debug log
      
      // Store original token before impersonation
      const originalToken = localStorage.getItem('token');
      localStorage.setItem('originalToken', originalToken);
      
      // Set impersonation token
      localStorage.setItem('token', data.token);
      localStorage.setItem('impersonating', 'true');
      localStorage.setItem('impersonatedUser', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Impersonation failed:', error);
      throw error;
    }
  }

  // Stop impersonation and return to admin
  async stopImpersonation() {
    try {
      // Call backend to log the stop (optional)
      await fetch(`${API_URL}/admin/stop-impersonate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error stopping impersonation:', error);
    } finally {
      // Restore original token
      const originalToken = localStorage.getItem('originalToken');
      if (originalToken) {
        localStorage.setItem('token', originalToken);
      }
      
      // Clear impersonation state
      localStorage.removeItem('originalToken');
      localStorage.removeItem('impersonating');
      localStorage.removeItem('impersonatedUser');
      
      // Reload to refresh the app state
      window.location.href = '/admin';
    }
  }

  // Check if currently impersonating
  isImpersonating() {
    return localStorage.getItem('impersonating') === 'true';
  }

  // Get impersonated user info
  getImpersonatedUser() {
    const userStr = localStorage.getItem('impersonatedUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new ImpersonationService();
