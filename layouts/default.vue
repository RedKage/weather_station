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
    document.addEventListener('fullscreenchange', this.onFullscreenChange)
    this.refreshBackgroundImageInterval = setInterval(() => {
      const imagesCount = this.currentLocation.backgroundImages.length
      this.backgroundImageIndex = (this.backgroundImageIndex + 1) % imagesCount
    }, 1000 * 60 * 30) // 30 minutes
  },
  beforeDestroy () {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange)
    clearInterval(this.refreshBackgroundImageInterval)
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
</style>
