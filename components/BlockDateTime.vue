<template>
  <div :class="$style.container">
    <div :class="$style.date">
      <div>{{ day }}</div>
      <div>{{ date }}</div>
    </div>
    <div :class="$style.time">
      {{ time }}
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import MomentTimezone from 'moment-timezone'

export default {
  props: {
    timezone: {
      default: 'UTC',
      type: String
    }
  },
  data () {
    return {
      refreshDateTimeInterval: null,
      datetime: null
    }
  },
  computed: {
    day () {
      return this.datetime
        ? MomentTimezone(this.datetime).tz(this.timezone).format('dddd')
        : ''
    },
    date () {
      return this.datetime
        ? MomentTimezone(this.datetime).tz(this.timezone).format('MMMM DD')
        : ''
    },
    time () {
      return this.datetime
        ? MomentTimezone(this.datetime).tz(this.timezone).format('HH:mm')
        : ''
    }
  },
  watch: {
    timezone (newTimezone) {
      if (newTimezone) {
        this.datetime = Moment()
      }
    }
  },
  mounted () {
    this.datetime = Moment()
    this.refreshDateTimeInterval = setInterval(() => {
      this.datetime = Moment()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.refreshDateTimeInterval)
  }
}
</script>

<style lang="scss" module>
.container {
  display: block;
  text-align: right;
  font-size: 2em;

  .date {
    display: inline-block;
    vertical-align: top;
    font-size: 1em;
    line-height: 1em;
    font-weight: bold;
    margin-right: 0.5em;
  }

  .time {
    display: inline-block;
    vertical-align: top;
    line-height: 1em;
    font-size: 2em;
    font-weight: bold;
  }
}
</style>
