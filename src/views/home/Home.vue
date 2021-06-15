<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load='true'>
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view/>

      <tab-control class="tab-control"
                   :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"/>
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
      btShow: false
    }
  },
  // 组件创建完之后，立刻发送请求
  // 利用生命周期函数
  created() {
    this.getHomeMultidata()
    this.getHomeGood('pop')
    this.getHomeGood('new')
    this.getHomeGood('sell')

    // 监听item中图片加载完成
    this.$bus.$on('itemImageLoad', () => {
      this.$refs.scroll.refresh()
    })

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
    },
    btClick() {
      // 子传父，拿到子组件中的scroll对象
      // scrillTo(x, y, time(ms)) 在time时间内回到（x, y）
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position){
      this.btShow = position.y < -1000
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

      })
    }
  }
}
</script>

<style scoped>
  #home{
    padding-top: 44px;
    /*vh 视口高度*/
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control{
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
  }

  /*.content{*/
  /*  height: calc(100% - 44px - 49px);*/
  /*  margin-top: 44px;*/
  /*  overflow: hidden;*/
  /*}*/


</style>
