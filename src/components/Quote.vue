<template>
  <div class="quote-container">
    <p class="quote">"{{ this.quote }}"</p>
    <p class="quoter">- {{ this.author }}</p>
  </div>
</template>

<script>
import quotes from '../ts/vue/quotes.ts'
export default {
  name: 'Quote',
  data() {
    return {
      quotes: quotes,
      quote: '',
      author: '',
    }
  },

  created() {
    this.setQuote()
  },

  methods: {
    setQuote() {
      let randNum = Math.floor(Math.random() * this.quotes.length)
      this.quote = this.quotes[randNum]['text']
      this.author = this.quotes[randNum]['source']
    },
  },
}
</script>
