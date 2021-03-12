<template lang="pug">
.footer
  span.footer-left WHISTLE FARM
  .footer-right
    span Crafted by&nbsp
    a(href="https://sheey.moe" target="_blank") sheey
    span &nbspwith&nbsp
    HeartTwoTone(twoToneColor="#eb4f34" :spin="spin" @click="() => this.spin = !this.spin" style="cursor:default;")
</template>

<script>
import { HeartTwoTone } from '@ant-design/icons-vue'
export default {
  components: {
    HeartTwoTone
  },
  data () {
    return {
      spin: false
    }
  }
}
</script>

<style scoped>
.footer {
  width: 100%;
  padding: 20px 50px;
  background: #fff;
  color: rgb(36, 36, 36);
}

.footer-left {
  font-weight: 600;
}

.footer-right {
  font-weight: 600;
  float: right;
}
</style>
