export const state = () => ({
  current: null,
  hourly: null,
  daily: null
})

async function getCurrentWeather (context, apiKey, options) {
  try {
    const response = await context.$axios.get(
      `https://api.breezometer.com/weather/v1/current-conditions?lat=${options.lat}&lon=${options.lon}&key=${apiKey}`
    )
    return response.data.data
  } catch (ex) {
    // eslint-disable-next-line
    console.error(ex)
    return null
  }
}

async function getHourlyWeather (context, apiKey, options) {
  try {
    const response = await context.$axios.get(
      `https://api.breezometer.com/weather/v1/forecast/hourly?lat=${options.lat}&lon=${options.lon}&key=${apiKey}`
    )
    return response.data.data
  } catch (ex) {
    // eslint-disable-next-line
    console.error(ex)
    return null
  }
}

export const getters = {
  getCurrentWeather: (state) => {
    return state.current
  },
  getHourlyWeather: (state) => {
    return state.hourly
  },
  getDailyWeather: (state) => {
    return state.daily
  }
}

export const mutations = {
  SET_CURRENT_WEATHER (state, current) {
    if (!current) {
      return
    }
    state.current = current
  },
  SET_HOURLY_WEATHER (state, hourly) {
    if (!hourly) {
      return
    }
    state.hourly = hourly
  },
  SET_DAILY_WEATHER (state, daily) {
    if (!daily) {
      return
    }
    state.daily = daily
  }
}

export const actions = {
  async FETCH_WEATHER (store, options) {
    const apiKey = window.config.breezometerApiKey

    const [current, hourly] = await Promise.all([
      getCurrentWeather(this, apiKey, options),
      getHourlyWeather(this, apiKey, options)
    ])

    if (current && !current.erro) {
      store.commit('SET_CURRENT_WEATHER', current)
    }
    if (hourly && !hourly.error) {
      store.commit('SET_HOURLY_WEATHER', hourly)
    }
  }
}
