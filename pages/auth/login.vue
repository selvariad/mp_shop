<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录图书商城</view>
			<input class="u-border-bottom"  v-model="id" 
			placeholder="请输入邮箱账号" />
			<input class="u-border-bottom" 
			v-show="id.length !== 0 ? true : false" 
			type="password" v-model="password" 
			placeholder="请输入密码" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="password">找回密码</view>
				<view class="issue" @click="toRegisterPage">注册账号</view>
				
			</view>
		</view>
		<view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<view class="icon"><u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon></view>
					微信
				</view>
				<view class="QQ item">
					<view class="icon"><u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon></view>
					QQ
				</view>
			</view>
			<view class="hint">
				登录代表同意
				<text class="link">用户协议、隐私政策，</text>
				并授权使用您的账号信息（如昵称、头像、收获地址）以便您统一管理
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			password:''
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.$u.test.email(this.id) && this.password) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	methods: {
		async submit() {
			if(!this.$u.test.email(this.id) || !this.password) {
				return
			}
			// 记录登陆参数
			const params = {
				email:this.id,
				password:this.password
			}
			// 请求登录API
			const UserRes = await this.$u.api.getLogin(params)
			// // 缓存Token
			this.$u.vuex('vuex_token',UserRes.access_token)
			// 请求用户信息
			const UserInfo = await this.$u.api.getUserInfo()
			// 缓存用户信息
			this.$u.vuex('vuex_user',UserInfo)
			// 跳转至登陆前页面
			this.$u.toast('登陆成功,跳转至登陆前页面')
			const backUrl = uni.getStorageSync('back_Url') || 'pages/index/index'
			setTimeout(() => {
				this.$u.route({
					type:'reLaunch',
					url:backUrl
				})
			},1500)
		},
		toRegisterPage() {
			this.$u.route({
				type:'reLaunch',
				url:'pages/auth/register'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;
		.u-border-bottom{
			margin: 40rpx 0;
		}
		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.getCaptcha {
			background-color: rgb(19, 204, 233);
			color: #efefef;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content:space-between;
			
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
		
		.hint {
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;
			
			.link {
				color: $u-type-warning;
			}
		}
	}
}
</style>
