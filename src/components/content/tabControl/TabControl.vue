<template>
  <div class="tab-control">
    <div class="tab-content-item"
         v-for="(item, index) in titles" :key="index"
         :class="{active: index === currentIndex}"
         @click="itemClick(index)"
    >
      <!--动态绑定style-->
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    props: {
      titles: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        //当前选中的元素
        currentIndex: 0
      }
    },
    methods: {

      itemClick(index) {
        //当点击选中某个元素时，当前元素的样式改变
        this.currentIndex = index;
        /**
         * 并改变相应的商品展示 $emit(): 子组件向父组件传递信息
         * 指向Home.vue <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>
         * 这里的 @tabClick就是 $emit()中第一个参数
         * index是传递给父组件中 @tabClick="tabClick" 这个函数的参数
         * 在父组件的 methods 中实现这个 "tabClick" 函数
         */
        this.$emit('tabClick', index);
      }
    }
  }
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
  }

  .tab-content-item {
    flex: 1;
  }

  .tab-content-item span {
    padding: 5px;
  }

  /*span动态绑定的样式，显示当前选择或者正处于的元素*/
  .active {
    color: var(--color-high-text);
  }

  .active span {
    font-weight: bold;
    border-bottom: 3px solid var(--color-tint);
  }
</style>
