<template>
  <div :class="$style.container" v-if="currentWeather">
    <div :class="$style.column">
      <div :class="$style.label">
        {{ currentWeather.weather_text }}
      </div>
      <weather-icon
        :class="$style.weatherIcon"
        :is-day-time="currentWeather.is_day_time"
        :icon-code="currentWeather.icon_code"
        :weather-icons="weatherIcons"
      />
    </div>
    <div :class="$style.column">
      <div :class="$style.temperature">
        <span :class="$style.value">{{
          Math.round(currentWeather.temperature.value * 10) / 10
        }}</span>
        <span :class="$style.unit">
          <span>°{{ currentWeather.temperature.units }}</span>
        </span>
      </div>

      <div :class="$style.feelsLike">
        <v-icon :class="$style.icon">
          mdi-thermometer
        </v-icon>
        <span :class="$style.value">
          {{
            Math.round(currentWeather.feels_like_temperature.value * 10) / 10
          }}
        </span>
        <span :class="$style.unit">
          °{{ currentWeather.feels_like_temperature.units }}
        </span>
      </div>

      <div :class="$style.precipitation">
        <v-icon :class="$style.icon">
          mdi-weather-pouring
        </v-icon>
        <span :class="$style.value">
          {{ currentWeather.precipitation.precipitation_probability }}
        </span>
        <span :class="$style.unit">%</span>
      </div>

      <div :class="$style.dewPoint">
        <v-icon :class="$style.icon">
          mdi-waves
        </v-icon>
        <span :class="$style.value">
          {{ Math.round(currentWeather.dew_point.value * 10) / 10 }}
        </span>
        <span :class="$style.unit">°{{ currentWeather.dew_point.units }}</span>
      </div>

      <div :class="$style.humidity">
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
  }

  .icon {
    color: lightblue;
    margin-right: -0.3em;
  }

  .weatherIcon {
    margin-top: 1em;
    width: 100%;
    height: 5.5em;
  }

  .label {
    display: block;
    text-align: center;
    text-transform: uppercase;
    font-size: 1em;
    line-height: 1em;
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
    line-height: 1em;
  }

  .feelsLike {
    float: right;
    clear: both;
    width: 50%;
    text-align: right;
    font-size: 1.5em;
  }

  .humidity {
    float: right;
    width: 50%;
    text-align: right;
    font-size: 1.5em;
  }

  .dewPoint {
    float: right;
    width: 50%;
    text-align: right;
    font-size: 1.5em;
    clear: right;

    i {
      margin-right: -0.1em;
    }
  }

  .precipitation {
    float: right;
    width: 50%;
    text-align: right;
    font-size: 1.5em;
    clear: left;

    i {
      margin-right: -0.1em;
    }
  }
}
</style>
