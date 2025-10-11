import { fetchUtils } from 'react-admin';
import impersonationService from './impersonationService';

const apiUrl = `${import.meta.env.VITE_API_BASE}`;

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  
  // Always use current token (whether admin or impersonated)
  const token = localStorage.getItem('token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetchUtils.fetchJson(url, options);
};

// Helper function to determine if we're in admin context
const isAdminContext = () => {
  return window.location.pathname.startsWith('/admin') && !impersonationService.isImpersonating();
};

const dataProvider = {
  getList: async (resource, params) => {
    let url = '';
    
    switch(resource) {
      case 'friends':
        // Admin context: use admin endpoint to see all friends
        // User context or impersonating: use user endpoint to see user's own friends
        url = isAdminContext() ? 
              `${apiUrl}/admin/friends` : 
              `${apiUrl}/friends`;
        break;
      case 'users':
        // Only available in admin context
        url = `${apiUrl}/admin/users`;
        break;
      case 'transactions':
        // Always user-specific
        url = `${apiUrl}/transactions`;
        break;
      default:
        // Default routing
        url = isAdminContext() ? 
              `${apiUrl}/admin/${resource}` : 
              `${apiUrl}/${resource}`;
    }

    const { json } = await httpClient(url);
    // Handle both admin (with pagination) and user (simple) responses
    let data = json;
    // If admin context and we have pagination support, handle it
    if (isAdminContext() && resource === 'friends') {
      // Client-side sorting for admin
      const { field, order } = params.sort || { field: 'name', order: 'ASC' };
      const sortedData = json.sort((a, b) => {
        if (a[field] > b[field]) return order === 'ASC' ? 1 : -1;
        if (a[field] < b[field]) return order === 'ASC' ? -1 : 1;
        return 0;
      });

      // Client-side pagination for admin
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const start = (page - 1) * perPage;
      const end = start + perPage;
      data = sortedData.slice(start, end);

      return {
        data: data.map(item => ({ ...item, id: item._id })),
        total: json.length, // Total before pagination
      };
    }
    return {
      data: json.map(item_1 => ({ ...item_1, id: item_1._id })),
      total: json.length,
    };
  },

  getOne: async (resource, params) => {
    let url = '';
    
    switch(resource) {
      case 'friends':
        url = isAdminContext() ? 
              `${apiUrl}/admin/friends/${params.id}` : 
              `${apiUrl}/friends/${params.id}`;
        break;
      case 'users':
        url = `${apiUrl}/admin/users/${params.id}`;
        break;
      case 'transactions':
        url = `${apiUrl}/transactions/${params.id}`;
        break;
      default:
        url = isAdminContext() ? 
              `${apiUrl}/admin/${resource}/${params.id}` : 
              `${apiUrl}/${resource}/${params.id}`;
    }

    const { json } = await httpClient(url);
    return ({
      data: { ...json, id: json._id },
    });
  },

  getMany: async (resource, params) => {
    const { ids } = params;
    let url = '';
    
    switch(resource) {
      case 'friends':
        url = isAdminContext() ? 
              `${apiUrl}/admin/friends` : 
              `${apiUrl}/friends`;
        break;
      case 'users':
        url = `${apiUrl}/admin/users`;
        break;
      case 'transactions':
        url = `${apiUrl}/transactions`;
        break;
      default:
        url = isAdminContext() ? 
              `${apiUrl}/admin/${resource}` : 
              `${apiUrl}/${resource}`;
    }

    // Fetch all and filter by IDs (for simplicity)
    const { json } = await httpClient(url);
    const filtered = json.filter(item => ids.includes(item._id));
    return {
      data: filtered.map(item_1 => ({ ...item_1, id: item_1._id })),
    };
  },

  create: async (resource, params) => {
    let url = '';
    
    switch(resource) {
      case 'friends':
        url = isAdminContext() ? 
              `${apiUrl}/admin/friends` : 
              `${apiUrl}/friends`;
        break;
      case 'users':
        url = `${apiUrl}/admin/users`;
        break;
      case 'transactions':
        url = `${apiUrl}/transactions`;
        break;
      default:
        url = isAdminContext() ? 
              `${apiUrl}/admin/${resource}` : 
              `${apiUrl}/${resource}`;
    }

    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return ({
      data: { ...json, id: json._id },
    });
  },

  update: async (resource, params) => {
    let url = '';
    
    switch(resource) {
      case 'friends':
        url = isAdminContext() ? 
              `${apiUrl}/admin/friends/${params.id}` : 
              `${apiUrl}/friends/${params.id}`;
        break;
      case 'users':
        url = `${apiUrl}/admin/users/${params.id}`;
        break;
      case 'transactions':
        url = `${apiUrl}/transactions/${params.id}`;
        break;
      default:
        url = isAdminContext() ? 
              `${apiUrl}/admin/${resource}/${params.id}` : 
              `${apiUrl}/${resource}/${params.id}`;
    }

    const { json } = await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    return ({
      data: { ...json, id: json._id },
    });
  },

  updateMany: async (resource, params) => {
    const { ids, data } = params;
    const responses = await Promise.all(
      ids.map(id => dataProvider.update(resource, { id, data })
      )
    );
    return ({
      data: responses.map(({ data: data_1 }) => data_1.id),
    });
  },

  delete: async (resource, params) => {
    let url = '';
    
    switch(resource) {
      case 'friends':
        url = isAdminContext() ? 
              `${apiUrl}/admin/friends/${params.id}` : 
              `${apiUrl}/friends/${params.id}`;
        break;
      case 'users':
        url = `${apiUrl}/admin/users/${params.id}`;
        break;
      case 'transactions':
        url = `${apiUrl}/transactions/${params.id}`;
        break;
      default:
        url = isAdminContext() ? 
              `${apiUrl}/admin/${resource}/${params.id}` : 
              `${apiUrl}/${resource}/${params.id}`;
    }

    const { json } = await httpClient(url, {
      method: 'DELETE',
    });
    return ({
      data: { ...json, id: json._id },
    });
  },

  deleteMany: async (resource, params) => {
    const { ids } = params;
    const responses = await Promise.all(
      ids.map(id => dataProvider.delete(resource, { id })
      )
    );
    return ({
      data: responses.map(({ data }) => data.id),
    });
  }
};

export default dataProvider;
