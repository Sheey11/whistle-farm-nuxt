<template lang="pug">
  a-layout.root-layout
    a-layout-sider.desktop-only(width="200" v-model:collapsed="collapsed" style="background: #fff")
      Logo(style="margin: 25%")
      a-menu(mode="inline" v-model:selectedKeys="menuSelectedKey")
        a-menu-item(key="1")
          client-only
            SettingTwoTone
          span 账号信息
        a-menu-item(key="2")
          client-only
            SnippetsTwoTone
          span 问卷列表
        a-menu-item(key="3")
          client-only
            QuestionCircleTwoTone
          span 帮助
    a-layout
      a-drawer.nav-drawer.mobile-only(placement="left" :closable="false" :visible="drawerVisible" @close="() => drawerVisible = false")
        template(#title)
          Logo(style="margin: 25%")
        a-menu(mode="inline" v-model:selectedKeys="menuSelectedKey" @select="() => drawerVisible = false")
          a-menu-item(key="1")
            client-only
              SettingTwoTone
            span 账号信息
          a-menu-item(key="2")
            client-only
              SnippetsTwoTone
            span 问卷列表
          a-menu-item(key="3")
            client-only
              QuestionCircleTwoTone
            span 帮助
      a-layout-header
        client-only
          menu-unfold-outlined.desktop-only(v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)")
          menu-fold-outlined.desktop-only(v-else class="trigger" @click="() => (collapsed = !collapsed)")
          MenuOutlined.mobile-only(@click="() => drawerVisible = true")
        a-dropdown(@click.prevent)
          .user-info(style="float: right;")
            span(style="font-weight: 600; margin-right: 10px") {{ this.$auth.loggedIn ? this.$auth.user.username : "" }}
            a-avatar(:src="this.$auth.user ? this.$auth.user.avatar : ''")
          template(#overlay)
            a-menu
              a-menu-item(@click="logout")
                client-only
                  CloseCircleTwoTone(twoToneColor="#ff2f96")
                span 退出
      a-layout-content
        .content-wrap.whistle-settings(v-if="menuSelectedKey == '1'")
          a-card.card.shadow(title="当前微哨账号信息")
            div(v-if="displayWhistleInfo" style="display: flex; flex-direction: row;")
              a-avatar.whistle-info-avatar.large-avatar(
                shape="square"
                :src="this.$auth.user ? this.$auth.user.avatar : ''"
                :size="128") {{  displayWhistleInfo ? this.whistleUserInfo.realname.substring(0, 1) : "" }}
              .whistle-info-wrap(style="display: inline; margin-left: 12px;")
                  a-descriptions(title="账号信息")
                    a-descriptions-item(label="姓名") {{ displayWhistleInfo ? this.whistleUserInfo.realname : "" }}
                    a-descriptions-item(label="学号") {{ displayWhistleInfo ? this.whistleUserInfo.stuCode : ""}}
                    a-descriptions-item(label="性别") 可爱的{{ this.whistleUserInfo.gender === 'boy' ? '男孩子' : '女孩子' }}
                    a-descriptions-item(label="学院") {{ displayWhistleInfo ? this.whistleUserInfo.org.replace(/&\d+/g, '').replace(/行政组织架构\//, '').replace(/\//g, ' -> ') : ""}}
            div(v-else)
              span 当前未绑定账号
          a-card.card.shadow(title="微哨农场账号信息")
            client-only
              table.whistle-farm-info
                tr
                  td.table-col-info 用户名
                  td {{ this.$auth.loggedIn ? this.$auth.user.username : "" }}
                tr
                  td.table-col-info 邮箱
                  td {{ this.$auth.loggedIn ? this.$auth.user.email : "" }}
          a-card.card.shadow(title="消息通知")
            p 绑定微信来接收打卡结果通知
            p 当前绑定状态： {{ this.wxPusherBinded ? "已绑定" : "未绑定" }}
            p(v-if="wxPusherBinded") Uid: {{ this.wxPusherUid }}
            img(v-if="!wxPusherBinded" :src="wxQRCodeUrl" style="margin: 0 auto; height: 128px; width: 128px;")
          a-card.card.shadow(title="绑定微哨账号")
            p 如果绑定遇到问题，请查看左边的帮助中心。
            a-form(layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" style="height: fit-content;")
              a-form-item(label="用户名/学号" required)
                a-input(v-model="whistleUsername")
              a-form-item(label="密码" required)
                a-input-password(v-model="whistlePassword")
              a-form-item(:wrapper-col="{ span: 15, offset: 7 }")
                a-button(type="primary" @click="saveWhistleCredential" :loading="whistleCredentialSaving") 保存
          a-card.card.shadow(title="修改密码")
            a-form(layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" style="height: fit-content;")
              a-form-item(label="当前密码" required)
                a-input(v-model="currentPassword")
              a-form-item(label="新密码" required)
                a-input(v-model="newPassword")
              a-form-item(label="再输一次" required)
                a-input(v-model="newPasswordRepeat")
              a-form-item(:wrapper-col="{ span: 15, offset: 7 }")
                a-button(type="primary" @click="changePassword" :loading="changePasswordLoading") 修改密码
        .questionnaire(v-if="menuSelectedKey == '2'")
          a-card.card(v-if="displayWhistleInfo" title="问卷列表" style="min-height: 100%")
            p 点击问卷来填写和查看自动填写情况
            a-card.shadow(v-for="item in questionnaireData" :key="item.questionid" style="cursor: pointer;" @click="() => displayQuestionnaireInfo(item.qid)")
              CarryOutTwoTone
              span(style="margin-left: 6px;") {{ item.title }}
            a-modal(v-model:visible="questionnaireModalVisible" :title="selectedQuestionnaireTitle" width="75%" :footer="null" style="top: 20px" :maskClosable="false")
              a-spin(size="large" :spinning="questionnaireDetailLoading")
                h1 {{ questionnaireDetail.activity_title }}
                a-collapse(activeKey="1")
                  a-collapse-panel(key="1" header="问卷信息")
                    p {{ questionnaireDetail.activity_content }}
                  a-collapse-panel(key="2" header="问题列表")
                    a-list(item-layout="horizontal" :data-source="questionnaireDetail.question_list")
                      a-list-item(slot="renderItem" slot-scope="item, index" :key="index")
                        .question-content(style="width: 100%;")
                          h3(style="margin: 0") {{ (index + 1) }}. {{ item.question_title }}
                          p(style="color: #888; font-size: 12px;") {{ item.question_content }}
                          .question-answer-area(style="width: 100%;")
                            //- 单选
                            .single-selection(v-if="item.question_type === sigleSelection")
                              a-radio-group(v-model:value="questionnaireAnswer[index]")
                                a-radio(v-for="option in item.option_list" :key="item.optionid" :value="option.title") {{ option.title }}
                            //- 文字或者位置
                            .text(v-else-if="item.question_type === text || item.question_type == location" style="width: 100%;" )
                              a-input(v-model:value="questionnaireAnswer[index]" style="width: 100%")
                            //- 数字
                            .number(v-else-if="item.question_type === number")
                              a-input-number(v-model:value="questionnaireAnswer[index]" style="width: 100%" placeholder="只能输入数字哦")
                            //- 多选
                            .multi-selection(v-else-if="item.question_type === multiSelection")
                              a-checkbox-group(v-model:value="questionnaireAnswer[index]")
                                a-checkbox(v-for="option in item.option_list" :key="item.optionid" :value="option.title") {{ option.title }}
                            //- 未知
                            .unknown-question-type(v-else)
                              a-input(v-model:value="questionnaireAnswer[index]" placeholder="好像是个未知的问卷类型呢，试着手动输入答案吧")
                    a-button(type="primary" style="min-width: 25%; display: block; margin: 0 auto;" @click="saveQuesionnaireAnswers") 保存问卷
                  a-collapse-panel(key="3" header="自动填写配置")
                    a-form(:label-col="{ span: 2 }" :wrapper-col="{ span: 5 }")
                      a-form-item(label="开启自动填写")
                        a-switch(v-model:value="questionnaireAutoFill" @change="changeEnableStatus")
                      a-form-item(label="自动填写时间")
                        span 每天早上8点（暂不支持自定义）
                  a-collapse-panel(key="4" header="填写历史")
                    a-list(item-layout="horizontal" :data-source="questionnaireFillHistory")
                      a-list-item(slot="renderItem" slot-scope="item, index" :key="index")
                        .job-detail
                          CheckCircleTwoTone(twoToneColor="#0ed10b" v-if="item.result == 0")
                          CloseCircleTwoTone(twoToneColor="#ff0000" v-else-if="item.result == 1")
                          span(style="margin: 0 10px;") {{ new Date(item.date).toLocaleString() }}
                          p(v-if="item.result == 1" style="margin-left: 24px; color: #aaaaaa;") {{ item.exception }}
                          p(v-if="item.result == 0" style="margin-left: 24px; color: #aaaaaa;") 自动填写成功

          h1(v-else style="") 请先绑定微哨账号
        .content-wrap.help(v-if="menuSelectedKey == '3'")
          a-card.card.shadow(title="Q&A")
            ul
              li
                h1 咋用？
                p 先绑定账号，然后在问卷列表里面选择你要填的问卷，填过一次之后就会在后面每天都帮你自动填了。
              li
                h1 绑定失败，请在微哨打开？
                p 在 <a href="http://web.weishao.com.cn/login" target="_blank"> 微哨网页端 </a>登陆，至少进入打卡一次之后（在新窗口打开），再回来绑定。
              li
                h1 绑定失败，验证码错误？
                p 多次登录失败导致需要验证码，请在 <a href="http://web.weishao.com.cn/login" target="_blank"> 微哨网页端 </a>登陆一次，再回来绑定。
              li
                h1 其他问题？
                p 往 i@sheey.moe 发邮件。
          a-card.card.shadow(title="关于")
            ul
              li
                h1 作者
                a(href="https://sheey.moe") sheey
              li
                h1 你是不是傻逼啊，写这个干嘛？
                p 学 <code>asp</code> 和 <code>EFCore</code>，另外再学点 <code>dotnet 5.0</code> 和 <code>c# 9</code> 新特性
                p 尽量给他的请求整成 <code>RUSTful</code>，如果有不顺眼的欢迎交流
                p 你该不会真的以为这是写来填微哨的把？
              li
                h1 技术栈？
                p 后端是 <code>ASP.NET Core</code>, <code>Entity Framework Core(Sqlite)</code>, 都是 <code>dotnet 5.0</code>, 反向代理用的 <code>caddy</code>, 跑在一台老旧的 <code>Ubuntu</code> 上
                p 前端是 <code>nuxt.js</code> 和 <code>ant-design-vue</code>
                p 图标库用的 <code>antd</code> 自带的和一些 <code>font-awesome</code>
              li
                h1 图标怎么是 <code>nuxt</code> 的图标？
                p 我是懒狗
              li
                h1 左边导航栏怎么和 <code>antd</code> 的不一样？
                p 他的不好看，改了，我的好看
              li
                h1 会适配手机端吗
                p 会
              li
                h1 开源？
                p 不开源
      a-layout-footer(style="padding: 0")
        Footer
</template>

<script>
import {
  SettingTwoTone,
  SnippetsTwoTone,
  QuestionCircleTwoTone,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CloseCircleTwoTone,
  CarryOutTwoTone,
  CheckCircleTwoTone,
  MenuOutlined
} from '@ant-design/icons-vue'

import { message, Modal } from 'ant-design-vue'

const sigleSelection = 1
const multiSelection = 2
const number = 3
const text = 4
const location = 7

export default {
  components: {
    SettingTwoTone,
    SnippetsTwoTone,
    QuestionCircleTwoTone,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CloseCircleTwoTone,
    CarryOutTwoTone,
    CheckCircleTwoTone,
    MenuOutlined
  },
  data () {
    return {
      collapsed: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
      whistleUsername: '',
      whistlePassword: '',
      whistleCredentialSaving: false,
      whistleUserInfo: {
        realname: '',
        stuCode: '',
        gender: '',
        cellphone: '',
        org: ''
      },
      menuSelectedKey: ['1'],
      currentPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      changePasswordLoading: false,
      questionnaireData: [],
      questionnaireModalVisible: false,
      questionnaireDetailLoading: false,
      selectedQuestionnaireTitle: '',
      questionnaireDetail: {
        activity_title: '',
        activity_content: '',
        question_list: []
      },
      sigleSelection,
      multiSelection,
      number,
      text,
      location,
      questionnaireAnswer: {},
      selectedQuestionnaireId: '',
      questionnaireAutoFill: false,
      questionnaireFillHistory: [],
      wxQRCodeUrl: '',
      wxPusherBinded: false,
      wxQRCodeUid: '',
      drawerVisible: false
    }
  },
  head () {
    return {
      title: 'WhistleFarm - 后台管理'
    }
  },
  computed: {
    displayWhistleInfo () {
      return this.$auth.loggedIn && this.$auth.user.whistleBind
    }
  },
  mounted () {
    if (!this.$auth.loggedIn) {
      this.$router.push('/')
    } else {
      const ctx = this

      this.whistleUsername = this.$auth.user.whistle_username
      this.refreshWhistleUserInfo()
      this.$axios.get('https://api.farm.sheey.moe/bindInfo')
        .then((res) => {
          ctx.wxPusherBinded = res.data.bind
          ctx.wxPusherUid = res.data.uid
        })
      if (!ctx.wxPusherBinded) {
        this.$axios.get('https://api.farm.sheey.moe/qrcode')
          .then((res) => {
            ctx.wxQRCodeUrl = res.data.url
          })
      }
    }
  },
  methods: {
    changeEnableStatus (checkStatus) {
      if (checkStatus) {
        this.$axios.post('https://api.farm.sheey.moe/whistle/autofill/enable', { qid: this.selectedQuestionnaireId })
          .then((res) => {
            message.success(`已保存, 将在 ${res.data.time} 填写。`)
          })
          .catch((e) => {
            message.error(e.response.data.msg)
          })
      } else {
        this.$axios.post('https://api.farm.sheey.moe/whistle/autofill/disable', { qid: this.selectedQuestionnaireId })
          .then((e) => {
            message.success('已保存')
          })
          .catch((e) => {
            message.error(e.response.data.msg)
          })
      }
    },
    refreshEnableStatus () {
      const ctx = this
      this.$axios.get('https://api.farm.sheey.moe/whistle/autofill/status?qid=' + this.selectedQuestionnaireId)
        .then((res) => {
          ctx.questionnaireAutoFill = res.data.enabled
        })
    },
    saveQuesionnaireAnswers () {
      const ctx = this
      const ans = []
      let hasUnansweredQuestion = false

      for (let i = 0; i < this.questionnaireDetail.question_list.length; i++) {
        let a = ''
        if (!this.questionnaireAnswer[i]) {
          hasUnansweredQuestion = true
        } else {
          a = this.questionnaireAnswer[i]
        }

        if (Array.isArray(a)) {
          ans.push({
            multiAnswer: a
          })
        } else if (typeof (a) === 'number') {
          ans.push({
            singleIntAnswer: a
          })
        } else {
          ans.push({
            singleAnswer: a
          })
        }
      }
      if (hasUnansweredQuestion) {
        Modal.confirm({
          title: '还有未作答的问题，你确定要提交吗？',
          okText: '我确定',
          cancelText: '再想想',
          onOk () {
            return ctx.submitQuestionnaireAnswer(ans)
          }
        })
      } else {
        ctx.submitQuestionnaireAnswer(ans)
      }
    },
    submitQuestionnaireAnswer (ans) {
      return new Promise((resolve, reject) => {
        this.$axios.put('https://api.farm.sheey.moe/whistle/questionnaire_answers', {
          qid: this.selectedQuestionnaireId,
          answers: ans
        })
          .then((res) => {
            message.success('已保存')
            resolve()
          }).catch((e) => {
            message.success('保存失败: ' + e.response.data.msg)
            reject(e)
          })
      })
    },
    displayQuestionnaireInfo (qid) {
      const ctx = this

      this.questionnaireAnswer = {}
      this.questionnaireModalVisible = true
      this.questionnaireDetailLoading = true
      this.selectedQuestionnaireId = qid

      new Promise((resolve, reject) => {
        this.$axios.get('https://api.farm.sheey.moe/whistle/questionnaires_detail?qid=' + qid)
          .then((res) => {
            ctx.questionnaireDetail = res.data
            resolve()
          })
          .catch(e => reject(e))
      }).then((resolve, reject) => {
        this.$axios.get('https://api.farm.sheey.moe/whistle/questionnaire_answers?qid=' + qid)
          .then((res) => {
            for (let i = 0; i < res.data.answers.length; i++) {
              const e = res.data.answers[i]
              if (e.singleAnswer) {
                ctx.questionnaireAnswer[i] = e.singleAnswer
              } else if (e.singleIntAnswer) {
                ctx.questionnaireAnswer[i] = e.singleIntAnswer
              } else {
                ctx.questionnaireAnswer[i] = e.multiAnswer
              }
            };
            resolve()
          })
          .catch((e) => {
            reject(e)
          })
      }).then((resolve, reject) => {
        this.$axios.get('https://api.farm.sheey.moe/whistle/autofill/results?qid=' + qid)
          .then((res) => {
            ctx.questionnaireFillHistory = res.data.result
            resolve()
          })
      }).then((resolve, reject) => {
        this.$axios.get('https://api.farm.sheey.moe/whistle/autofill/status?qid=' + qid)
          .then((res) => {
            ctx.questionnaireAutoFill = res.data.enabled
          })
      }).finally(() => { ctx.questionnaireDetailLoading = false })
    },
    logout () {
      this.$auth.logout()
      this.$router.push('/')
    },
    refreshWhistleUserInfo () {
      const ctx = this

      this.$axios.get('https://api.farm.sheey.moe/whistle/info')
        .then((res) => {
          ctx.whistleUserInfo.realname = res.data.username ? res.data.username : ''
          ctx.whistleUserInfo.stuCode = res.data.stucode ? res.data.stucode : ''
          ctx.whistleUserInfo.gender = res.data.gender ? res.data.gender : ''
          ctx.whistleUserInfo.cellphone = res.data.cellphone ? res.data.cellphone : ''
          ctx.whistleUserInfo.org = res.data.organization ? res.data.organization : ''
        })

      this.$axios.get('https://api.farm.sheey.moe/whistle/questionnaires')
        .then((res) => {
          this.questionnaireData = res.data
        })
    },
    changePassword () {
      if (this.currentPassword === '' || this.newPassword === '' || this.newPasswordRepeat === '') {
        message.error('请输入密码')
        return
      }
      if (this.newPassword !== this.newPasswordRepeat) {
        message.error('两次密码不一致')
      }
      this.changePasswordLoading = true

      this.$axios.post('https://api.farm.sheey.moe/auth/change_password', {
        password: this.currentPassword,
        new_password: this.newPassword
      })
        .then((res) => {
          message.success('修改成功')
          this.changePasswordLoading = false
        })
        .catch((e) => {
          if (e.response.data) {
            message.error(e.response.data.msg)
          } else {
            message.error(e.message)
          }
          this.changePasswordLoading = false
        })
    },
    saveWhistleCredential () {
      if (this.whistleUsername.length < 5 || this.whistlePassword < 5) {
        message.error('能不能认真点啊')
      } else {
        this.whistleCredentialSaving = true
        this.$axios.post('https://api.farm.sheey.moe/whistle/enroll', {
          username: this.whistleUsername,
          password: this.whistlePassword
        })
          .then((res) => {
            message.success('已保存')
            this.whistleCredentialSaving = false
            this.refreshWhistleUserInfo()
            this.$auth.fetchUser()
          })
          .catch((e) => {
            if (e.response.data) {
              message.error('微哨登录失败: ' + e.response.data.msg)
            } else {
              message.error(e.message)
            }
            this.whistleCredentialSaving = false
          })
      }
    }
  }
}
</script>

<style scoped>
.root-layout {
  min-height: 100vh;
}

.site-title {
  font-size: 20px;
  color: #fff;
}

.ant-menu-item {
  font-weight: 700;
}

.ant-menu-item > span:last-child {
  margin-left: 10px;
}

.ant-layout-header {
  padding-left: 20px;
}

.content-wrap {
  column-count: 2;
  column-gap: 0;
  padding: 10px;
}

.card {
  width: calc(100% - 32px);
  display: inline-block;
  margin: 16px;
}

.shadow:hover {
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgb(0 0 0 / 9%);
}

.whistle-info-wrap {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  width: calc(100% - 128px - 12px);
}

.whistle-info-wrap > * {
  margin: auto;
  text-align: left;
}

.whistle-farm-info {
  width: 50%;
  font-weight: 500;
}

.table-col-info {
  font-weight: 700;
}

.questionnaire {
  min-height: 100%;
}

.job-detail {
  padding: 10px;
}

.mobile-only {
  display: none;
}

@media screen and (max-width: 1200px) {
  .content-wrap {
    column-count: 1;
    padding: 0;
  }

  .card {
    width: calc(100% - 12px);
    margin: 6px;
  }
}

@media screen and (max-width: 500px) {
  .whistle-info-avatar {
    display: none;
  }

  .whistle-info-wrap {
    width: fit-content;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: unset;
  }

  .ant-layout-header {
    padding-right: 20px;
  }
}
</style>

<style>
.ant-layout-header {
  background: #fff;
}

.ant-menu-item {
  margin: 0 10px !important;
  width: calc(100% - 20px) !important;
  padding-left: 24px !important;
  border-radius: 40px;
}

.ant-menu-inline-collapsed > .ant-menu-item {
  padding: 0 22px !important;
}

.large-avatar > .ant-avatar-string {
  font-size: 32px;
}

.ant-menu-item::after {
  border-right: none !important;
}

.nav-drawer .ant-drawer-body {
  padding: 20px 0 0 0;
}

@media screen and (max-width: 700px) {
  .ant-modal {
    width: 100% !important;
  }
}
</style>
