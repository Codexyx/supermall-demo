<template>
  <div id="home">
    <!--首页标题导航栏-->
    <nav-bar class="home-nav">
      <div slot="center">{{navTitle}}</div>
    </nav-bar>
    <!--首页分类导航控制,用于做吸顶效果-->
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isFixed"
    ></tab-control>
    <!--scroll: BScroll滚动优化区域
        :probe-type="3" scroll监听滚动类型
        :click="true" 是否阻止父元素原生点击事件
        :pull-up-load="true" 是否监听上拉触底事件
        @scroll="contentScroll" 让scroll组件监听滚动位置传会Home组件，用于判断BackTop显示隐藏
        @pullingUp='loadMore' scroll组件监听上拉加载，传回Home调用加载函数后刷新scroll组件
    -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            :click="true"
            :pull-up-load="true"
            @scroll="contentScroll"
            @pullingUp='loadMore'
    >
      <!--轮播图-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <!--推荐-->
      <recommend-view :recommends="recommends"></recommend-view>
      <!--本周流行-->
      <feature-view></feature-view>
      <!--首页分类导航控制-->
      <tab-control
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
        ref="tabControl2"
        v-show="!isFixed"

      ></tab-control>
      <!--首页商品列表-->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!--回到顶部按钮,组件监听点击事件必须添加修饰符 native：监听组件根元素的原生事件-->
    <back-top @click.native="backClick" v-show="backTopIsShow"></back-top>
  </div>
</template>

<script>
  import {
    getHomeMultidata,
    getHomeGoods
  } from "../../network/home";
  import {debouncs} from "../../common/utils";

  import NavBar from "../../components/common/navbar/NavBar";
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";
  import TabControl from "../../components/content/tabControl/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import Scroll from "../../components/common/scroll/Scroll";
  import BackTop from "../../components/content/backTop/BackTop";

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
        //使用 object[属性名] 的方式取出对象中某个值
        return this.goods[this.currentType].list
      }
    },

    data() {
      return {
        navTitle: '购物街',
        banners: [],  //轮播图列表
        recommends: [],  //推荐栏列表数据
        goods: {    //首页商品数据
          pop: {page: 0, list: []}, //流行
          new: {page: 0, list: []}, //新款
          sell: {page: 0, list: []}, //精选
        },
        currentType: 'pop',   //给tabControl传递的值，用于点击tabControl-item改变首页商品的显示
        backTopIsShow: false, //控制back-top组件的显示隐藏
        tabOffsetTop: 0,      // tabControll滚动到的位置
        isFixed: false    //tabControl显示隐藏，做吸顶
      }
    },

    //生命周期函数，页面加载执行
    created() {
      //1. 请求多个数据
      this.getHomeMultidata(); //这里调用的是methods中的函数

      //请求商品数据
      this.getHomeGoods('pop', 1);
      this.getHomeGoods('new', 1);
      this.getHomeGoods('sell', 1);
    },

    //生命周期函数，页面组件全部加载完成
    mounted() {

      //对于refresh非常频繁调用的问题，进行防抖函数处理 debouncs(被处理函数, 延迟时间[单位毫秒])
      const refresh = debouncs(this.$refs.scroll.refresh, 500);
      //$bus.$on监听事件总线发射的事件
      this.$bus.$on('itemImageLoad', () => {
        refresh();
        /**
         * 监听从GoosListItem组件中的事件总线发射的事件,图片加载完成
         * batter-scroll 在决定有多少区域可滚动时，是根据scrollerHeight属性决定，
         * scrollerHeight属性是根据batter-scroll的content中子组件高度计算的，
         * 在首页中，刚开始计算scrollerHeight属性时，图片没有加载完成，所以计算出来的高度是错误的，
         * 就会出现滚动卡顿bug。
         * 监听每张图片加载是否完成，只要有一张加载完成，都让scroll组件重新计算scrollerHeight高度。
         * 原生js事件：
         *    img.onload = function(){}
         * vue监听： @load='函数'
         * 如何将GoodsListItem组件中的事件传入到Home.vue   (非父子组件通信)
         *    1.vuex，监听全局属性
         *    2.事件总线
         *       -- 实现步骤：
         *          1. main.js:  Vue.prototype.$bus = new Vue(); 创建一个事件总线赋值Vue
         *          2. GoodsListItem组件img标签 @load='函数'
         *          3. GoodsListItem组件通过$bus.$emit('事件名',参数[可选])发射一个事件
         *          4. Home.vue 通过$bus.$on('事件名', 回调函数(参数)) 接受一个事件并调用回调函数
         */
      });
    },

    methods: {
      /**
       * 滚动监听相关函数
       */
      contentScroll(position) {
        //根据当前滚动的y轴坐标决定 backTop 组件是否显示
        //position.y < -1000 ? this.backTopIsShow = true : this.backTopIsShow = false
        this.backTopIsShow = position.y < -1000;
        /**
         * tabControl吸顶效果2. 决定tabControl是否吸顶,
         * 因为 tabOffsetTop 取值是一个正数，position.y是一个负数,就让position的y轴数字取正数
         */

        if(-position.y >= this.tabOffsetTop){
          this.isFixed = true;
        }else{
          this.isFixed = false;
        }

      },

      //上拉加载更多
      loadMore() {
        /**
         * 根据当前显示的商品类型加载更多
         */
        this.getHomeGoods(this.currentType);
      },


      /**
       * 点击事件监听
       */
      //tabControl点击切换首页商品显示
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
          default:
            this.currentType = 'pop';
        }
        /**
         * tabControl吸顶效果3
         * 同步两个tabcontrol的被点击元素状态
         */
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },


      // 点击回到顶部
      backClick() {
        /**访问子组件中的内容或者方法，
         * 通过获取 ref="scroll" 的对象，调用这个对象内部的函数
         scroll.scrollTo(x轴坐标, y轴坐标, 滚动时长单位毫秒)
         */
        this.$refs.scroll.scrollTo(0, 0, 1500);
      },


      /**
       * 网络请求相关函数
       */
      getHomeMultidata() {
        //这里调用的是从home.js中import进来的函数
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        });
      },

      getHomeGoods(type) {
        //从data的goods对象中动态获取page的值
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          /**
           * 从res.data.list中解构，
           * push到对应的商品类型的list中
           */
          this.goods[type].list.push(...res.data.list);
          //然后商品数据对象页码自增，下次请求下页数据直接使用这个页码
          this.goods[type].page += 1;
          //刷新上拉加载事件，否则上拉加载只会执行一次
          this.$refs.scroll.finishPullUp();
        })
      },

      swiperImageLoad() {
        /**
         * tabControl吸顶效果1.
         *    获取滚动到多少，开始有吸顶效果, 在swiper组件中图片加载完成后执行
         *    获取tabControl的offsetTop，
         *    所有组件都有一个属性 $el: 用于获取组件中的元素,
         *    在获取元素的 offsetTop属性,如果在mounted中获取这个值，获取到的值不一定是正确的，
         *    因为组件挂在完毕，图片不一定加载完毕
         */
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
        /**
         * 2.监听滚动，动态改变tabControl样式
         */

      }

    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }



  /*.content {*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/
</style>
