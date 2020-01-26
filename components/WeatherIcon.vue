<template>
  <div :class="$style.container" :style="style" />
</template>

<script>
export default {
  props: {
    weatherIcons: {
      default: () => {},
      type: Object
    },
    isDayTime: {
      default: true,
      type: Boolean
    },
    iconCode: {
      default: 0,
      type: Number
    }
  },
  computed: {
    style () {
      const url = this.weatherIcons[this.isDayTime ? 'day' : 'night'][this.iconCode]
      return `background-image: url(${url})`
    }
  }
}
</script>

<style lang="scss" module>
.container {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
</style>
