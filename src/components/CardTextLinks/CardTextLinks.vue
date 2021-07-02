<template>
   <div class="icon-links-container">
      <div href="" @click="openFocusedBrowsing" class="icon-info">
        <img
          alt=""
          class="vector"
          src="https://static.overlay-tech.com/assets/57485783-83a5-44a7-abd5-fbbbd06cfed3.svg"
        />
      </div>
      <div class="icon-feedback">
        <img
          alt=""
          class="vector"
          src="https://static.overlay-tech.com/assets/0aa720de-a634-4b15-9925-9eed289901ff.svg"
        />
      </div>
      <a href="" @click="openGrey" class="link-logo"
        ><div class="icon-logo">
          <img
            alt=""
            class="group"
            src="https://static.overlay-tech.com/assets/84d9f9eb-e33b-487d-bf62-5544ad441970.svg"
          /><img
            alt=""
            class="group"
            src="https://static.overlay-tech.com/assets/fb68b570-b91b-46c5-a932-3e7879774c10.svg"
          /></div
      ></a>
    </div>
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