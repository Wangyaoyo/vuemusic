<template>
<div ref="wrapper">
  <slot></slot>
</div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'

    export default {
      props:{
        /* 1：滚动时非实时派发scroll事件 2：滚动时实时 3：包括动画运行时*/
        probeType:{
          type:Number,
          default:1
        },
        isClick:{
          type:Boolean,
          default:true
        },
        data:{
          type:Array,
          default:null
        },
        listenScroll:{
          type:Boolean,
          default:false
        }
      },
      mounted(){
        setTimeout(() => {
          this._initScroll()
        },20)
      },
      methods:{
        _initScroll(){
          if(!this.$refs.wrapper){
            return
          }
          this.scroll = new BScroll(this.$refs.wrapper,{
            probeType:this.probeType,
            click:this.isClick
          })

          if(this.listenScroll){
            let me = this
            this.scroll.on('scroll',(pos) => {
              me.$emit('scroll',pos)
            })
          }
        },
        refresh(){
          this.scroll && this.scroll.refresh()
        },
        enable(){
          this.scroll && this.scroll.enable()
        },
        disable(){
          this.scroll && this.scroll.disable()
        },
        scrollTo() {
          this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
          this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
      },
      watch:{
        /* 监控data的变化 */
        data(){
          setTimeout(() => {
            this.refresh()
          },20)
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
