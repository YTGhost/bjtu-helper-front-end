<template>
  <div style="width: 800px;margin: 0 auto">
    <el-form ref="form" :rules="rules" :model="form" style="margin-top: 30px">
      <el-form-item prop="email" style="width: 400px;margin: 0 auto">
        <el-input v-model="form.email" class="email" prefix-icon="el-icon-message" placeholder="输入邮箱" size="large">
          <el-button slot="append" :disabled="codeDisabled" @click="getCode">{{codeMsg}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="username" style="width: 400px; margin: 30px auto 0">
        <el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="设置用户名" size="large"></el-input>
      </el-form-item>
      <el-form-item prop="password" style="width: 400px; margin: 30px auto 0">
        <el-input v-model="form.password" prefix-icon="el-icon-lock" placeholder="设置密码" show-password
                  size="large"></el-input>
      </el-form-item>
      <el-form-item prop="again" style="width: 400px; margin: 30px auto 0">
        <el-input v-model="form.again" prefix-icon="el-icon-lock" placeholder="请再次输入密码" show-password
                  size="large"></el-input>
      </el-form-item>
      <el-form-item prop="code" style="width: 400px; margin: 30px auto 0">
        <el-input v-model="form.code" prefix-icon="el-icon-postcard" placeholder="输入验证码" show-password
                  size="large"></el-input>
      </el-form-item>
      <el-form-item style="width: 400px; margin: 0 auto 0">
        <div style="margin: 0 auto;padding: 0 70px">
          <p style="display: block;text-align: center;cursor: pointer;" @click="toLogin">已有账号？立即登录</p>
        </div>
      </el-form-item>
      <el-form-item style="width: 400px;margin: 10px auto 0">
        <el-button round style="width: 400px;height: 60px" type="warning" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  emailSpecValidator,
  emailFormatValidator,
  passwordFormatValidator,
  usernameSpecValidator,
  usernameFormatValidator
} from "@/util/validator";
import API from '@/api/apiPro';

export default {
  name: "register-widget",
  data() {
    const passwordAgain = (rule, value, callback) => {
      if (value === this.form.again) {
        callback();
      } else {
        callback("两次密码不一致");
      }
    };
    return {
      // 表单数据
      form: {
        email: '',
        username: '',
        password: '',
        again: '',
        code: ''
      },
      // 是否禁用发送验证码按钮
      codeDisabled: false,
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '获取验证码',
      // 定时器
      timer: null,
      // 校验规则
      rules: {
        email: [
          {required: true, message: '邮箱不能为空', trigger: 'blur'},
          {validator: emailSpecValidator, trigger: 'blur'},
          {validator: emailFormatValidator, trigger: 'change'}
        ],
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {validator: usernameSpecValidator, trigger: 'blur'},
          {validator: usernameFormatValidator, trigger: 'change'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {validator: passwordFormatValidator, trigger: 'change'}

        ],
        again: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: passwordAgain, trigger: 'blur'}
        ],
        code: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async register() {
      this.$refs['form'].validate((valid) => {
        if(!valid) {
          this.$message.error('注册信息未填写全');
          return false;
        }
      });
      const {data: res} = await this.$http.post(API.register, {
        email: this.form.email,
        username: this.form.username,
        password: this.form.password,
        code: this.form.code
      });
      if (!res.code) {
        this.$message.success('注册成功');
        // TODO 跳转登录页

      } else {
        this.$message.error(res.message);
      }
    },

    toLogin() {
      this.$router.push({path: '/login'});
    },

    getValidStr() {
      if (this.countdown > 0 && this.countdown <= 60) {
        this.countdown--;
        if (this.countdown !== 0) {
          this.codeMsg = "重新发送(" + this.countdown + ")";
        } else {
          clearInterval(this.timer);
          this.codeMsg = "获取验证码";
          this.countdown = 60;
          this.timer = null;
          this.codeDisabled = false;
        }
      }
    },

    getCode() {
      // 只校验邮箱这一个字段
      this.$refs['form'].validateField('email', errMsg => {
        if(!errMsg) {
          // 校验成功了
          if (!this.timer) {
            // TODO 发送验证码逻辑
            // 发送验证码
            this.getValidStr();
            this.timer = setInterval(this.getValidStr, 1000);
          }
        }
      });
    }
  }
}
</script>

<style scoped>
p {
  color: #E6A23C;
}

/deep/ .el-input__inner {
  width: 400px;
  border-radius: 30px;
  height: 60px;
}

/deep/ .el-button.is-round {
  border-radius: 30px;
}

/deep/ .email{
  border: 1px solid #c5c5c5;
  border-radius: 30px;
}
/deep/ .email .el-input-group__append {
  border: none;
  background-color: transparent;
}
/deep/ .email .el-input__inner {
  height: 60px;
  width: 285px;
  border: none;
}
</style>
