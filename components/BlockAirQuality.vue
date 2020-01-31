<template>
  <v-card :class="$style.container" :loading="loading" outlined>
    <div
      v-for="airIndex in airIndexes"
      :key="airIndex.id"
      :class="$style.block"
    >
      <severity-scale
        v-if="airIndex.id === 'baqi'"
        :aqi="airIndex.aqi"
        :scale="
          airIndex.id === 'baqi'
            ? [0, 20, 40, 60, 80, 100]
            : [10, 8, 6, 4, 2, 0]
        "
        :class="{
          [$style.scale]: true,
          [$style.baqi]: airIndex.id === 'baqi',
          [$style.aqi]: airIndex.id !== 'baqi'
        }"
      />
    </div>
    <hourly-air-quality
      :hourly-aqi="hourlyAirIndexes"
      :timezone="timezone"
    />
    <v-divider :class="$style.divider" />
    <polluants
      v-if="airIndexes[0]"
      :domiant-polluant="airIndexes[0].dominant_pollutant"
    />
  </v-card>
</template>

<script>
import HourlyAirQuality from '~/components/HourlyAirQuality.vue'
import SeverityScale from '~/components/SeverityScale.vue'
import Polluants from '~/components/Polluants.vue'

async function load (context) {
  context.loading = true
  await Promise.all([
    context.$store.dispatch('airQuality/FETCH_AIR_QUALITY', context.coordinates),
    context.$store.dispatch('airQuality/FETCH_AIR_QUALITY_HOURLY', { coordinates: context.coordinates, beforeHours: 2, afterHours: 8 })
  ])
  context.loading = false
}

export default {
  components: {
    SeverityScale,
    Polluants,
    HourlyAirQuality
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
    airIndexes () {
      return this.$store.getters['airQuality/getIndexes']
    },
    hourlyAirIndexes () {
      return this.$store.getters['airQuality/getHourlyIndexes']
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

  .divider {
    margin: 0.5em 0;
  }

  .scale {
    display: block;

    &.baqi {
      display: block;
      font-size: 1.3em;
      width: 100%;
    }

    &.aqi {
      display: block;
      font-size: 0.9em;
      width: 100%;
    }
  }
}
</style>
