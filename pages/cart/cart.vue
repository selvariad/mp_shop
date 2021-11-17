<template>
	<view class="wrap">
		<template v-if="vuex_token">
			<view v-if="goodsList.length" class="cartGoodsList u-p-b-80">
				<view class="cartGoods u-flex u-p-15" v-for="goods in goodsList" :key="goods.id">
					<view>
						<u-checkbox v-model="goods.is_checked ? true:false" :name="goods.id" @change="checkboxChange"
							size="40" shape="circle"></u-checkbox>
					</view>
					<view class="goodsInfo u-flex u-p-10">
						<navigator :url="`/pages/goods/goodsInfo?id=${goods.goods_id}`">
							<u-image border-radius="15" width="200rpx" height="200rpx" :src="goods.goods.cover_url">
							</u-image>
						</navigator>
						<view class="goodsBaseInfo u-flex u-row-between u-col-top u-p-10">
							<navigator class="priceNum" :url="`/pages/goods/goodsInfo?id=${goods.goods_id}`">
								<text class="title u-p-l-10 u-font-32">{{goods.goods.title}}</text>
								<br>
								<text class="small">{{goods.goods.description}}</text>
								<view class="u-text-right small">
									库存:<text style="color:red">{{goods.goods.stock}}</text>
								</view>
							</navigator>
							<view class="priceNum u-flex u-row-between">
								<text class="price u-font-34">￥{{goods.goods.price}}</text>
								<u-number-box v-model="goods.num" :min="1" :max="goods.goods.stock" :index="goods.id"
									@change="changeCount"></u-number-box>
								<u-icon @tap="removeGoods(goods.id)" name="trash" color="#e83333" size="36">
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
			<view class="u-flex-5">
				<u-checkbox v-model="checkedAll" size="40" shape="circle">全选</u-checkbox>
			</view>
			<view class="u-flex u-flex-7 u-row-around">
				<view>
					<text class="title">合计:</text>
					<text class="price">￥{{getTotalPrice}}</text>
				</view>
				<u-button type="primary" :ripple="true" shape="circle" @click="toOrder">去结算</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: []
			};
		},
		onShow() {
			if (this.vuex_token) {
				this.getData()
			}
		},
		methods: {
			// 获取购物车数据
			async getData() {
				await this.$u.api.getCartList().then(res => {
					this.goodsList = res.data
					console.log(this.goodsList)
				}, err => {
					console.log('fail')
				})
			},
			// 选中某个复选框时，由checkbox时触发
			async checkboxChange(e) {
				const {
					value, //商品选中状态
					name //商品
				} = e
				// 记录已选中的商品
				let checkedId = []
				this.goodsList.forEach((item) => {
					if (item.is_checked) {
						checkedId.push(item.id)
					}
				})
				// 更改选中状态
				// 将true的添加进checkId,false的删除
				if (!value) {
					// 请求变更选中状态的API
					checkedId.splice(checkedId.indexOf(name), 1)
					await this.$u.api.getCartChecked(checkedId)
				} else {
					checkedId.push(name)
					await this.$u.api.getCartChecked(checkedId)
				}
				// 选中状态变更后重新获取数据
				this.getData()
			},
			// 更改商品数量
			async changeCount(event) {
				const {
					value,
					index
				} = event
				await this.$u.api.cartCountUpdata(index, value)
			},
			// 将商品移出购物车
			async removeGoods(id) {
				await this.$u.api.removeCartGoods(id)
				this.$u.toast("移除成功~")
				// 再次调用获取商品列表
				this.getData()
			},
			// 全选点击事件
			async setCheck(value) {
				let check = []
				if (!value) {
					// 如果为非全选中，则点击后全选中
					await this.$u.api.getCartChecked(check)
				} else {
					// 如果为全选中，则点击后全部取消选中
					this.goodsList.forEach((item) => {
						check.push(item.id)
					})
					await this.$u.api.getCartChecked(check)
				}
				this.getData()
			},
			// 跳转至结算页面
			toOrder() {
				this.$u.route({
					url:'pages/cart/order'
				})
			}
		},
		computed: {
			// 全选
			checkedAll: {
				get() {
					// 如全部选中则默认选中
					let checkLength = []
					this.goodsList.forEach((item) => {
						if (item.is_checked) {
							checkLength.push(item.id)
						}
					})
					if (this.goodsList.length == checkLength.length) {
						return true
					}
				},
				set(value) {
					this.setCheck(value)
				}
			},
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
			bottom: 98rpx;
			padding: 20rpx 20rpx;
		}
	}
</style>
