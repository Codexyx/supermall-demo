<template>
  <div id="home">
    <!--首页标题导航栏-->
    <nav-bar class="home-nav">
      <div slot="center">{{navTitle}}</div>
    </nav-bar>
    <!--scroll: BScroll滚动优化区域
      @pullingUp='loadMore'
    -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            :click="true"
            :pull-up-load="true"
            @scroll="contentScroll"
    >
      <!--轮播图-->
      <home-swiper :banners="banners"></home-swiper>
      <!--推荐-->
      <recommend-view :recommends="recommends"></recommend-view>
      <!--本周流行-->
      <feature-view></feature-view>
      <!--首页分类导航控制-->
      <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>
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
        //给tabControl传递的值，用于点击tabControl-item改变首页商品的显示
        currentType: 'pop',
        //控制back-top组件的显示隐藏
        backTopIsShow: false
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

    methods: {
      /**
       * 滚动监听相关函数
       */
      contentScroll(position) {
        //根据当前滚动的y轴坐标决定 backTop 组件是否显示
        //position.y < -1000 ? this.backTopIsShow = true : this.backTopIsShow = false
        this.backTopIsShow = position.y < -1000
      },

      //上拉加载更多
      // loadMore() {
      //   /**
      //    * 调用之前的网络请求函数，加载下一页数据，
      //    * 这个函数内部会把页码自增，
      //    * 所以拿到的一定是下一页数据
      //    * */
      //   this.getHomeGoods(this.currentType);
      //   // TODO 上拉加载更多
      //
      // },


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
          //刷新上拉加载事件，否则上拉加载只会执行一 peizh
          //this.$refs.scroll.finishPullUp();
        })
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
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content {*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/
</style>
