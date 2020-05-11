<template>
  <swiper>
    <swiper-item v-for="item in banners" :key="item.title">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from "../../../components/common/swiper/"

  export default {
    name: "HomeSwiper",
    components: {
      Swiper,
      SwiperItem
    },
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data(){
      return {
        //图片是否加载完成
        isLoad: false
      }
    },
    methods: {
      //监听轮播图加载完成，用于计算tabControl组件的offsetTop属性，做tabControl的吸顶效果
      imageLoad(){
        if(!this.isLoad){ //为false则发送事件
          this.$emit('swiperImageLoad');
          // 发送一次后修改为true，因为没必要发送第二次事件了
          this.isLoad = true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
