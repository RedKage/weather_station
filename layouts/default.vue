<template>
  <v-app :class="$style.container" :style="backgroundImage" dark>
    <v-navigation-drawer
      v-model="drawer"
      :class="$style.drawerPane"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      temporary
    >
      <v-list>
        <v-list-item
          v-for="(location, i) in availableLocation"
          :key="i"
          @click="changeLocation(location)"
        >
          <v-list-item-action>
            <v-icon>{{ location.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="location.label" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div :class="{ [$style.front]: true, [$style.shown]: showUi, [$style.hidden]: !showUi }">
      <div :class="$style.buttons">
        <div :class="$style.drawer">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        </div>
        <div :class="$style.fullscreen">
          <v-btn @click.stop="toggleFullscreen" icon>
            <v-icon v-if="fullscreen">
              mdi-fullscreen-exit
            </v-icon>
            <v-icon v-else>
              mdi-fullscreen
            </v-icon>
          </v-btn>
        </div>
      </div>

      <v-content>
        <v-container :class="$style.page">
          <nuxt />
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      fullscreen: false,
      miniVariant: false,
      refreshBackgroundImageInterval: null,
      showUiTimeout: null,
      hideUiTimeout: null,
      showUi: true,
      backgroundImageIndex: 0
    }
  },
  computed: {
    currentLocation () {
      return this.$store.getters['location/getCurrentLocationInfo']
    },
    availableLocation () {
      return window.config.locations
    },
    backgroundImage () {
      if (!this.currentLocation || !this.currentLocation.backgroundImages) {
        return null
      }
      return `background-image: url(${this.currentLocation.backgroundImages[this.backgroundImageIndex]})`
    }
  },
  beforeMount () {
    // default on the 1st location
    this.changeLocation(window.config.locations[0])
  },
  mounted () {
    // detects fullscreen change event
    document.addEventListener('fullscreenchange', this.onFullscreenChange)

    // set background image change intervall
    this.refreshBackgroundImageInterval = setInterval(() => {
      const imagesCount = this.currentLocation.backgroundImages.length
      this.backgroundImageIndex = (this.backgroundImageIndex + 1) % imagesCount
    }, 1000 * 60 * 30) // 30 minutes

    const that = this
    // set UI hide interval
    function setHideUiTimeout () {
      that.hideUiTimeout = setTimeout(() => {
        that.showUi = false
        setShowUiTimeout()
      }, 1000 * 50) // 50 secs
    }

    // set UI show interval
    function setShowUiTimeout () {
      that.showUiTimeout = setTimeout(() => {
        that.showUi = true
        setHideUiTimeout()
      }, 1000 * 10) // 60 secs
    }

    setHideUiTimeout()
  },
  beforeDestroy () {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange)
    clearInterval(this.refreshBackgroundImageInterval)
    clearTimeout(this.showUiTimeout)
    clearTimeout(this.hideUiTimeout)
  },
  methods: {
    onFullscreenChange (event) {
      this.fullscreen = document.fullscreenElement !== null
    },
    toggleFullscreen () {
      if (this.fullscreen) {
        document.exitFullscreen()
      } else {
        this.$el.requestFullscreen()
      }
    },
    changeLocation (location) {
      this.$store.dispatch('location/SWITCH_LOCATION', location)
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" module>
.container {
  padding: 0;
  background-color: #333;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  font-size: 2em;

  .drawerPane {
    width: 7em !important;
    font-size: 3em;
  }

  .front {
    position: relative;
    &.shown {
      opacity: 1;
      animation: twoStepsFadeIn 2s;
    }
    &.hidden {
      opacity: 0;
      animation: twoStepsFadeOut 2s;
    }

    .buttons {
      position: absolute;
      top: 1em;
      left: 0.5em;
      font-size: 2.5em;
      z-index: 1;

      .drawer {
        float: left;
      }

      .fullscreen {
        float: left;
      }
    }

    .page {
      padding: 0;
      margin: 0;
      max-width: 100%;
      width: 100%;
      height: 100%;
    }
  }

  @keyframes twoStepsFadeIn {
    0% {
      opacity: 0;
    }
    32% {
      opacity: 0;
    }

    33% {
      opacity: .5;
    }
    99% {
      opacity: .5;
    }

    100% {
        opacity: 1;
    }
  }

  @keyframes twoStepsFadeOut {
    0% {
      opacity: 1;
    }
    32% {
      opacity: 1;
    }

    33% {
      opacity: .5;
    }
    99% {
      opacity: .5;
    }

    100% {
        opacity: 0;
    }
  }
}
</style>
