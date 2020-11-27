<template>
  <div class="back-ground">
    <div class="login-widget">
      <div class="login-left">
        <div class="login-logo"></div>
        <router-view class="widget"></router-view>
<!--        <login-widget v-if="isLogin" class="widget"/>-->
<!--        <register-widget v-if="!isLogin" class="widget"/>-->
      </div>
      <div class="login-right"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      isLogin: true,
    }
  },

  methods: {

  },
}
</script>

<style scoped>
.back-ground{
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-image: url("../assets/login-background.png");
}

.login-widget {
  width: 1400px;
  height: 810px;
  background: white;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  border-radius: 10px;
  box-shadow: #666 0px 0px 10px;
}

.login-left {
  display: inline-block;
  height: 100%;
  width: 70%
}

.login-right {
  display: inline-block;
  height: 100%;
  width: 30%;
  background: url("../assets/hole.png") no-repeat 0px 0;
}

.login-logo {
  width: 473px;
  height: 105px;
  margin: 100px auto 0;
  background: url("../assets/login-logo.png");
}

.widget {
  width: 100%;
  height: 605px;
  overflow:hidden;
}
</style>
