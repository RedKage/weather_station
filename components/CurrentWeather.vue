<template>
  <div :class="$style.container" v-if="currentWeather">
    <div :class="[$style.column, $style.icon]">
      <weather-icon
        :class="$style.weatherIcon"
        :is-day-time="currentWeather.is_day_time"
        :icon-code="currentWeather.icon_code"
        :weather-icons="weatherIcons"
      />
      <div :class="$style.label">
        {{ currentWeather.weather_text }}
      </div>
    </div>
    <div :class="[$style.column, $style.info]">
      <div :class="$style.temperature">
        <span :class="$style.value">{{ oneDecimal(currentWeather.temperature.value) }}</span>
        <span :class="$style.unit">
          <span>°{{ currentWeather.temperature.units }}</span>
        </span>
      </div>

      <div :class="$style.smallInfo">
        <div :class="$style.feelsLike" title="Feels like">
          <v-icon :class="$style.icon">
            mdi-thermometer
          </v-icon>
          <span :class="$style.value">
            {{ Math.round(currentWeather.feels_like_temperature.value) }}
          </span>
          <span :class="$style.unit">
            °{{ currentWeather.feels_like_temperature.units }}
          </span>
        </div>

        <div :class="$style.precipitation" title="Precipitation">
          <v-icon :class="$style.icon">
            mdi-weather-pouring
          </v-icon>
          <span :class="$style.value">
            {{ currentWeather.precipitation.precipitation_probability }}
          </span>
          <span :class="$style.unit">%</span>
        </div>

        <div :class="$style.dewPoint" title="Dew point">
          <v-icon :class="$style.icon">
            mdi-waves
          </v-icon>
          <span :class="$style.value">
            {{ Math.round(currentWeather.dew_point.value) }}
          </span>
          <span :class="$style.unit">°{{ currentWeather.dew_point.units }}</span>
        </div>

        <div :class="$style.humidity" title="Relative humidity">
          <v-icon :class="$style.icon">
            mdi-water
          </v-icon>
          <span :class="$style.value">
            {{ currentWeather.relative_humidity }}
          </span>
          <span :class="$style.unit">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WeatherIcon from '~/components/WeatherIcon.vue'

export default {
  components: {
    WeatherIcon
  },
  props: {
    weatherIcons: {
      default: () => {},
      type: Object
    },
    currentWeather: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    airIndexes () {
      return this.$store.getters['airQuality/getIndexes']
    }
  },
  methods: {
    oneDecimal (number) {
      return Math.round(number * 10) / 10
    }
  }
}
</script>

<style lang="scss" module>
.container {
  display: block;
  position: relative;

  .column {
    display: inline-block;
    vertical-align: top;
    width: 49%;

    &.icon {
      width: 40%;
    }

    &.info {
      width: 60%;
    }
  }

  .icon {
    color: lightblue;
    margin-right: -0.3em;
  }

  .weatherIcon {
    margin-bottom: 0.5em;
    width: 100%;
    height: 5.5em;
  }

  .label {
    display: block;
    text-align: center;
    font-size: 0.8em;
    line-height: 0.9em;
  }

  .value {
    font-size: 1em;
  }

  .unit {
    font-size: 0.8em;
    margin-left: -0.3em;
  }

  .temperature {
    float: right;
    clear: both;
    text-align: right;
    font-size: 4em;
    font-weight: bold;
    line-height: 0.9em;
  }

  .smallInfo {
    padding-left: 2em;
    width: 100%;

    i {
      margin-right: -0.1em;
    }

    .feelsLike {
      float: right;
      clear: both;
      width: 50%;
      text-align: left;
      font-size: 1.5em;
    }

    .humidity {
      float: right;
      width: 50%;
      text-align: left;
      font-size: 1.5em;
    }

    .dewPoint {
      float: right;
      width: 50%;
      text-align: left;
      font-size: 1.5em;
      clear: right;
    }

    .precipitation {
      float: right;
      width: 50%;
      text-align: left;
      font-size: 1.5em;
      clear: left;
    }
  }
}
</style>
