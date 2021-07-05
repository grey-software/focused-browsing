<template>
  <div class="popup-container">
    <div class="title-container">
      <p class="title">Focused Browsing</p>
    </div>
    <img
      alt=""
      class="illustration-yoga"
      src="/www/assets/illustration-yoga.svg"
    />
    <p class="press-shift-f-b-to-show-or-hide-the">
      Press
      <strong
        class="press-shift-f-b-to-show-or-hide-the-emphasis-1"
        >Shift &#43; F &#43; B
      </strong>
      to show or hide the feed.
    </p>
    <img
      alt=""
      class="vector-3"
      src="https://static.overlay-tech.com/assets/a83a9619-8245-4d91-b98f-0792bf492dd9.svg"
    />
    <div class="icon-links-container">
      <a href="" @click="openFocusedBrowsing" class="link-logo">
        <div class="icon-info">
          <img
            alt=""
            class="vector"
            src="https://static.overlay-tech.com/assets/a23b20b0-fd2e-47e4-9bc8-f55b1f1b5dd4.svg"
          />
        </div>
      </a>
      <a href="" @click="openFeedback" class="link-logo">
        <div class="icon-feedback">
          <img
            alt=""
            class="vector"
            src="https://static.overlay-tech.com/assets/b8735c59-781a-4098-abdf-550bbd97b402.svg"
          />
        </div>
      </a>
      <a href="" @click="openGreySoftware" class="link-logo"
        ><div class="icon-logo">
          <img
            alt=""
            class="group-two"
            src="https://static.overlay-tech.com/assets/415a0d6e-e086-48f4-bd98-a8730d3356cf.svg"
          /><img
            alt=""
            class="group-two"
            src="https://static.overlay-tech.com/assets/7224e318-bec7-499a-a0e6-3938058429b3.svg"
          /></div
      ></a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popup",
  data () {
    return{

    }
  }, 
  methods: {
    openGrey(){
      window.open("https://org.grey.software/");
    },
    openFeedback(){
      window.open("https://github.com/grey-software/focused-browsing/issues/new/choose")
    },
    openFocusedBrowsing(){
      window.open("https://org.grey.software/focused-browsing/")
    }

  }
};
</script>

<style lang="scss" scoped>
</style>