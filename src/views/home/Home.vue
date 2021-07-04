<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-contorl" v-show="isTabFixed"/>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load='true' @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view/>

      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                    ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 监听组件的点击要添加native -->
    <back-top class="back-top" @click.native="btClick" v-show="btShow"></back-top>
  </div>
</template>

<script>

import NavBar from "components/common/navbar/NavBar";
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backtop/BackTop";

import {getHomeMultidata, getHomeGood} from "network/home";
import {debounce} from "common/utils";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      btShow: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  // 组件创建完之后，立刻发送请求
  // 利用生命周期函数
  created() {
    this.getHomeMultidata()
    this.getHomeGood('pop')
    this.getHomeGood('new')
    this.getHomeGood('sell')

    // // 监听item中图片加载完成，写在created里，可能会拿不到refresh，因此写在mounted
    // this.$bus.$on('itemImageLoad', () => {
    //   this.$refs.scroll.refresh()
    // })

  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 500)
    // 监听item中图片加载完成
    this.$bus.$on('itemImageLoad', () => {
      // this.$refs.scroll.refresh()
      refresh()

    })
  },
  activated() {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0.2)
    // this.$refs.scroll.refresh()
  },
  deactivated() {
    this.saveY = this.$refs.scroll.scroll.y
  },
  methods: {
    /**
     *事件监听相关方法
     */

    tabClick(index){
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    btClick() {
      // 子传父，拿到子组件中的scroll对象
      // scrillTo(x, y, time(ms)) 在time时间内回到（x, y）
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position){
      // 1. 判断BackTop是否显示
      this.btShow = position.y < -1000

      // 2.决定tabcaontorl是否吸顶（position: fixed）
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGood(this.currentType)
    },
    swiperImageLoad() {
      // 1.获取tabcontrol的offsetTop
      // 所有的组件都有一个属性 $el : 用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGood(type){
      const page = this.goods[type].page + 1
      getHomeGood(type, page).then(res => {
        this.goods[type].page = page
        this.goods[type].list.push(...res.data.list)

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
        // this.$refs.scroll.refresh()
      })
    }
  }
}
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    /*vh 视口高度*/
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: white;
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    overflow: hidden;
  }

  .tab-contorl{
    position: fixed;
    top: 43px;
    left: 0;
    right: 0;
    z-index: 9;
  }
  /*.content{*/
  /*  height: calc(100% - 44px - 49px);*/
  /*  margin-top: 44px;*/
  /*  overflow: hidden;*/
  /*}*/


</style>
