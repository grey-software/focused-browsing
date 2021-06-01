<template>
  <a href="" @click="showFeed">
    <div class="button-show-feed">
        <p class="show-feed">
          Show Feed
        </p>
    </div>
  </a>
</template>

<script>
export default {
  name: "ShowFeed",
  data () {
    return{

    }
  }, 
  methods: {
    showFeed(){
      chrome.runtime.sendMessage({intent: "unfocus"});
    }
  }
};
</script>