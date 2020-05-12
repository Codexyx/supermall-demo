<template>
  <div id="app">
    <!--
      keep-alive包裹，让路由离开页面再回到页面时，这个页面不会被销毁，也不会被重新创建，
      记录离开页面时的位置
    -->
    <keep-alive exclude="Datail">
      <router-view></router-view>
    </keep-alive>

    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
  import MainTabBar from "./components/content/maintabbar/MainTabBar";
  export default {
    name: 'App',
    components: {
      MainTabBar
    }

  }
</script>

<style>
  @import "assets/css/base.css";
</style>
