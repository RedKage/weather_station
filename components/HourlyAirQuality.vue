<template>
  <div :class="$style.container">
    <div :class="$style.wrapper">
      <div
        v-for="hourly in hourlyAqi"
        :key="hourly.datetime"
        :class="$style.bars"
      >
        <div
          :class="$style.padding"
          :style="{ height: 100 - getPercentAqi(hourly.indexes['baqi'].aqi) + '%' }"
        />
        <div :class="$style.index">
          {{ hourly.indexes['baqi'].aqi }}
        </div>
        <div
          :class="[$style.bar, $style[getSeverity(hourly.indexes['baqi'].aqi)]]"
          :style="{ height: 'calc(' + getPercentAqi(hourly.indexes['baqi'].aqi) + '% - 2em)' }"
        />
        <div :class="$style.hour">
          {{ getHour(hourly.datetime) }}H
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from 'moment-timezone'

export default {
  props: {
    timezone: {
      default: 'UTC',
      type: String
    },
    hourlyAqi: {
      default: () => [],
      type: Array
    },
    scale: {
      default: () => [0, 20, 40, 60, 80, 100],
      type: Array
    }
  },
  methods: {
    getHour (dateTime) {
      return Moment(dateTime).tz(this.timezone).format('HH')
    },
    getSeverity (aqi) {
      return this.$store.getters['airQuality/getSeverityFromAqi'](aqi, this.scale)
    },
    getPercentAqi (aqi) {
      return (aqi * 100) / this.scale[5]
    }
  }
}
</script>

<style lang="scss" module>
.container {
  display: block;
  width: 100%;

  .wrapper {
    height: 5em;
    margin: auto;

    .bars {
      display: inline-block;
      width: 10%;
      height: 100%;
      vertical-align: top;

      .padding {
        display: block;
        width: 100%;
        height: auto;
        background-color: transparent;
      }

      .index {
        display: block;
        width: 100%;
        text-align: center;
        font-size: 0.8em;
        font-weight: bold;
        line-height: 1em;
      }

      .bar {
        position: relative;
        display: block;
        width: 90%;
        height: auto;
        margin: auto;
        box-shadow: inset 0 0.3em 0 -0.1em rgba(33, 33, 33, 0.2);
        transition: height 1s ease;
      }

      .hour {
        display: block;
        text-align: center;
        font-size: 0.8em;
        line-height: 1em;
        margin-top: 0.4em;
      }
    }
  }
}
</style>
