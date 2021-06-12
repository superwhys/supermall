<template>
  <div class="recommend">
    <div v-for="item in recommends" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommendView",
  props: {
    recommends: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
 .recommend{
   width: 100%;
   display: flex;
   font-size: 12px;
   text-align: center;
   padding: 8px 0 8px;
   border-bottom: 8px solid #eee
 }
 .recommend-item{
   flex: 1;
 }
 .recommend-item img{
   width: 60px;
   height: 60px;
   margin-bottom: 10px;

 }
</style>