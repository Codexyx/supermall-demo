<template>
  <div id="tab-bar">
    <!--预留这个插槽用于放置tabbar-item-->
    <slot></slot>
  </div>
</template>

<script>
    export default {
        name: "TabBar",
    }
</script>

<style scoped>
  #tab-bar{
    z-index: 10;
    display: flex;
    background-color: #f6f6f6;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    /*tabbar上边框阴影*/
    box-shadow: 0 -3px 1px rgba(100, 100, 100, .2);
  }

</style>
