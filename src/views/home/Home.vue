<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"></recommend-view>

  </div>
</template>

<script>

import NavBar from "components/common/navbar/NavBar";
import HomeSwiper from "./childComps/HomeSwiper";
// import HomeSwiper from "./childComps/HomeSwiper1";
import RecommendView from "./childComps/RecommendView";


import {getHomeMultidata} from "network/home";


export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView
  },
  data() {
    return {
      banners: [],
      recommends: []
    }
  },
  // 组件创建完之后，立刻发送请求
  // 利用生命周期函数
  created() {
    getHomeMultidata().then(res => {
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
    })
  }
}
</script>

<style scoped>
  .home-nav{
    background-color: var(--color-tint);
    color: white;
  }

</style>
