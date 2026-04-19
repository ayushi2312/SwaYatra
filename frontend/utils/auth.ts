export type UserType = 'indian' | 'foreigner';

export interface User {
  id?: number;
  email: string;
  name?: string;
  fullName?: string;
  phone?: string;
  userType?: UserType;
  token?: string;
  loggedIn: boolean;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const auth = localStorage.getItem('swa-yatra-auth');
  if (!auth) return false;

  try {
    const user: User = JSON.parse(auth);
    return user.loggedIn === true;
  } catch {
    return false;
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;

  const auth = localStorage.getItem('swa-yatra-auth');
  if (!auth) return null;

  try {
    const user: User = JSON.parse(auth);
    return user.loggedIn ? user : null;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('swa-yatra-auth');
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('swa-yatra-auth', JSON.stringify(user));
}
