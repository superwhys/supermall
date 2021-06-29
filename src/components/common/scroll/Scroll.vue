<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType:this.probeType,
      click: true,
      pullUpLoad: this.pullUpLoad,
      observeDOM:true
    })

    if(this.probeType !== 1 && this.probeType !== 0){
      // 监听滚动位置
      this.listenPosition(this.scroll)
    }

    // 监听scroll滚动到底部
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')

      })
    }
  },
  methods: {
    scrollTo(x, y, time=400) {
      this.scroll.scrollTo(x, y, time)
    },
    listenPosition(scroll){
      scroll.on('scroll', (position) => {
        this.$emit('scroll', position)
      })
    },
    refresh(){
      this.scroll.refresh()
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    }
  }
}
</script>

<style scoped>

</style>
