<template>
	<view class="wrap">
		<u-cell-group>
			<u-cell-item icon="map" size="large" :title="this.address.name + ' ' +this.address.phone"
				:label="this.address.province + this.address.city + this.address.county" @click="toAddress">
			</u-cell-item>
		</u-cell-group>
		<template v-if="vuex_token">
			<view v-if="goodsList.length" class="cartGoodsList u-p-b-80">
				<view class="cartGoods u-flex u-p-15" v-for="goods in goodsList" :key="goods.id">
					<view class="goodsInfo u-flex u-p-10">
						<navigator :url="`/pages/goods/goodsInfo?id=${goods.goods_id}`">
							<u-image border-radius="15" width="200rpx" height="200rpx" :src="goods.goods.cover_url">
							</u-image>
						</navigator>
						<view class="goodsBaseInfo u-flex u-row-between u-col-top u-p-10">
							<navigator class="priceNum" :url="`/pages/goods/goodsInfo?id=${goods.goods_id}`">
								<text class="title u-p-l-10 u-font-32">{{goods.goods.title}}</text>
								<br>
							</navigator>
							<view class="priceNum u-flex u-row-between">
								<text class="price u-font-34">￥{{goods.goods.price}}</text>
								<text>{{'x' + goods.num}}</text>
								</u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="empty" v-else>
				<u-empty text="您还未添加任何商品到购物车~" mode="car"></u-empty>
			</view>
		</template>
		<template class="page-box" v-else>
			<u-empty text="请登陆后查看购物车~" mode="permission"></u-empty>
		</template>
		<view class="bottomFixed">
			<view class="u-flex u-flex-1 u-row-between">
				<view>
					<text class="title">合计:</text>
					<text class="price">￥{{getTotalPrice}}</text>
				</view>
				<u-button type="primary" :ripple="true" shape="circle" @click="toOrder">提交订单</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [],
				address: ''
			};
		},
		onShow() {
			if (this.vuex_token) {
				this.getData()
			}
		},
		methods: {
			// 获取订单与地址数据
			async getData() {
				const res = await this.$u.api.getOrderPreview()
				console.log(res)
				let defaultAddress = ''
				res.address.forEach((item) => {
					// 先将是否默认，再根据缓存判断是否有选择某个地址
					if (item.is_default) {
						defaultAddress = item
					}
					if (uni.getStorageSync('address_id') !== 0 && uni.getStorageSync('address_id') == item
						.id) {
						defaultAddress = item
						uni.setStorageSync('address_id', 0)
					}
				})
				this.address = defaultAddress
				this.goodsList = res.carts
				console.log(this.address)
			},
			// 跳转至地址管理页面
			toAddress() {
				uni.setStorageSync('back_Url', '/pages/cart/order')
				this.$u.route({
					url: 'pages/center/address'
				})
			},
			// 跳转至结算页面
			toOrder() {
				this.$u.toast('未完工~')
			}
		},
		computed: {
			// 合计价格
			getTotalPrice() {
				let price = []
				this.goodsList.forEach((item) => {
					if (item.is_checked) {
						price.push(item.goods.price * item.num)
					}
				})
				const TotalPrice = price.reduce((pre, value) => {
					return pre + value
				}, 0)
				return TotalPrice
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		min-height: 80vh;

		.empty {
			height: 80vh;
		}

		.loading {
			text-align: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		.title,
		.price {
			font-weight: 800;
		}

		.price {
			color: #e83333;
		}

		.cartGoodsList {
			.cartGoods {
				.goodsInfo {
					width: 100%;
					background-color: rgb(251, 250, 251);
					border-radius: 20rpx;

					.goodsBaseInfo {
						width: 100%;
						height: 200rpx;
						flex-direction: column;

						.priceNum {
							width: 100%;
						}
					}
				}
			}
		}

		.bottomFixed {
			display: flex;
			align-items: center;
			background-color: #fff;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 20rpx 20rpx 20rpx 150rpx;
		}
	}
</style>
