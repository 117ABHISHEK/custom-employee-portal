import Cookies from 'js-cookie';

export const setAuth = (token, user) => {
  Cookies.set('token', token, { expires: 1 }); // 1 day
  Cookies.set('user', JSON.stringify(user), { expires: 1 });
};

export const getUser = () => {
  const user = Cookies.get('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const isAuthenticated = () => {
  return !!Cookies.get('token');
};