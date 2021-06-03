<template>
  <div class="card-text-links">
    <a href="" @click="openGrey" class="about-grey"> 
      <p class="about">About Grey Software</p>
    </a>
    
    <a href="" @click="openFocusedBrowsing">
      <p class="about">About Focused Browsing</p>
    </a>
  </div>
</template>

<script>
export default {
  name: "CardTextLinks",
  data () {
    return{

    }
  }, 
  methods: {
    openGrey(){
      window.open("https://org.grey.software/");
    },
    openFocusedBrowsing(){
      window.open("https://org.grey.software/focused-browsing/")
    }

  }
};
</script>