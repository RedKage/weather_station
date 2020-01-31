<template>
  <div :class="$style.container">
    <div :class="$style.title">
      <v-icon :class="$style.icon">
        {{ locationInfo.icon }}
      </v-icon>
      <span :class="$style.label">{{ locationInfo.label }}</span>
    </div>

    <div :class="$style.blockWrapper">
      <block-date-time
        :class="$style.block"
        :timezone="locationInfo.timezone"
      />
    </div>

    <v-layout align-start justify-left wrap>
      <v-flex :class="$style.blockWrapper" d-flex xs6>
        <block-air-quality
          :class="$style.block"
          :coordinates="locationInfo.coordinates"
        />
      </v-flex>
      <v-flex :class="$style.blockWrapper" d-flex xs6>
        <block-weather
          :class="$style.block"
          :coordinates="locationInfo.coordinates"
          :timezone="locationInfo.timezone"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import BlockDateTime from '~/components/BlockDateTime.vue'
import BlockAirQuality from '~/components/BlockAirQuality.vue'
import BlockWeather from '~/components/BlockWeather.vue'

export default {
  components: {
    BlockDateTime,
    BlockAirQuality,
    BlockWeather
  },
  computed: {
    locationInfo () {
      return this.$store.getters['location/getCurrentLocationInfo']
    }
  }
}
</script>

<style lang="scss" module>
.container {
  padding: 0.2em;
  margin: 0;
  background-color: transparent;

  .title {
    position: absolute;
    top: 0;
    left: 0.5em;
    font-size: 2.5em;

    .icon {
      display: inline-block;
      line-height: 1em;
      vertical-align: bottom;
    }

    .label {
      display: inline-block;
      line-height: 1em;
      vertical-align: bottom;
    }
  }

  .blockWrapper {
    padding: 0.2em;

    .block {
      padding: 0.5em;
      background-color: transparent !important;
      /* stylelint-disable */
      background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.65),
        rgba(0, 0, 0, 0.05)
      );
      /* stylelint-enable */
      border: none !important;
      border-radius: 0.3em !important;
    }

    :global(.v-card__progress) {
      :global(.v-progress-linear) {
        height: 0.2em !important;
        top: 0.15em;
      }
    }
  }
}
</style>
