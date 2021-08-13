<template>
	 <div class="Login">
	    <div class="centerBody" :style="calcBody">
	      <div class="center flexBox">
	        <!-- 大logo -->
	        <div class="picDiv flexCenter">
	          <img :src="logoIcon">
	        </div>
	        <!-- 登录框 -->
	        <div class="formDiv flexCenter">
	          <div class="flexCenter loginDiv">
	            <!-- 小logo -->
	            <div class="logo flexCenter">
	              <div class="logo-title-font">益康水处理系统</div>
	            </div>
	            <!-- 登录框 -->
	            <el-form ref="cartForm" :rules="rules" :model="cart" class="demo-ruleForm loginLine">
	              <el-form-item>
	                <div class="loginText flexCenter">账号登录</div> 
	              </el-form-item>
	              <el-form-item prop="userName">
	                <el-input
	                  v-model="cart.userName"
	                  autocomplete="off"
	                  readonly
	                  onfocus="this.removeAttribute('readonly',true);"
	                  onblur="this.setAttribute('readonly',true);"
	                  class="userInput"
	                  placeholder="请输入帐号"
	                  @keyup.enter="toLogin(cartForm)"
	                />
	              </el-form-item>
	              <el-form-item prop="password">
	                <el-input
	                  v-model="cart.password"
	                  class="userInput"
	                  type="password"
	                  placeholder="请输入密码"
	                  @keyup.enter="toLogin(cartForm)"
	                />
	              </el-form-item>
	              <el-form-item prop="">
	                <div class="flexCenter pwdDiv">
	                  <div class="rememberPwd flexCenter cursorP" @click="remPwd = !remPwd">
	                    <div class="checkDiv flexCenter"><i v-show="remPwd" class="el-icon-check checkIcon" /></div>
	                    <div class="checkLabel">记住密码</div>
	                  </div>
	                </div>
	              </el-form-item>
	              <el-form-item>
	                <el-button class="toBtn" type="primary" @keyup.enter="toLogin" @click="toLogin(cartForm)">登录</el-button>
	              </el-form-item>
	              <el-row />
	            </el-form>
	          </div>
	        </div>
	      </div>
	    </div>
	  </div>
</template>

<script lang="ts">
	import { defineComponent ,ref, reactive,onMounted,computed,nextTick,watch } from 'vue'
	import md5 from 'js-md5'
	export default defineComponent({
		setup(){
			const logoIcon:String = computed(()=>{
				return window.innerWidth <= 1366 ? '../../../static/img/loginBackFontSmall.png' : '../../../static/img/loginBackFont.png';
			})
			let cartForm = ref(null)
			return {
				cart:reactive({
				  userName: "",
				  password: ""
				}),
				/*规则*/
				rules: reactive({
				  userName: [{ required: true, message: "请输入帐号", trigger: "blur" }],
				  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
				}),
				remPwd: ref(false),
				calcBody:ref(''),
				logoIcon,
				cartForm
			}
		},
		methods:{
			toLogin(myRef) {
				myRef.validate(valid => {
					console.log(valid)
					if (valid) {
						if (this.remPwd == true) {
							localStorage.setItem("nalcoUser", JSON.stringify(this.cart));
						} else if (this.remPwd == false && localStorage.getItem("nalcoUser")) {
							localStorage.removeItem("nalcoUser");
						}
						this.login()
					} else {
						return false;
					}
				});
			},
			login(obj){
				let userName = obj ? obj.userName : this.cart.userName
				let password = obj ? obj.password : md5(this.cart.password)
				this.$RequestUtil.post({
					url: "/user/auth/login",
					params: {
						// "database": pathValue,
						username:userName,
						password
					},
					success: data => {
						this.$message({
							message:'登录成功',
							type:'success'
						})
						this.$router.push({path:'\home'})
					},
					error: () => {
					}
				});
			}
		}
	}) 
</script>

<style lang="scss" scoped>
	.flexBox{
		display:flex;
	}
	.flexCenter{
		@extend .flexBox;
		justify-content: center;
		align-items: center;
	}
	.topBody {
	  height: 90px;
	  width: 100%;
	  background-color: #ffffff;
	  padding-left: 14%;
	}
	.centerBody {
	  height: 937px;
	  width: 100%;
	  background-image: url('../../../static/img/loginBack.png');
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  .center{
	    height:100%;
	    width:100%;
	    .picDiv{
	      width:65%;
	      position: relative;
	      img{
	          position: relative;
	          z-index: 1000;
	      }
	      &::after{
	        content:'';
	        width: 100%;
	        height: 100%;
	        position: absolute;
	        background: rgba(13,22,53,.6);
	      }
	    }
	    .formDiv{
	      width:35%;
	      background:rgba(13,22,53,0.85);
	      flex-direction: column;
	      .loginDiv{
	        height:65%;
	        width:100%;
			flex-wrap:wrap;
	        .logo{
	          width: 100%;
	          height: 8%;
	        }
	        .logo-title-font{
	          width:100%;
	          background: linear-gradient(#ffffff 0%, #82d1ff 100%);
	          -webkit-background-clip: text;
	          -webkit-text-fill-color: transparent;
	          font-size: 39px;
	          font-weight: 600;
	          // font-family: 'PingFangSC-Medium';
	          text-align: center;
	        }
	      }
	    }
	  }
	
	}
	.bottomBody {
	  height: 245px;
	  width: 100%;
	  background-color: #ffffff;
	  padding-left: 14%;
	}
	
	.loginLine {
	  padding: 26px 0px;
	  /* width: 310px; */
	  // background: #0A1948;
	  height: 440px;
	  width: 59%;
	  // border:2px solid #092A59;
	  background-image:url('../../../static/img/loginCube.png');
	  background-repeat:no-repeat;
	  .loginText{
	      font-size: 26px;
	      background: linear-gradient(#ffffff 0%, #82d1ff 100%);
	      -webkit-background-clip: text;
	      -webkit-text-fill-color: transparent;
	  }
	   :deep .el-form-item{
	    margin-bottom:30px
	  }
	  .userInput{
	    width:310px;
	    height:50px;
	    margin-bottom: 10px;
	     :deep .el-input__inner{
	      height:100%;
	      background: transparent;
	      border: 1px solid #1dd4ff;
	      font-size: 16px;
	      color:#fff;
	    }
	  }
	  .pwdDiv{
	    height:50px;
	    justify-content: space-around;
	    .rememberPwd{
	      .checkDiv{
	        width: 18px;
	        height: 18px;
	        border: 1px solid #1dd4ff;
	        border-radius:3px;
	        .checkIcon{
	          color:#1dd4ff;
	          font-weight: 700;
	        }
	      }
	      .checkLabel{
	        padding-left: 5px;
	        font-size: 16px;
	        // font-family: PingFangSC-Regular;
	        font-weight: 700;
	        color:#1dd4ff
	      }
	    }
	    .forgetPwd{
	      font-size:20px;
	      color:#fff
	    }
	  }
	}
	.loginLable {
	  color: #095ED7;
	  margin: 12px 0;
	  text-align: center;
	  font-size: 18px;
	  font-weight: 700;
	}
	.footer {
	  position: absolute;
	  top: 715px;
	  font-size: 16px;
	}
	.toBtn {
	  width: 310px;
	  // margin-top: 44px;
	  height: 50px;
	  background:rgba(29,212,255,0.5);
	  color: #ffffff;
	  font-size: 18px;
	  border: none;
	  font-weight: 700;
	  // font-family: PingFangSC-Regular,
	}
	input {
	  height: 40px !important;
	}
	.logo-img{
	  height:84px;
	  width: 223px;
	}
	@media screen and (max-width: 1366px) {
	  .centerBody{
	    height: 625px;
	    .center{
	      .picDiv{
	        width:60%;
	      }
	      .formDiv{
	        width:40%;
	        background:rgba(13,22,53,0.85);
	        flex-direction: column;
	        .loginDiv{
	          height:75%;
	          .logo{
	            .logo-title{
	              width:90%
	            }
	            .logo-title-font{
	              font-size: 34px;
	            }
	          }
	        }
	      }
	    }
	  }
	
	  .topBody{
	    height: 70px;
	  }
	  .bottomBody{
	    height: 125px;
	  }
	  .loginLine{
	    top: 150px;
	    height: 350px;
	    background-size: 100% 100%;
	    background-repeat: no-repeat;
	    padding: 24px 50px;
	    .userInput{
	      height:40px;
	      margin-bottom: 0;
	      width: 225px;
	       :deep .el-input__inner{
	        font-size:14px
	      }
	    }
	    .pwdDiv{
	        height:30px;
	        justify-content: space-around;
	        .rememberPwd{
	          .checkLabel{
	            font-size:14px;
	          }
	        }
	        .forgetPwd{
	          font-size:17px;
	        }
	      }
	  }
	  .footer{
	    top:535px;
	    font-size: 12px;
	  }
	  .loginLable{
	    font-size: 18px;
	    margin: 10px 0 17px 0px;
	  }
	  .toBtn{
	    font-size: 16px;
	    height:40px;
	    width:225px
	  }
	}
</style>
