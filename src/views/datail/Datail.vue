<template>
  <div id="detail">
    <detail-nav-bar/>
    <detail-swiper :top-images="topImages"></detail-swiper>
  </div>
</template>

<script>
  import DetailNavBar from "./childComponents/DetailNavBar";
  import DetailSwiper from "./childComponents/DetailSwiper";
  import {getDetail} from "../../network/detail";

  export default {
    name: "Datail",
    components: {
      DetailNavBar,
      DetailSwiper
    },
    data() {
      return {
        iid: null,    // 商品id
        topImages: [] // 轮播图数组
      }
    },

    created() {
      //1. 保存商品id
      this.iid = this.$route.params.iid

      //2. 根据id请求详情数据
      getDetail(this.iid).then(res => {
        console.log(res);
        // 1. 获取顶部的图片轮播数据
        this.topImages = res.result.itemInfo.topImages;
      })
    }
  }
</script>

<style scoped>

</style>
