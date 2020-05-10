<template>
  <!--
    ref 如果是绑定在组件中的，通过 this.$refs.refNmae 获取到一个组件对象
    ref 如果是绑定在普通元素中的，那么通过 this.$refs.refNmae 获取到的是一个元素对象
  -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      click: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      /**
       * 普通元素绑定了 ref属性，可以通过
       *  this.$refs.refname 获取一个普通元素对象
       */
      const wrapper = this.$refs.wrapper;
      //1.创建BScroll对象
      this.scroll = new BScroll(wrapper, {
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        click: this.click
      });

      //2.监听滚动位置
      this.scroll.on('scroll', (position) => {
        //向外发送自定义事件,在父组件中使用该组件的时 添加 @scroll='自定是事件'
        this.$emit('scroll', position);
      });


      //监听上拉事件,scroll滚动到底部
      if(this.pullUpLoad){
        this.scroll.on('pullingUp', ()=>{
          this.$emit('pullingUp');
          //重置上拉事件
          //this.finishPullUp();
        })
      }

      //解决滚动卡顿，让BSscroll重新计算item总高度
      this.scroll.refresh();

    },
    methods: {
      // 回到顶部
      scrollTo(x, y, time = 1000) {
        this.scroll && this.scroll.scrollTo(x, y, time);
      },

      // 上拉触底后重置上拉事件
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      // 滚动区域内图片加载完成后重新计算整个可滚动区域的高度
      refresh(){
        // 逻辑与，解决refresh函数找不到的bug，如果scroll组件没有加载完成，则不调用refresh函数
        this.scroll && this.scroll.refresh();
      }
    }
  }
</script>

<style scoped>

</style>
