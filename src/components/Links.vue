<template>
  <div class="icon-links-container">
    <a href="https://org.grey.software/focused-browsing/" target="_blank" class="link-logo">
      <div class="icon-info">
        <img alt="" class="vector" src="/html/assets/icons/icon-info.svg" />
      </div>
    </a>
    <a href="https://github.com/grey-software/focused-browsing/issues/new/choose" target="_blank" class="link-logo">
      <div class="icon-feedback">
        <img alt="" class="vector" src="/html/assets/icons/icon-feedback.svg" />
      </div>
    </a>
    <a href="https://org.grey.software/focused-browsing/" target="_blank" class="link-logo">
      <div class="icon-logo">
        <img alt="" class="vector" src="/html/assets/icons/icon-logo.svg" />
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Links',
  data() {
    return {}
  },
  methods: {
    openGrey() {
      window.open('https://org.grey.software/')
    },
    openFeedback() {
      window.open('https://github.com/grey-software/focused-browsing/issues/new/choose')
    },
    openFocusedBrowsing() {
      window.open('https://org.grey.software/focused-browsing/')
    },
  },
}
</script>
