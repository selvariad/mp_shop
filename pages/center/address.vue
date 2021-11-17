<template>
	<view>
		<view class="item" v-for="(res, index) in siteList" :key="res.id">
			<u-swipe-action @click="delAddress(index)" @content-click="getAddressId(index)" :options="swipeOptions">
				<view class="top">
					<view class="name">{{ res.name }}</view>
					<view class="phone">{{ res.phone }}</view>
					<u-tag v-if="res.is_default ? true:false" text="默认" plain size="mini">
					</u-tag>
				</view>
				<view class="bottom">
					{{res.province + res.city + res.county + res.address}}
					<u-icon name="edit-pen" :size="40" color="#999999" @click="editAddress(index)"></u-icon>
				</view>
			</u-swipe-action>
		</view>
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				siteList: [],
				swipeOptions: [{
					text: '删除',
					icon: 'trash-fill',
					iconSize: '20',
					style: {
						backgroundColor: '#f56c6c'
					}
				}],
			};
		},
		onLoad() {
			this.getData();
		},
		onShow() {
			// 编辑页面返回后刷新信息
			this.getData();
		},
		methods: {
			// 获取数据
			async getData() {
				const addressList = await this.$u.api.getUserAddress()
				this.siteList = addressList.data
				console.log(this.siteList)
			},
			// 跳转至新增地址页面
			toAddSite() {
				this.$u.route({
					url: '/pages/center/addSite'
				});
			},
			// 跳转至编辑地址页面并在vuex保存当前选中的地址
			editAddress(index) {
				this.$u.vuex('vuex_address', {
					name: this.siteList[index].name,
					phone: this.siteList[index].phone,
					province: this.siteList[index].province,
					city: this.siteList[index].city,
					county: this.siteList[index].county,
					address: this.siteList[index].address,
					is_default: this.siteList[index].is_default,
					id: this.siteList[index].id
				})
				this.$u.route({
					url: 'pages/center/editAddress'
				})
			},
			// 获取当前选中index地址的id用于结算订单传值并跳转
			getAddressId(index) {
				uni.setStorageSync('address_id', this.siteList[index].id)
				// console.log(uni.getStorageSync('back_Url'))
				if (uni.getStorageSync('back_Url') === '/pages/cart/order') {
					this.$u.route({
						url: '/pages/cart/order'
					})
					uni.setStorageSync('back_Url', '')
				}
			},
			delAddress(index) {
				this.$u.api.removeAddress(this.siteList[index].id)
				this.$u.toast('地址删除成功~')
				this.getData()
			}
		}
	};
</script>

<style lang="scss" scoped>
	.item {
		padding: 40rpx 20rpx;

		.top {
			display: flex;
			font-weight: bold;
			font-size: 34rpx;

			.phone {
				margin-left: 60rpx;
			}

			.tag {
				display: flex;
				font-weight: normal;
				align-items: center;

				text {
					display: block;
					width: 60rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #ffffff;
					font-size: 20rpx;
					border-radius: 6rpx;
					text-align: center;
					margin-left: 30rpx;
					background-color: rgb(49, 145, 253);
				}

				.red {
					background-color: red
				}
			}
		}

		.bottom {
			display: flex;
			margin-top: 20rpx;
			font-size: 28rpx;
			justify-content: space-between;
			color: #999999;
		}
	}

	.addSite {
		display: flex;
		justify-content: space-around;
		width: 600rpx;
		line-height: 100rpx;
		position: absolute;
		bottom: 30rpx;
		left: 80rpx;
		background-color: #1296db;
		border-radius: 60rpx;
		font-size: 30rpx;

		.add {
			display: flex;
			align-items: center;
			color: #ffffff;

			.icon {
				margin-right: 10rpx;
			}
		}
	}
</style>
