<template lang="pug">
  div.footer-mini-wrap
    span WhistleFarm is crafted by&nbsp
    a(href="https://sheey.moe" target="_blank") sheey
    span &nbspwith&nbsp
    HeartTwoTone(twoToneColor="#eb4f34" :spin="spin" @click="() => this.spin = !this.spin" style="cursor:default;")
</template>

<script>
import { HeartTwoTone } from '@ant-design/icons-vue'
export default {
  components: {
    HeartTwoTone
  }
}
</script>

<style scoped>
.footer-mini-wrap {
  color: #929292;
}
</style>
