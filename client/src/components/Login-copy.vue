<template>
  <div class='login-container'>
    <div class="container">
      <div id="loginbox" style="margin-top:50px;"
        class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <div class="panel panel-info" >
          <div class="panel-heading">
            <div class="panel-title">Log In</div>
          </div>
          <div style="padding-top:30px" class="panel-body"></div>
            <div style="display:none" id="login-alert"
              class="alert alert-danger col-sm-12"></div>
              <form id="loginform" class="form-horizontal" role="form">
                <div style="margin-bottom: 25px" class="input-group">
                  <span class="input-group-addon"><i
                    class="glyphicon glyphicon-user"></i></span>
                  <input id="login-email" type="text" class="form-control"
                    name="email" value="" placeholder="Email"
                    v-model='email' @click='reset'>
                </div>
                <div style="margin-bottom: 25px" class="input-group">
                  <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                  <input id="login-password" type="password" class="form-control"
                    name="password" placeholder="Password"
                    v-model='password' @click='reset'>
                </div>
                <div style="margin-top:10px" class="form-group">
                  <div class="col-sm-12 controls">
                    <a id="btn-login" href="#/login" class="btn btn-success"
                      @click='login' @keyup.enter='login'>
                      <router-link to='/inventories'>Login</router-link>
                    </a>

                    <hr>
                    <div class='errors'>
                      {{ errors }}
                    </div>
                    <div></div>
                  </div>
                </div>

                <div class="form-group">
                  <div class="col-md-12 control">
                    <div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
                      Don't have an account!
                      <a href="#/register">Register Here</a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div id="signupbox" style="display:none; margin-top:50px" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">

          <div class="panel panel-info">
            <div class="panel-heading">
              <div class="panel-title">Sign Up</div>
              <div style="float:right; font-size: 85%; position: relative; top:-10px"><a id="signinlink" href="#" onclick="$('#signupbox').hide(); $('#loginbox').show()">Sign In</a></div>
            </div>

            <div class="panel-body">
              <form id="signupform" class="form-horizontal" role="form">
                <div id="signupalert" style="display:none" class="alert alert-danger">
                  <p>Error:</p>
                  <span></span>
                </div>
                <div class="form-group">
                  <label for="email" class="col-md-3 control-label">Email</label>
                  <div class="col-md-9">
                    <input type="text" class="form-control" name="email" placeholder="Email Address">
                  </div>
                </div>
                <div class="form-group">
                  <label for="firstname" class="col-md-3 control-label">First Name</label>
                  <div class="col-md-9">
                    <input type="text" class="form-control" name="firstname" placeholder="First Name">
                  </div>
                </div>
                <div class="form-group">
                  <label for="lastname" class="col-md-3 control-label">Last Name</label>
                    <div class="col-md-9">
                      <input type="text" class="form-control" name="lastname" placeholder="Last Name">
                    </div>
                </div>
                <div class="form-group">
                  <label for="password" class="col-md-3 control-label">Password</label>
                  <div class="col-md-9">
                    <input type="password" class="form-control" name="password" placeholder="Password">
                  </div>
                </div>
                <div class="form-group">
                  <label for="icode" class="col-md-3 control-label">Invitation Code</label>
                  <div class="col-md-9">
                      <input type="text" class="form-control" name="icode" placeholder="">
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-md-offset-3 col-md-9">
                    <button id="btn-signup" type="button" class="btn btn-info"><i class="icon-hand-right"></i> &nbsp Sign Up</button>
                    <span style="margin-left:8px;">or</span>
                  </div>
                </div>
                <div style="border-top: 1px solid #999; padding-top:20px"  class="form-group">
                  <div class="col-md-offset-3 col-md-9">
                      <button id="btn-fbsignup" type="button" class="btn btn-primary"><i class="icon-facebook"></i>   Sign Up with Facebook</button>
                  </div>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>

import AuthenticationService from '@/services/AuthenticationService'
import Vue from 'vue'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie);

function generateRandomId() {
  const randomId = Math.random().toString(36).replace(/^[A-Za-z0-9_.]+$/).substring(2, 30);
  return randomId;
}

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: '',
      cookies: false
    };
  },
  methods: {
    async login() {
      const response = await AuthenticationService.login({
        email: this.email,
        password: this.password
      })
      this.errors = response.data.message
      this.cookies = response.data.cookies
      if (response.data.cookies === true) {
        const userCookies = this.$cookie.set('userCookies', generateRandomId(), 1)
        this.errors = 'Cookies succesfully set!'
      } else {
        this.errors = 'Cookies not set!'
      }
    },
    reset() {
      this.errors = ''
    },
    logout(){
        this.$cookie.delete('userCookies');
    },
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.errors {
  text-align: center;
  color: darkred;
  font-size: 25px;
  padding: 5px;
  overflow: auto;
}


</style>
