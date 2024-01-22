const checkResponse = (response) => {
  if (response.status === 500) {
    throw new Error('Server error')
  }
  return response.json();
}

const login = (user) => fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(user)
}).then(checkResponse).catch(err => console.log(err))

const logout = () => fetch('/api/users/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}).then(checkResponse).catch(err => console.log(err))

const signup = (user) => fetch('/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(user)
}).then(checkResponse).catch(err => console.log(err))

const checkAuth = () => fetch('/api/users/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}).then(checkResponse).catch(err => console.log(err))

const profile = () => fetch('/api/users/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}).then(checkResponse).catch(err => console.log(err))

const user = (id) => {
  const fetchUrl = id ? `/api/users?id=${id}` : `/api/users`;
  return fetch(fetchUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(checkResponse).catch(err => console.log(err))
}

const alumniPrefill = () => fetch('/api/alumni/membership-prefill', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
}).then(checkResponse).catch(err => console.log(err))

export {
  login as loginApi,
  logout as logoutApi,
  checkAuth as checkAuthApi,
  profile as profileApi,
  signup as signupApi,
  user as userApi,
  alumniPrefill as alumniPrefillApi,
};