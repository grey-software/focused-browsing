<template>
  <div class="quote-container">
    <p class="quote">
      <strong class="quote-emphasis-0">"{{this.quote}}"</strong>
    </p>
    <p class="quoter">- {{this.author}}</p>
  </div>
</template>

<script>
import {quoteInfo} from './quoteInfo.js';
export default {
  name: "QuoteContainer",
  data() {
    return{
      quoteInfo: quoteInfo,
      quote: "",
      author: ""
    }
  },

  created() {
    this.setQuote()
  },

  methods: {
    setQuote() {
      let randNum = Math.floor(Math.random() * this.quoteInfo.length)
      this.quote = this.quoteInfo[randNum]['text']
      this.author = this.quoteInfo[randNum]['source']
    }
  }


  
};
</script>
