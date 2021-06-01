<template>
  <div class="card-main">
      <div class="card-content">
          <div class="card-title">
            <CardHeading  />
            <p class="card-subtitle">
              We&#039;ve hidden this website&#039;s
              distracting elements so you can focus on your
              creative and professional goals.
            </p>
            <ButtonGroup />
            <div class="keyboard-shortcut">
              <p class="caption">
                Or press Command/Ctrl&#43;Shift&#43;1 to show/hide
                feed
              </p>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import CardHeading from './Heading/CardHeading.vue'
import ButtonGroup from './ButtonGroup/ButtonGroup.vue'

export default {
  name: "MainCard",
  components: { CardHeading, ButtonGroup}
};
</script>
