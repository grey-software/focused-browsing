<template>
  <div id="q-app">
    <button v-on:click="hideFeed">{{enable}}</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      focus: false,
      enable: 'focus',
      activate: false
    }
  },
  created(){
    this.$q.bex.on('bex.toggle.toolbar', this.toggleToolbar)
    this.$q.bex.on('bex.tab.opened', this.doOnTabOpened)
  },
  beforeUnmount(){
    this.$q.bex.off('bex.toggle.toolbar', this.toggleToolbar)
    this.$q.bex.off('bex.tab.opened', this.doOnTabOpened)
  },
  methods:{
    toggleToolbar(url){
        console.log("about to enter activation/deactivation")
        let activate = this.activate
        this.activate = !this.activate
        console.log("currently activate is"  + activate)
        this.$q.bex.send('activateFocus', {openExtension: activate}).then(r => {
          console.log('Text has been highlighted')
        })
    },

    doOnTabOpened (url) {
      console.log('New Browser Tab Openend: ', url)
    },

    hideFeed(){
      this.$q.bex.send(this.enable)
      this.focus = !this.focus
      if(this.focus){
        this.enable = 'un-focus'
      }else{
        this.enable = 'focus'
      }

    }
  }
}

</script>
<style>
#q-app {
  background-color:red;
  color:white;
  margin:5px;
  padding-left: 3px;
  border:1px solid white;
  height:100px;
}
</style>
