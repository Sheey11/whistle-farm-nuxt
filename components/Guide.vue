<template lang="pug">
  a-modal(v-model:visible="modalVisiable" width="1000px" title="欢迎来到微哨农场" :footer="null" :maskClosable="false")
    a-steps(:current="stepId" type="navigation")
      a-step
        template(#title) 欢迎
      a-step(title="绑定微哨账号")
      a-step(title="填写打卡信息")
      a-step(title="完成")
    .content
      .welcome(v-if="stepId === 0")
        RocketTwoTone(style="font-size: 96px")
        h3(style="margin-top: 24px") 这个教程将带你完成打卡设置。
        a-button(type="primary" @click="() => stepId = 1" size="large" style="margin-top: 20px; width: 100px;") 开始
      .whistle-account(v-else-if="stepId === 1")
        div(style="width: 50%")
          a-form(layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 15 }" style="height: fit-content;")
            a-form-item(label="用户名/学号" required)
              a-input(v-model="whistleUsername")
            a-form-item(label="密码" required)
              a-input-password(v-model="whistlePassword")
            a-form-item(:wrapper-col="{ span: 15, offset: 8 }")
              a-button(type="primary" @click="saveWhistleCredential" :loading="whistleCredentialSaving") {{ this.saveWhistleCredentialText }}
        .split
        div(style="width: calc(50% - 11px); margin-left: 10px")
          h2 常见绑定问题
          ul
            li
              h4 提示“请在微哨打开”？
              p 在 <a href="http://web.weishao.com.cn/login" target="_blank"> 微哨网页端 </a>登陆，至少进入网页版打卡一次之后（点击在新窗口打开），再回来绑定。
            li
              h4 提示“验证码错误“？
              p 多次登录失败导致需要验证码，请在 <a href="http://web.weishao.com.cn/login" target="_blank"> 微哨网页端 </a>登陆一次，再回来绑定。
      .questionnaire-fill(v-else-if="stepId === 2")
        a-alert(message="自动填写说明" type="warning" show-icon)
          template(#description)
            p
              | 微哨的打卡是以问卷的方式发布，也就是说每天填写的其实是一个问卷，问卷的内容就是每天打卡的内容。
              <br/>
              | 在微哨农场填写问卷并保存后，农场将在每天早上 8 点，以保存的问卷为模板自动提交打卡信息。
        a-button(type="primary" style="margin: 50px auto 0 auto; display: block;" @click="() => { $emit('click', false); $emit('showQuestionnairList') }") 前往填写问卷

</template>

<script>
import {
  RocketTwoTone,
  RightOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  name: 'Guide',
  components: {
    RocketTwoTone,
    RightOutlined
  },
  model: {
    prop: 'modalVisiable',
    event: 'click'
  },
  props: {
    modalVisiable: Boolean
  },
  data () {
    return {
      stepId: 0,
      whistleUsername: '',
      whistlePassword: '',
      whistleCredentialSaving: false,
      saveWhistleCredentialText: '保存'
    }
  },
  methods: {
    saveWhistleCredential () {
      if (this.whistleUsername.length < 5 || this.whistlePassword.length < 5) {
        message.error('能不能认真点啊')
      } else {
        this.saveWhistleCredentialText = '登陆微哨中...'
        this.whistleCredentialSaving = true
        this.$axios.post('https://api.farm.sheey.moe/whistle/enroll', {
          username: this.whistleUsername,
          password: this.whistlePassword
        })
          .then((res) => {
            message.success('绑定成功')
            this.saveWhistleCredentialText = '保存'
            this.whistleCredentialSaving = false
            this.$auth.fetchUser()
            this.stepId = 2
          })
          .catch((e) => {
            if (e.response.data) {
              message.error('微哨登录失败: ' + e.response.data.msg)
            } else {
              message.error(e.message)
            }
            this.saveWhistleCredentialText = '保存'
            this.whistleCredentialSaving = false
          })
      }
    }
  }
}
</script>

<style scoped>
.content {
  display: flex;
  margin-top: 24px;
  height: 30vh;
  min-height: 300px;
  width: 100%;
}

.welcome {
  vertical-align: middle;
  text-align: center;
  margin: auto;
}

.whistle-account {
  display: flex;
  flex-direction: row;
  margin: auto;
  width: 90%;
  align-items: center;
}

.split {
  height: 175px;
  width: 0.5px;
  background: #ddd;
}

.questionnaire-fill {
  margin: auto;
}
</style>
