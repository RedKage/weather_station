export const state = () => ({
  indexes: [],
  polluants: [],
  hourly: []
})

async function getAirQuality (context, apiKey, coordinates) {
  try {
    const url = `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${coordinates.lat}&lon=${coordinates.lon}&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,dominant_pollutant_concentrations,pollutants_concentrations,pollutants_aqi_information&key=${apiKey}`
    const response = await context.$axios.get(url)
    return response.data.data
  } catch (ex) {
    // eslint-disable-next-line
    console.error(ex)
    return null
  }
}

async function getAirQualityHistory (context, apiKey, coordinates, hours) {
  try {
    const url = `https://api.breezometer.com/air-quality/v2/historical/hourly?lat=${coordinates.lat}&lon=${coordinates.lon}&hours=${hours}&key=${apiKey}`
    const response = await context.$axios.get(url)
    return response.data.data
  } catch (ex) {
    // eslint-disable-next-line
    console.error(ex)
    return null
  }
}

async function getAirQualityForecast (context, apiKey, coordinates, hours) {
  try {
    const url = `https://api.breezometer.com/air-quality/v2/forecast/hourly?lat=${coordinates.lat}&lon=${coordinates.lon}&hours=${hours}&key=${apiKey}`
    const response = await context.$axios.get(url)
    return response.data.data
  } catch (ex) {
    // eslint-disable-next-line
    console.error(ex)
    return null
  }
}

function getSeverityFromAqiAsc (aqi, scaleArray) {
  if (aqi >= scaleArray[0] && aqi < scaleArray[1]) {
    return 'poor'
  } else if (aqi >= scaleArray[1] && aqi < scaleArray[2]) {
    return 'low'
  } else if (aqi >= scaleArray[2] && aqi < scaleArray[3]) {
    return 'moderate'
  } else if (aqi >= scaleArray[3] && aqi < scaleArray[4]) {
    return 'good'
  } else if (aqi >= scaleArray[4]) {
    return 'excellent'
  } else {
    return null
  }
}

function getSeverityFromAqiDesc (aqi, scaleArray) {
  if (aqi <= scaleArray[0] && aqi > scaleArray[1]) {
    return 'poor'
  } else if (aqi <= scaleArray[1] && aqi > scaleArray[2]) {
    return 'low'
  } else if (aqi <= scaleArray[2] && aqi > scaleArray[3]) {
    return 'moderate'
  } else if (aqi <= scaleArray[3] && aqi > scaleArray[4]) {
    return 'good'
  } else if (aqi <= scaleArray[4]) {
    return 'excellent'
  } else {
    return null
  }
}

export const getters = {
  getIndexes: (state) => {
    return state.indexes
  },
  getIndex: state => (type) => {
    return state.indexes[type]
  },
  getPolluants: (state) => {
    return state.polluants
  },
  getPolluant: state => (type) => {
    return state.polluants[type]
  },
  getSeverityFromAqi: state => (aqi, scaleArray) => {
    const isAscending = scaleArray[0] < scaleArray[1]
    return isAscending
      ? getSeverityFromAqiAsc(aqi, scaleArray)
      : getSeverityFromAqiDesc(aqi, scaleArray)
  },
  getHourlyIndexes: (state) => {
    return state.hourly
  }
}

export const mutations = {
  SET_INDEXES (state, indexes) {
    if (!indexes) {
      return
    }

    const indexesByKey = Object.keys(indexes).map((key) => {
      return {
        id: key,
        ...indexes[key]
      }
    })

    state.indexes = indexesByKey
  },
  SET_POLLUANTS (state, pollutants) {
    if (!pollutants) {
      return
    }

    const polluantsByKey = Object.keys(pollutants).map((key) => {
      return {
        id: key,
        ...pollutants[key]
      }
    })

    state.polluants = polluantsByKey
  },
  RESET_HOURLY (state) {
    state.hourly = []
  },
  PUSH_HOURLY (state, hourly) {
    state.hourly = state.hourly.concat(hourly)
  }
}

export const actions = {
  async FETCH_AIR_QUALITY (store, { coordinates, beforeHours, afterHours }) {
    const apiKey = window.config.breezometerApiKey

    const promises = [
      getAirQuality(this, apiKey, coordinates)
    ]

    if (beforeHours > 0) {
      promises.push(getAirQualityHistory(this, apiKey, coordinates, beforeHours))
    }
    if (afterHours > 0) {
      promises.push(getAirQualityForecast(this, apiKey, coordinates, afterHours))
    }

    const [airQuality, airQualityHistory, airQualityForecast] = await Promise.all(promises)

    if (airQuality && !airQuality.error) {
      store.commit('SET_INDEXES', airQuality.indexes)
      store.commit('SET_POLLUANTS', airQuality.pollutants)
    }

    let hasReset = false
    if (airQualityHistory && !airQualityHistory.error) {
      store.commit('RESET_HOURLY')
      store.commit('PUSH_HOURLY', airQualityHistory)
      hasReset = true
    }
    if (airQualityForecast && !airQualityForecast.error) {
      if (!hasReset) {
        store.commit('RESET_HOURLY')
      }
      store.commit('PUSH_HOURLY', airQualityForecast)
    }
  }
}
