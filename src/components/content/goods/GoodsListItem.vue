<template>
  <div class="goods-item">
    <!--@load="imageLoad" 这个函数用于监听图片加载完成
        @load是vue中自带的一个属性
    -->
    <img :src="goodsItem.show.img" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItem",
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      //监听图片加载完成
      imageLoad() {
        /**
         * 使用事件总线发射一个事件，
         * 用于监听图片加载完成让scroll重新计算可滚动区域高度
         * 解决滚动卡顿bug
         * this.$bus.$emit('itemImageLoad'); 发射事件
         */
        this.$bus.$emit('itemImageLoad');
      }
    }
  }
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("../../../assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>
