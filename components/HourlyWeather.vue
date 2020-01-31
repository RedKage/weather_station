<template>
  <div :class="$style.container">
    <v-btn v-if="showArrows" :class="$style.left" @click="left" icon tile>
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <div ref="days" :class="{ [$style.days]: true, [$style.withArrows]: showArrows }">
      <div
        v-for="weather in everyNthHours"
        :key="weather.datetime"
        :class="$style.day"
      >
        <div :class="$style.temperature">
          <span :class="$style.value">
            {{ Math.round(weather.temperature.value) }}
          </span>
          <span :class="$style.unit">
            <span>°{{ weather.temperature.units }}</span>
          </span>
        </div>
        <weather-icon
          :class="$style.icon"
          :is-day-time="weather.is_day_time"
          :icon-code="weather.icon_code"
          :title="weather.weather_text"
          :weather-icons="weatherIcons"
        />
        <div :class="$style.precipitation">
          <v-icon>mdi-weather-pouring</v-icon>
          <span :class="$style.value">
            {{ weather.precipitation.precipitation_probability }}
          </span>
          <span :class="$style.unit">%</span>
        </div>
        <div :class="$style.hour">
          {{ getHour(weather.datetime) }}H
        </div>
      </div>
    </div>
    <v-btn v-if="showArrows" :class="$style.right" @click="right" icon tile>
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Moment from 'moment-timezone'
import WeatherIcon from '~/components/WeatherIcon.vue'

export default {
  components: {
    WeatherIcon
  },
  props: {
    timezone: {
      default: 'UTC',
      type: String
    },
    weatherIcons: {
      default: () => {},
      type: Object
    },
    hourlyWeather: {
      default: () => [],
      type: Array
    },
    showEveryNthHour: {
      default: 1,
      type: Number
    },
    showArrows: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    everyNthHours () {
      const result = []
      for (
        let i = this.showEveryNthHour - 1;
        i < this.hourlyWeather.length;
        i = i + this.showEveryNthHour
      ) {
        result.push(this.hourlyWeather[i])
      }
      return result
    }
  },
  methods: {
    getHour (dateTime) {
      return Moment(dateTime).tz(this.timezone).format('HH')
    },
    left () {
      const firstDayElement = this.$refs.days.firstChild
      const firstDayElementRect = firstDayElement.getBoundingClientRect()
      this.$refs.days.scrollLeft -= firstDayElementRect.width
    },
    right () {
      const firstDayElement = this.$refs.days.firstChild
      const firstDayElementRect = firstDayElement.getBoundingClientRect()
      this.$refs.days.scrollLeft += firstDayElementRect.width
    }
  }
}
</script>

<style lang="scss" module>
.container {
  display: block;
  width: 100%;

  .value {
    font-size: 1em;
  }

  .unit {
    font-size: 0.8em;
    margin-left: -0.3em;
  }

  .left,
  .right {
    display: inline-block;
    font-size: 2em !important;
    width: 0.6em !important;
    height: 3em !important;
    vertical-align: middle;
  }

  .days {
    display: inline-block;
    width: 100%;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;

    &.withArrows {
      width: calc(100% - 3em);
    }

    .day {
      display: inline-block;
      width: 25%;
    }

    .temperature {
      display: block;
      width: 100%;
      font-size: 1.2em;
      line-height: 1em;
      text-align: center;
    }

    .icon {
      display: block;
      width: 100%;
      height: 3em;
    }

    .precipitation {
      text-align: center;
      font-size: 1em;

      i {
        color: lightblue;
      }
    }

    .hour {
      display: block;
      width: 100%;
      font-size: 1em;
      text-align: center;
    }
  }
}
</style>
