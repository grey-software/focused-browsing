<template>
  <a href="" @click="openSupport">
    <div class="button-support">
        <p class="support-this-project">
          Support this project
        </p>
    </div>
  </a>
</template>

<script>
export default {
  name: "Support",
  data () {
    return{

    }
  }, 
  methods: {
    openSupport(){
      window.open("https://github.com/sponsors/grey-software");
    }
  }
};
</script>