<template lang="pug">
  .container
    .intro
      Logo(style="margin-bottom: 20px")
      h2(style="margin: 20px 0") 欢迎使用微哨农场？
      p 微哨农场是一个
      ul
        li 全自动化填写和管理微哨的平台。
      p 它能够
      ul
        li 全自动化填写。
        li 自助启用、禁用。
        li 每天通过微信消息推送填写状态。
      p 如何使用/怎么使用？
      ol
        li
          NuxtLink(to="/register") 注册
          span 一个账号。
        li 绑定微哨账号。
        li 填写模板并保存。
        li (可选)绑定微信接收消息通知。
      p 会收费吗？
      ul
        li 不会收费。
        li 以后会通过邀请码制度限制注册。
      .action-btns
        a-button.action-btn(type="primary" size="large")
          NuxtLink(to="/register") 注册
        a-button.action-btn(size="large")
          NuxtLink(to="/login") 登陆
</template>

<script>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  components: {
    UserOutlined,
    LockOutlined
  },
  data () {
    return {
      formState: {
        userName: '',
        password: '',
        rememberme: false
      },
      loginButtonEnabled: false,
      loading: false
    }
  },
  head () {
    return {
      title: 'WhistleFarm - 登陆'
    }
  },
  mounted () {
    if (this.$auth.loggedIn) {
      this.$router.push('/admin')
    }
  },
  methods: {
    gotoRegister () {
      this.$router.push('/register')
    },
    refreshLoginButtonStatus () {
      const usernameValid = this.formState.userName !== ''
      const passwordValid = this.formState.password !== ''
      this.loginButtonEnabled = usernameValid && passwordValid
    },
    async login () {
      if (this.formState.userName === '' || this.formState.password === '') { return }

      try {
        this.loading = true
        await this.$auth.loginWith('local', {
          data: {
            username: this.formState.userName,
            password: this.formState.password
          }
        })
        this.$router.push('/admin')
      } catch (e) {
        if (e.response && e.response.data) {
          message.error(e.response.data.msg)
        } else {
          message.error(e.message)
        }
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
}

.intro {
  padding: 20px 150px;
}

.action-btns {
  margin: 0 -50px;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  width: calc(100% + 100px);
}

.action-btn {
  width: 45%;
}

@media screen and (max-width: 700px) {
  .intro {
    padding: 20px 100px;
  }
}

@media screen and (max-width: 500px) {
  .container {
    padding: 0;
    margin: auto;
  }

  .intro {
    padding: 20px 50px;
  }
}

@media screen and (max-width: 350px) {
  .intro {
    padding: 20px 20px;
  }

  .action-btns {
    margin: 0 -10px;
    margin-top: 30px;
    width: calc(100% + 20px);
  }
}
</style>
