export const state = () => ({
  currentLocation: {
    coordinates: {
      lat: 0,
      lon: 0
    },
    timezone: 'UTC'
  }
})

export const getters = {
  getCurrentLocationInfo: (state) => {
    return state.currentLocation
  }
}

export const mutations = {
  SET_CURRENT_LOCATION_INFO (state, locationInfo) {
    if (!locationInfo) {
      return
    }
    state.currentLocation = locationInfo
  }
}

export const actions = {
  SWITCH_LOCATION (store, locationInfo) {
    store.commit('SET_CURRENT_LOCATION_INFO', locationInfo)
  }
}
