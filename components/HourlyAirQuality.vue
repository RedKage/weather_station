<template>
  <div :class="$style.container">
    fu
  </div>
</template>

<script>
import MomentTimezone from 'moment-timezone'

export default {
  props: {
    timezone: {
      default: 'UTC',
      type: String
    },
    hourlyAirQuality: {
      default: () => [],
      type: Array
    }
  },
  methods: {
    getHour (dateTime) {
      return MomentTimezone(dateTime).tz(this.timezone).format('HH')
    }
  }
}
</script>

<style lang="scss" module>
.container {
  display: block;
  width: 100%;

}
</style>
