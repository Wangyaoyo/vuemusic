<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="getQuery"></search-box>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from "api/search";
  import {ERR_OK} from "api/config";

  export default {
    components: {
      SearchBox
    },
    created() {
      this._getHotKey()
    },
    data() {
      return {
        hotKey:[]
      }
    },
    methods: {
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data);
            this.hotKey = res.data
          }
        })
      },
      getQuery() {

      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .search
    .search-box-wrapper
      margin: 20px
</style>
