export const state = () => ({
  indexes: [],
  polluants: []
})

async function getAirQuality (context, apiKey, options) {
  try {
    const url = `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${options.lat}&lon=${options.lon}&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,dominant_pollutant_concentrations,pollutants_concentrations,pollutants_aqi_information&key=${apiKey}`
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
  }
}

export const actions = {
  async FETCH_AIR_QUALITY (store, options) {
    const apiKey = window.config.breezometerApiKey

    try {
      const airQuality = await getAirQuality(this, apiKey, options)
      store.commit('SET_INDEXES', airQuality.indexes)
      store.commit('SET_POLLUANTS', airQuality.pollutants)
    } catch (ex) {
      // eslint-disable-next-line
      console.error(ex)
    }
  }
}
