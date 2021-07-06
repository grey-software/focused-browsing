<template>
  <div class="card-main">
    <div class="card-content">
      <div class="title-container">
        <CardHeading />
        <p class="card-subtitle">
          We&#039;ve hidden this website&#039;s distracting elements so you can focus on your creative and professional
          goals.
        </p>
      </div>
      <ButtonGroup />
    </div>
    <div class="shortcut-container">
      <p class="shortcut-caption">
        Or
        <strong class="shortcut-caption-emphasis-1">Shift &#43; F &#43; B</strong
        ><strong class="shortcut-caption-emphasis-2"> </strong> to show/hide the feed
      </p>
    </div>
  </div>
</template>

<script>
import CardHeading from './CardHeading.vue'
import ButtonGroup from './ButtonGroup.vue'
export default {
  name: 'MainCard',
  components: { CardHeading, ButtonGroup },
}
</script>
