<template>
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      This page is loaded from the {{ name }}
    </h1>
    <h2 class="info" v-if="name === 'client'">
      Please refresh the page
    </h2>
    <nuxt-link class="button" to="/">
      Home page
    </nuxt-link>
  </section>
</template>
<script>
import {mapState} from 'vuex'
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: `About Page (${this.name}-side)`
    }
  },
  beforeMount(){
    const wx=window.wx
    const url=window.location.href

    this.$store.dispatch('getWechatSignature',url)
      .then(res=>{
        if(res.data.success){
          const params=res.data.params
          wx.config({
            debug:true,
            appId:params.appId,
            timestamp:params.timestamp,
            nonceStr:params.nonceStr,
            signature:params.signature,
            jsApiList:[
              'chooseImage',
              'onMenuShareTimeline',
              'previewImage',
              'uploadImage',
              'downloadImage',
              'hideAllNonBaseMenuItem',
              'showMenuItems'
            ]

          })
          wx.ready(()=>{
            wx.hideAllNonBaseMenuItem()
            console.log('success')
          })
        }
      })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
