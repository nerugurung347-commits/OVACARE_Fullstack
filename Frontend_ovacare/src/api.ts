const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : '';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('ovacare_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signUp(fullName: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Sign up failed');
  }

  return data;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed');
  }

  return data;
}

interface ProfilePayload {
  profile?: { full_name?: string; age?: string; city?: string };
  cycle_data?: { last_period_date?: string; cycle_length?: string; current_phase?: string };
  preferences?: { cuisine?: string; health_goal?: string; movement_type?: string };
}

export async function saveProfile(payload: ProfilePayload) {
  const response = await fetch(`${API_BASE_URL}/profile/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to save profile');
  }

  return data;
}