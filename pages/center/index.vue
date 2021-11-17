<template>
	<view>
		<view class="u-flex user-box u-p-t-30 u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
					<oss-upload></oss-upload>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{vuex_user.name}}</view>
				<view class="u-font-14 u-tips-color">Email:{{vuex_user.email}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="rmb-circle" title="所有订单" @click="toOrderList"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="coupon" title="卡券"></u-cell-item>
				<u-cell-item icon="heart" title="收藏"></u-cell-item>
				<u-cell-item icon="map" title="地址管理" @click="toAddress"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="个人设置" @click="toBaseInfo"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item style="color: red" title="退出登录" @click="logout"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:true
			}
		},
		onLoad() {
			if(!this.$u.utils.validToken()) return
		},
		methods: {
			// 跳转前往修改个人信息
			toBaseInfo() {
				this.$u.route({
					url:'pages/center/baseInfo'
				})
			},
			// 跳转前往地址管理
			toAddress () {
				this.$u.route({
					url:'pages/center/address'
				})
			},
			// 跳转前往所有订单
			toOrderList() {
				this.$u.route({
					url:'pages/center/orderList'
				})
			},
			async logout(){
				// 请求退出登录API
				await this.$u.api.Logout()
				// 清除缓存的token和userinfo
				this.$u.vuex('vuex_token',null)
				this.$u.vuex('vuex_user',{})
				// 跳转到首页
				this.$u.toast('退出登录，将跳转至首页')
				setTimeout(() => {
					this.$u.route({
						type:'reLaunch',
						url:'pages/index/index'
					})
				},1500)
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
