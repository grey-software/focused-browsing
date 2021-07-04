<template>
<div class="buttons-container">
  <a href="" @click="openSupport">
    <div class="button-support">
      <p class="support-this-project">
        Support this project
      </p>
    </div>
  </a>
  <a href="" @click="showFeed">
    <div class="button-show-feed">
      <p class="show-feed">Show feed</p>
    </div>
  </a>

</div>
</template>

<script>
export default {
  name: "ButtonGroup",
  data () {
    return{

    }
  }, 
  methods: {
    showFeed(){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {text: "unfocus from vue"});
      });
    },
    openSupport(){
      window.open("https://github.com/sponsors/grey-software");
    }
  }
};

</script>

<style lang="scss" scoped>

</style>