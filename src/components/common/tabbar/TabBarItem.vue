<template>
  <div class="tab-bar-item" @click="itemClick">
    <!--isActice用于判断当前路由是否处于活跃状态-->
    <div v-if="!isActive">
      <!--具名插槽-->
      <slot name="item-icon" ></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active" ></slot>
    </div>
    <!--动态绑定css,计算属性-->
    <div :style="activeStyle">
      <slot name="item-text" ></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    data(){
      return {

      }
    },
    props:{ //从子组件传入的属性
      path: String,
      activeColor: {  //从子组件传过来的选中状态的tabbat-item的颜色值
        type: String,
        default: 'red'  //如果没有传，则默认red
      }
    },
    computed:{
      isActive(){
        return this.$route.path.indexOf(this.path) !== -1;
      },
      activeStyle(){
        return this.isActive ? {color: this.activeColor} : {}
      }
    },
    methods:{
      itemClick(){
        this.$router.replace(this.path);
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }

  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    /*把此元素放置在父元素的中部。*/
    vertical-align: middle;
    margin-bottom: 2px;
  }


</style>
