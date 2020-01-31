<template>
  <v-card :class="$style.container" :loading="loading" outlined>
    <current-weather
      v-if="currentWeather"
      :class="$style.current"
      :weather-icons="weatherIcons"
      :current-weather="currentWeather"
    />
    <v-divider :class="$style.divider" />
    <hourly-weather
      v-if="hourlyWeather"
      :class="$style.hourly"
      :timezone="timezone"
      :weather-icons="weatherIcons"
      :hourly-weather="hourlyWeather"
      :show-every-nth-hour="6"
      :show-arrows="false"
    />
  </v-card>
</template>

<script>
import CurrentWeather from '~/components/CurrentWeather.vue'
import HourlyWeather from '~/components/HourlyWeather.vue'

async function load (context) {
  context.loading = true

  const options = {
    ...context.coordinates
  }
  await context.$store.dispatch('weather/FETCH_WEATHER', options)

  context.loading = false
}

export default {
  components: {
    CurrentWeather,
    HourlyWeather
  },
  props: {
    coordinates: {
      default: () => {},
      type: Object
    },
    timezone: {
      default: 'UTC',
      type: String
    }
  },
  data () {
    return {
      refreshInterval: null,
      loading: true
    }
  },
  computed: {
    weatherIcons () {
      return window.config.weatherIcons
    },
    currentWeather () {
      return this.$store.getters['weather/getCurrentWeather']
    },
    hourlyWeather () {
      return this.$store.getters['weather/getHourlyWeather']
    }
  },
  watch: {
    async coordinates (newCoordinates) {
      if (newCoordinates) {
        await load(this)
      }
    }
  },
  mounted () {
    load(this)
    this.refreshInterval = setInterval(() => {
      load(this)
    }, 1000 * 60)
  },
  beforeDestroy () {
    clearInterval(this.refreshInterval)
  }
}
</script>

<style lang="scss" module>
.container {
  display: block;
  width: 100%;
  min-height: 5em;

  .current {
    display: block;
  }

  .hourly {
    display: block;
    margin-top: 0.5em;
  }
}
</style>
