import api from './index'

export const authApi = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(email, password) {
    const response = await api.post('/auth/register', { email, password })
    return response.data
  },

  async me() {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export const linksApi = {
  async shorten(original, alias = null, expiredAt = null) {
    const body = { original }
    if (alias) body.alias = alias
    if (expiredAt) body.expired_at = expiredAt
    const response = await api.post('/links/shorten', body)
    return response.data
  },

  async getMyLinks() {
    const response = await api.get('/links/my')
    return response.data
  },

  async updateLink(shortCode, data) {
    const response = await api.put(`/links/${shortCode}`, data)
    return response.data
  },

  async deleteLink(shortCode) {
    const response = await api.delete(`/links/${shortCode}`)
    return response.data
  },

  async getLinkStats(shortCode) {
    const response = await api.get(`/links/${shortCode}/stats`)
    return response.data
  },
}
