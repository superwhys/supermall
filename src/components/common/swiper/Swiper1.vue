<template>
  <div class="hy-swiper">
    <div class="swiper">
      <slot></slot>
    </div>

  </div>
</template>

<script>
export default {
  name: "Swiper",
  data: function() {
    return {
      slideCount: 0, // 轮播图片个数
      totalWidth: 0, // 图片宽度
      swiperStyle: {}, // 轮播样式
      currentIndex: 1
    }
  },
  mounted: function () {
    // 延时0.1秒在执行，防止加载不出来
    setTimeout(() => {
      this.handleDom()

      this.startTimer()
    }, 100)
  },
  methods: {
    // 滚动图片函数
    setTransform: function (position) {
      this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`;
      this.swiperStyle['-webkit-transform'] = `translate3d(${position}px), 0, 0`;
      this.swiperStyle['-ms-transform'] = `translate3d(${position}px), 0, 0`;
    },

    handleDom() {
      // 获取轮播图元素
      let swiperEl = document.querySelector('.swiper')
      let slidesEls = swiperEl.getElementsByClassName('slide')

      // 获取轮播图图片个数
      this.slideCount = slidesEls.length
      if (this.slideCount > 1) {
        let cloneFirst = slidesEls[0].cloneNode(true);
        let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true);
        swiperEl.insertBefore(cloneLast, slidesEls[0]);
        swiperEl.appendChild(cloneFirst);
        this.totalWidth = swiperEl.offsetWidth;
        this.swiperStyle = swiperEl.style;
      }

      this.setTransform(-this.totalWidth);
    },

    // 滚动动画
    scrollContent(currentPosition) {
      this.swiperStyle.transition = 'transform ' + '300ms'
      this.setTransform(currentPosition)

      this.checkPosition();
    },

    // 定时器
    startTimer() {
      // 创建定时器
      this.playTimer = window.setInterval(() => {
        this.currentIndex++
        this.scrollContent(-this.currentIndex * this.totalWidth)

      }, 3000)
    },

    // 检查index是否超出范围
    checkPosition() {
      window.setTimeout(() => {
        // 检查index时将动画时间设为0，这样最后一张变到第一张时，肉眼看不出来
        this.swiperStyle.transition = '0ms';
        if(this.currentIndex >= this.slideCount + 1){
          this.currentIndex = 1
          this.setTransform(-this.currentIndex * this.totalWidth);
        }
      }, 300)
    }
  }
}
</script>

<style scoped>
  .hy-swiper{
    overflow: hidden;
  }

  .swiper{
    display: flex;
    position: relative;
  }
</style>