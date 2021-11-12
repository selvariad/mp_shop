<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎注册图书商城</view>
			<input class="u-border-bottom"  v-model="name"
			placeholder="请输入昵称" />
			<input class="u-border-bottom"  v-model="id"
			placeholder="请输入注册邮箱" />
			<input class="u-border-bottom"  
			type="password" v-model="password" 
			placeholder="请输入密码" />
			<input class="u-border-bottom" 
			type="password" v-model="password_confirmation" 
			placeholder="请再次输入密码" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">注册</button>
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
				注册代表同意
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
			name:'',
			id: '',
			password:'',
			password_confirmation:''
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.password_confirmation.length >= 6 && this.password !== this.password_confirmation) {
				this.$u.toast('密码不一致，请重新输入')
			}
			if(this.$u.test.email(this.id) && this.password.length !== 0 &&this.password == this.password_confirmation) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	methods: {
		async submit() {
			const RegisterParams = {
				name:this.name,
				email:this.id,
				password:this.password,
				password_confirmation:this.password_confirmation
			}
			// 注册用户信息
			this.$u.api.getRegister(RegisterParams)
			// 注册成功跳转至登录页面
			this.$u.toast('注册成功,跳转至登录页面')
			setTimeout(() => {
				this.$u.route({
					type:'reLaunch',
					url:'pages/auth/login'
				})
			},1500)
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
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 100rpx 150rpx;
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
