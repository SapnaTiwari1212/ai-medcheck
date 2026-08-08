const TOKEN_KEY = 'medcheck_token'

function authHeaders() {
  let token = null
  try {
    token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  } catch {
    /* storage unavailable */
  }
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiPost(path, body) {
  let res
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      credentials: 'include',
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Could not reach the server. Please check your connection and try again.')
  }

  let payload = null
  try {
    payload = await res.json()
  } catch {
    /* non-JSON response body */
  }

  if (!res.ok) {
    const message = Array.isArray(payload?.message)
      ? payload.message.join(' ')
      : payload?.message || 'Something went wrong. Please try again.'
    throw new Error(message)
  }

  return payload?.data
}

export async function apiGet(path) {
  let res
  try {
    res = await fetch(path, {
      method: 'GET',
      credentials: 'include',
      headers: authHeaders(),
    })
  } catch {
    throw new Error('Could not reach the server.')
  }

  if (!res.ok) throw new Error('Not authenticated')

  let payload = null
  try {
    payload = await res.json()
  } catch {
    /* non-JSON */
  }

  return payload?.data
}
