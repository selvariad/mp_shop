<template>
	<view class="wrap u-rela">
		<template>
			<!-- 商品信息展示 -->
				<view class="goods-show ">
					<!-- 图片展示 -->
					<view class="u-text-center">
						<image  mode="heightFix" :src="goodsInfo.cover_url"></image>
					</view>
					<view class="u-p-20">
						<!-- 商品基本信息 -->
						<view class="base-info ">
							<text class="title u-font-40">{{goodsInfo.title}}</text>
							<view class="u-flex u-row-between u-m-t-20 u-m-b-20">
								<text class="price u-font-32">￥{{goodsInfo.price}}</text>
								<text class="small">库存:{{goodsInfo.stock}}</text>
								<text class="small">销量:{{goodsInfo.sales}}</text>
							</view>
						</view>
						<!-- tabs组件 -->
						<u-tabs :list="tabsList" :is-scroll="false" :current="tabsCurrent" @change="tabsChange"></u-tabs>
						<view class="u-p-b-80">
							<!-- 商品详情区 -->
							<template v-if="tabsCurrent==0">
								<u-parse :html="goodsInfo.details"></u-parse>
							</template>
							<!-- 商品评论区 -->
							<template v-if="tabsCurrent==1">
								<template v-if="commentList.length">
									<view class="comment" v-for="(comment, index) in commentList" :key="index">
										<view class="left">
											<image :src="comment.user.avatar_url" mode="aspectFill"></image>
										</view>
										<view class="right">
											<view class="top">
												<view class="name">{{ comment.user.name }}</view>
												<view class="like num">{{ comment.star }}</view>
											</view>
											<view class="content">{{ comment.content }}</view>
											<view class="reply-box">
												<view class="text">{{ comment.reply }}</view>
											</view>
											<view class="bottom">
												{{ comment.created_at }}
											</view>
										</view>
									</view>
								</template>
								<template v-else>
									<!-- 评论为空 -->
									<u-empty text="暂无评论" src="order"></u-empty>
								</template>
							</template>
							<!-- 商品推荐区 -->
							<template v-if="tabsCurrent==2">
								<u-row gutter="16">
									<u-col span="6" v-for="(goods,index) in goodsList" :key="index">
										<goods-card :item="goods"></goods-card>
									</u-col>
								</u-row>
							</template>
						</view>
					</view>
				</view>
				<!-- 提交订单栏 -->
				<view class="navigation">
					<view class="left">
						<view class="item" @tap="collect">
							<u-icon v-if="isCollect == 0" name="heart" :size="40" :color="$u.color['contentColor']"></u-icon>
							<u-icon v-else name="heart-fill" :size="40" color="red"></u-icon>
							<view class="text u-line-1">{{ isCollect == 1 ? "已收藏" : "收藏"}}</view>
						</view>
						<view class="item" @tap="toCart">
							<u-badge :count="cartCount" bgColor="#2979ff" :is-center="true"></u-badge>
							<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
							<view class="text u-line-1">购物车</view>
						</view>
					</view>
					<view class="right">
						<u-button :disabled="goodsInfo.stock?false:true" class="cart btn" @click="addCart" :ripple="true" type="primary">加入购物车</u-button>
					</view>
				</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品基本信息
				goods: {},
				// 推荐商品
				tabsList: [{
					name: '商品详情'
				}, {
					name: '商品评论',
					count:0
				}, {
					name: '推荐商品'
				}],
				tabsCurrent: 0,
				goodsInfo:[],
				commentList: [],
				goodsId: null,
				goodsList:[],
				isCollect:0,
				cartCount:0,
			}
		},
		onLoad(option) {
			this.goodsId = option.id
			this.getData()
			this.getCartCount()
		},
		methods: {
			// 获取商品信息
			async getData() {
				const res = await this.$u.api.getGoodsInfo(this.goodsId)
				this.goodsInfo = res.goods
				this.commentList = res.goods.comments
				this.isCollect = res.goods.is_collect
				this.tabsList[1].count = res.goods.comments.length
				this.goodsList = res.like_goods
			},
			// 切换tabs
			tabsChange (index) {
				this.tabsCurrent = index
			},
			// 添加收藏
			async collect () {
				// 请求收藏API
				await this.$u.api.goodsCollect(this.goodsId)
				// 判断收藏提示
				if(this.isCollect == 1) {
					this.isCollect = 0
					this.$u.toast('取消收藏成功~')
				} else {
					this.isCollect = 1
					this.$u.toast('添加收藏成功~')
				}
				// 重新请求数据
				this.getData()
			},
			// 添加购物车
			async addCart () {
				// 验证是否已登录
				if(this.$u.utils.validToken()) {
					// 请求加入购物车API
					const collectInfo = {
						'goods_id':this.goodsId,
						'num':1
					}
					await this.$u.api.addCart(collectInfo)
					this.$u.toast('添加购物车成功~')
					this.getCartCount()
				}
			},
			async toCart () {
				this.$u.route({
					type:'switchTab',
					url:'pages/cart/cart'
				})
			},
			async getCartCount () {
				// 验证是否已登录
				if(this.$u.utils.validToken()) {
					const count = await this.$u.api.getCartList()
					this.cartCount = count.data.length
				} else {
					this.cartCount = 0
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		height: 90vh;
		.loading{
			text-align: center;
			position: absolute;
			top: 50%;
			left:50%;
			transform:translate(-50%,-50%);
		}
		.goods-show {
			.base-info {
				.title,
				.price {
					font-weight: bolder;
				}

				.price {
					color: rgb(209, 45, 58);
				}
			}

			.comment {
				display: flex;
				padding: 30rpx;

				.left {
					image {
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						background-color: #f2f2f2;
					}
				}

				.right {
					flex: 1;
					padding-left: 20rpx;
					font-size: 30rpx;

					.top {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;

						.name {
							color: #1296db;
						}

						.like {
							display: flex;
							align-items: center;
							color: #9a9a9a;
							font-size: 26rpx;

							.num {
								margin-right: 4rpx;
								color: #9a9a9a;
							}
						}

						.highlight {
							color: #1296db;

							.num {
								color: #1296db;
							}
						}
					}

					.content {
						margin-bottom: 10rpx;
					}

					.reply-box {
						background-color: rgb(242, 242, 242);
						border-radius: 12rpx;
						text-indent: 1em;
						.item {
							padding: 20rpx;
							border-bottom: solid 2rpx $u-border-color;

							.username {
								font-size: 24rpx;
								color: #999999;
							}
						}

						.all-reply {
							padding: 20rpx;
							display: flex;
							color: #1296db;
							align-items: center;

							.more {
								margin-left: 6rpx;
							}
						}
					}

					.bottom {
						margin-top: 20rpx;
						display: flex;
						font-size: 24rpx;
						color: #9a9a9a;

						.reply {
							color: #1296db;
							margin-left: 10rpx;
						}
					}
				}
			}
		}

		// min-height: 100vh;
		.navigation {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			border: solid 2rpx #f2f2f2;
			background-color: #ffffff;
			padding: 16rpx 0;
			justify-content: space-between;
			.left {
				flex:3;
				display: flex;
				font-size: 20rpx;
				justify-content: space-around;
				.item {
					position: relative;
					text-align: center;
				}
			}

			.right {
				flex:9;
				display: flex;
				font-size: 28rpx;
				justify-content: flex-end;
				align-items: center;
				.btn {
					text-align: center;
					line-height: 66rpx;
					width: 90%;
					border-radius: 10rpx;
					color: #ffffff;
				}

				.cart {
					background-color: #1296db;
					margin-right: 30rpx;
				}

				.buy {
					background-color: #ff7900;
				}
			}
		}
	}
</style>