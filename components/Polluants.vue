<template>
  <div :class="$style.container">
    <div
      v-ripple
      v-for="polluant in polluants"
      :key="polluant.id"
      :class="{
        [$style.polluant]: true,
        [$style.dominant]: polluant.id == domiantPolluant
      }"
      :title="polluant.full_name"
      @click="openPolluantInfo(polluant)"
    >
      <div :class="$style.icon">
        <v-icon v-if="polluant.id == domiantPolluant">
          mdi-alert-circle
        </v-icon>
        <v-icon v-else>
          mdi-circle-medium
        </v-icon>
      </div>
      <div :class="$style.name">
        {{ polluant.display_name }}
      </div>
      <div :class="$style.concentration">
        <span :class="$style.value">{{ polluant.concentration.value }}</span>
        <span :class="$style.unit">{{ polluant.concentration.units }}</span>
      </div>
    </div>

    <v-dialog v-model="showPolluantInfo">
      <v-card>
        <v-card-title primary-title>
          <v-icon>
            mdi-help-circle
          </v-icon>
          <span>&nbsp;</span>
          <span>{{ polluantFullName }}</span>
        </v-card-title>
        <v-card-text>
          {{ polluantSources }}
        </v-card-text>
        <v-card-text>
          {{ polluantEffects }}
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showPolluantInfo = false" text>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    domiantPolluant: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      showPolluantInfo: false,
      polluantFullName: '',
      polluantSources: '',
      polluantEffects: ''
    }
  },
  computed: {
    polluants () {
      return this.$store.getters['airQuality/getPolluants']
    }
  },
  methods: {
    openPolluantInfo (polluant) {
      this.polluantFullName = polluant.full_name
      this.polluantSources = polluant.sources_and_effects.sources
      this.polluantEffects = polluant.sources_and_effects.effects
      this.showPolluantInfo = true
    }
  }
}
</script>

<style lang="scss" module>
.container {
  display: block;
  width: 100%;

  .polluant {
    display: inline-block;
    background: rgba(33, 33, 33, 0.7);
    border-radius: 0.2em;
    width: calc(50% - 0.2em);
    margin: 0.1em;
    font-size: 0.8em;
    cursor: pointer;

    &.dominant {
      display: inline-block;
      font-weight: bold;
    }

    .icon {
      display: inline-block;
      vertical-align: middle;
      font-size: 1em;
      line-height: 1em;
      margin-left: 0.2em;
    }

    .name {
      display: inline-block;
      vertical-align: middle;
      font-size: 1em;
      line-height: 1em;
      margin-right: 0.2em;
    }

    .concentration {
      display: inline-block;
      vertical-align: bottom;
      line-height: 1.2em;

      .value {
        font-size: 0.8em;
      }

      .unit {
        font-size: 0.7em;
        margin-left: -0.2em;
      }
    }
  }
}
</style>
