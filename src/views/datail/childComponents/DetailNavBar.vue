<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="../../../assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item, index) in titles" :key="index"
             class="title-item"
             :class="{active: index == carrentIndex}"
             @click="titleClick(index)"
        >{{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from "../../../components/common/navbar/NavBar";

  export default {
    name: "DetailNavBar",
    components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        carrentIndex: 0, //当前选择到的元素
      }
    },
    methods: {
      //点击导航栏改变对应元素样式
      titleClick(index){
        this.carrentIndex = index;
      },

      //点击返回
      backClick(){
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .title {
    display: flex;
    font-size: 14px;
  }

  .title-item {
    flex: 1;
  }

  .active {
    color: var(--color-high-text);
  }
  .back img{
    margin-top: 11px;
  }
</style>
