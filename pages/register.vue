<template lang="pug">
  .container
    a-card.register-card(title="注册账号")
      Logo(style="max-width: 50%; margin-bottom: 50px")
      a-form.register-form(:model="formState")
        a-form-item(required name="username" has-feedback)
          a-input.username-input(placeholder="用户名" v-model:value="formState.userName" size="large")
            template(slot="prefix")
                user-outlined(type="user")
          span.tip 用户名由 6-16 个数字或字符组成
        a-form-item(name="email" has-feedback)
          a-input.email-input(placeholder="邮箱" v-model:value="formState.email" size="large")
            template(slot="prefix")
                mail-outlined(type="user")
        a-form-item(name="password" has-feedback)
          a-input-password.password-input(placeholder="密码" v-model:value="formState.password" size="large")
            template(slot="prefix")
                lock-outlined
          span.tip 密码为 8-32 位，至少有一个字母和数字
        a-form-item(name="passwordrepeat" has-feedback)
          a-input-password.password-repeat-input(placeholder="重复密码" v-model:value="formState.passwordRepeat" size="large")
            template(slot="prefix")
                lock-outlined
          span.tip 再输一遍
        a-form-item(name="password" has-feedback)
          a-input.invitation-code-input(placeholder="邀请码" v-model:value="formState.password" size="large")
            template(slot="prefix")
                ContainerOutlined
          span.tip 暂时开放注册，可以不填
        a-form-item
          a-button(type="primary" style="width: 100%; margin-top: 20px" size="large" @click="register") 注册
          a-button(type="link" style="width: 100%; margin-top: 0" @click="gotoLogin") 已有账号？前往登陆
      FooterMini
</template>

<script>
import { UserOutlined, LockOutlined, MailOutlined, ContainerOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  components: {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    ContainerOutlined
  },
  data () {
    return {
      formState: {
        userName: '',
        email: '',
        password: '',
        passwordRepeat: ''
      }
    }
  },
  head () {
    return {
      title: 'WhistleFarm - 注册'
    }
  },
  methods: {
    gotoLogin () {
      this.$router.push('/')
    },
    register () {
      if (this.formState.username === '' || this.formState.email === '' || this.formState.password === '') {
        message.error('搁这耍猴呢？')
        return
      }

      if (this.formState.password !== this.formState.passwordRepeat) {
        message.error('两次密码不一样(*╹▽╹*)')
        return
      }

      this.$axios.post('https://api.farm.sheey.moe/auth/register', {
        username: this.formState.userName,
        password: this.formState.password,
        email: this.formState.email
      })
        .then((res) => {
          message.success('注册成功, 3 秒后跳转登录页面')
          setTimeout(() => {
            this.$router.push('/')
          }, 3000)
        })
        .catch((e) => {
          if (e.response && e.response.data) {
            message.error(e.response.data.msg)
          } else {
            message.error(e.message)
          }
        })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
}

.register-card {
  margin: auto;
  height: fit-content;
  width: 600px;
  text-align: center;
}

.register-form {
  padding: 0 125px 30px 125px;
  text-align: left;
}

.register-form > * {
  margin: 10px;
}

span.tip {
  line-height: 20px;
  margin: 0 0 0 20px;
  display: block;
  color: #999;
  float: left;
  font-size: 12px;
}

@media screen and (max-width: 500px) {
  .register-form {
    padding: 0 50px 30px 50px;
    text-align: left;
  }

  .container {
    padding: 0;
    margin: auto;
  }
}

@media screen and (max-width: 400px) {
  .register-form {
    padding: 0 0 30px 0;
    text-align: left;
  }
}
</style>
