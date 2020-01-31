<template>
  <div :class="$style.container">
    <div :class="$style.scale">
      <div :class="$style.label">
        {{ severity }}
      </div>
      <div :class="$style.markMin">
        {{ scale[0] }}
      </div>
      <div :class="$style.markMax">
        {{ scale[5] }}
      </div>
      <div :class="[$style.line]">
        <div :class="[$style.mark, $style.low]">
          {{ scale[1] }}
        </div>
        <div :class="[$style.mark, $style.moderate]">
          {{ scale[2] }}
        </div>
        <div :class="[$style.mark, $style.good]">
          {{ scale[3] }}
        </div>
        <div :class="[$style.mark, $style.excellent]">
          {{ scale[4] }}
        </div>
        <div :class="[$style.segment, $style.poor]" />
        <div :class="[$style.segment, $style.low]" />
        <div :class="[$style.segment, $style.moderate]" />
        <div :class="[$style.segment, $style.good]" />
        <div :class="[$style.segment, $style.excellent]" />
        <div
          :class="{
            [$style.arrow]: true,
            [$style[severity]]: true
          }"
          :style="arrowStyle"
        />
      </div>
    </div>
    <div :class="$style.indexWrapper">
      <div :class="[$style.index, $style[severity]]">
        <span>{{ aqi }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    aqi: {
      default: null,
      type: Number
    },
    scale: {
      default: () => [0, 20, 40, 60, 80, 100],
      type: Array
    }
  },
  computed: {
    severity () {
      if (!this.aqi) {
        return null
      }
      return this.$store.getters['airQuality/getSeverityFromAqi'](
        this.aqi,
        this.scale
      )
    },
    percentAqi () {
      if (!this.aqi) {
        return 0.0
      }
      return (this.aqi * 100) / this.scale[5]
    },
    arrowStyle () {
      const left =
        this.scale[0] < this.scale[1] ? this.percentAqi : 100 - this.percentAqi
      return { left: left + '%' }
    }
  }
}
</script>

<style lang="scss" module>
.container {
  position: relative;
  display: block;
  width: 100%;
  min-width: 230px;
  text-align: left;

  .scale {
    position: relative;
    display: inline-block;
    width: 70%;
    vertical-align: top;

    .line {
      display: inline-block;
      position: relative;
      left: 0.5em;
      width: calc(100% - 1em);
      height: 2em;
      overflow: hidden;

      .mark {
        position: absolute;
        top: 0;
        font-size: 0.6em;
        margin-left: -1em;
        width: 2em;
        text-align: center;
        background-color: transparent;
      }

      .segment {
        position: absolute;
        display: block;
        top: 1.3em;
        border-width: 0.3em;
        border-style: solid;
        border-left: none;
        border-right: none;
        border-top: none;
        width: 20%;
      }

      .poor {
        left: 0%;
      }

      .low {
        left: 20%;
      }

      .moderate {
        left: 40%;
      }

      .good {
        left: 60%;
      }

      .excellent {
        left: 80%;
      }

      .arrow {
        position: absolute;
        top: 1em;
        height: 1.1em;
        border-width: 0.2em;
        border-style: solid;
      }
    }

    .markMin,
    .markMax {
      position: absolute;
      top: 2.5em;
      font-size: 0.6em;
    }

    .markMin {
      left: calc(0.6em / 2);
    }

    .markMax {
      right: calc(0.7em / 2);
      margin-left: -1.7em;
    }

    .label {
      display: block;
      text-align: right;
      text-transform: uppercase;
      font-size: 1em;
      height: 1.5em;
      line-height: 1em;
    }
  }

  .indexWrapper {
    position: relative;
    float: right;
    width: 30%;
    vertical-align: top;
    text-align: center;

    .index {
      display: inline-block;
      width: auto;
      height: auto;
      font-size: 2em;
      border-radius: 100%;
      border-width: 0.15em;
      border-style: solid;
      background-color: transparent;

      span {
        display: block;
        color: #fff;
        width: 1.6em;
        height: 1.6em;
        font-weight: bold;
        line-height: 1.6em;
        text-align: center;
      }
    }
  }
}
</style>
