<template>
	<view>
		<view class="wrap">
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<u-cell-group>
					<u-cell-item icon="map" size="large" title="API出问题了,地址请求报错"
						label="postman请求address报错代码500">
					</u-cell-item>
				</u-cell-group>
				<view class="order">
					<view class="top">
						<view class="right">{{'订单号:' + dataList.order_no}}</view>
					</view>
					<view class="item" v-for="(item,index) in goodsList" :key="item.id">
						<view class="left">
							<image :src="item.cover_url" mode="aspectFill"></image>
						</view>
						<view class="content">
							<view class="title u-line-2">{{ item.title}}</view>
							<view class="type">{{ item.description }}</view>
						</view>
						<view class="right">
							<view class="price">
								￥{{ item.price.toFixed(2) }}
							</view>
							<view class="number">x{{ dataList.orderDetails.data[index].num }}</view>
						</view>
					</view>
					<view class="total">
						合计:
						<text class="total-price">
							￥{{ dataList.amount.toFixed(2) }}
						</text>
					</view>
					<view class="bottom">
						<view class="more">
							<text>提交订单：{{dataList.created_at}}</text>
							<br>
							<text>订单信息更新：{{dataList.updated_at}}</text>
						</view>
						<view class="evaluate btn">{{getStatus(dataList.status)}}</view>
					</view>
				</view>
				<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2"></u-loadmore>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				goodsList: [],
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore']
			};
		},
		onLoad() {
			this.getOrderList();
		},
		computed: {
			
		},
		methods: {
			reachBottom() {
				// 此tab为空数据
				if (this.current != 2) {
					this.loadStatus.splice(this.current, 1, "loading")
					setTimeout(() => {
						this.getOrderList(this.current);
					}, 1200);
				}
			},
			// 页面数据
			async getOrderList() {
				const res = await this.$u.api.getOrderDetail(uni.getStorageSync('order_id'))
				this.dataList = res
				this.goodsList = res.goods.data
				console.log(this.dataList)
				this.loadStatus.splice(this.current, 1, "loadmore")
			},
			// 根据状态返回按钮字符
			getStatus(status) {
				if (status == 1) {
					return '去下单'
				} else if (status == 2) {
					return '去支付'
				} else if (status == 3) {
					return '已发货'
				} else if (status == 4) {
					return '已收货'
				} else if (status == 5) {
					return '已过期'
				}
			}
		}
	};
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f2f2f2;
	}

	/* #endif */
</style>

<style lang="scss" scoped>
	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}

				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}

			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
			}
		}

		.bottom {
			display: flex;
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;

			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}

			.evaluate {
				color: rgb(17, 183, 233);
				border-color: rgb(17, 183, 233);
			}
		}
	}

	.centre {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;

		image {
			width: 164rpx;
			height: 164rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
		}

		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}

		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
</style>
