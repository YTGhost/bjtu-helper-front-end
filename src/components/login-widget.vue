<template>
  <div style="width: 800px;margin: 0 auto">
    <el-form ref="form" :rules="rules" :model="form" style="margin-top: 150px">
      <el-form-item prop="account" style="width: 400px;margin: 0 auto">
        <el-input v-model="form.account" prefix-icon="el-icon-user" placeholder="账号" size="large">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" style="width: 400px; margin: 30px auto 0">
        <el-input v-model="form.password" prefix-icon="el-icon-lock" placeholder="密码" show-password
                  size="large"></el-input>
      </el-form-item>
      <el-form-item style="width: 400px; margin: 10px auto 0">
        <div style="margin: 0 auto;padding: 0 70px">
          <p style="display: inline-block;cursor: pointer" @click="forgetPassword">忘记密码了？</p>
          <p style="display: inline-block;margin-left: 30px;cursor: pointer;" @click="toRegister">没有账号？立即注册</p>
        </div>
      </el-form-item>
      <el-form-item style="width: 400px;margin: 10px auto 0">
        <el-button round style="width: 400px;height: 60px" type="warning" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="重置密码" :visible.sync="resetVisible" :modal="false">
      <div v-if="resetForm1Visible">
        <el-form ref="resetForm1" :model="resetForm1" :rules="resetForm1Rules">
          <el-form-item prop="email" style="width: 400px;margin: 0 auto">
            <el-input v-model="resetForm1.email" class="email" prefix-icon="el-icon-message" placeholder="输入邮箱" size="large">
              <el-button slot="append" :disabled="codeDisabled" @click="getCode">{{codeMsg}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="code" style="width: 400px; margin: 30px auto 0">
            <el-input v-model="resetForm1.code" prefix-icon="el-icon-postcard" placeholder="输入验证码" show-password
                      size="large"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;margin: 30px auto 0">
            <el-button round type="primary" style="width: 300px" @click="submitResetForm1">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="resetForm2Visible">
        <el-form ref="resetForm2" :model="resetForm2" :rules="resetForm2Rules">
          <el-form-item prop="password" style="width: 400px; margin: 30px auto 0">
            <el-input v-model="resetForm2.password" prefix-icon="el-icon-lock" placeholder="设置密码" show-password
                      size="large"></el-input>
          </el-form-item>
          <el-form-item prop="again" style="width: 400px; margin: 30px auto 0">
            <el-input v-model="resetForm2.again" prefix-icon="el-icon-lock" placeholder="请再次输入密码" show-password
                      size="large"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;margin: 30px auto 0">
            <el-button round type="primary" style="width: 300px" @click="submitResetForm2">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/apiPro'
import {emailFormatValidator, emailSpecValidator, passwordFormatValidator} from "@/util/validator";

export default {
  name: "login-widget",
  data() {
    const passwordAgain = (rule, value, callback) => {
      if (value === this.resetForm2.again) {
        callback();
      } else {
        callback("两次密码不一致");
      }
    };
    return {
      form: {
        account: '',
        password: '',
      },
      resetForm1: {
        email: '',
        code: '',
      },
      resetForm2: {
        password: '',
        again: '',
      },
      // 控制Dialog表单1的显示
      resetForm1Visible: false,
      // 控制Dialog表单2的显示
      resetForm2Visible: false,
      // 控制重置密码的Dialog的显示
      resetVisible: false,
      // 是否禁用发送验证码按钮
      codeDisabled: false,
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '获取验证码',
      // 定时器
      timer: null,
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ]
      },
      resetForm1Rules: {
        email: [
          {required: true, message: '邮箱不能为空', trigger: 'blur'},
          {validator: emailSpecValidator, trigger: 'blur'},
          {validator: emailFormatValidator, trigger: 'change'}
        ],
        code: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
        ]
      },
      resetForm2Rules: {
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {validator: passwordFormatValidator, trigger: 'change'}

        ],
        again: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: passwordAgain, trigger: 'blur'}
        ],
      }
    }
  },

  methods: {
    async login() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error('账号或密码没有填写');
          return false;
        }
      });
      const {data: res} = await this.$http.post(API.login, {
        account: this.form.account,
        password: this.form.password
      });
      if (!res.code) {
        this.$message.success("登录成功!");
        this.$router.push({path: '/home'});
      } else if (res.code === 1) {
        this.$message.error("账号不存在！");
      } else if (res.code === 2) {
        this.$message.error("密码错误!");
      } else {
        this.$message.error("遇到异常错误");
      }
    },
    forgetPassword() {
      this.resetVisible = true;
      this.resetForm1Visible = true;
    },
    toRegister() {
      this.$router.push({path: '/register'});
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
      this.$refs['resetForm1'].validateField('email', errMsg => {
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
    },
    submitResetForm1() {
      this.$refs['resetForm1'].validate((valid) => {
        if (!valid) {
          this.$message.error('请检查表单是否按照要求填写');
          return false;
        }
      });
      // TODO 发送验证码逻辑

      this.resetForm1Visible = false;
      this.resetForm2Visible = true;
    },
    async submitResetForm2() {
      this.$refs['resetForm2'].validate((valid) => {
        if (!valid) {
          this.$message.error('请检查表单是否按照要求填写');
          return false;
        }
      });
      const {data: res} = await this.$http.post(API.resetPassword, {
        email: this.resetForm1.email,
        password: this.resetForm2.password
      });
      if (!res.code) {
        this.$message.success('重置密码成功');
      } else {
        this.$message.error(res.message);
      }
      this.resetVisible = false;
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
