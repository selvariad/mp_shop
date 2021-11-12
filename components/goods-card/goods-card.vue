<template>
	<view>
		<navigator class="goods-item">
			<u-image class="u-skeleton-fillet" width="100%" height="300rpx" :src="item.cover_url"></u-image>
			<view class="goods-item-name u-line-1 u-text-center u-skeleton-rect">{{item.title ? item.title : '商品名称'}}</view>
			<view class="goods-item-msg u-flex u-row-between">
				<view class="item-price u-skeleton-rect">￥{{item.price}}</view>
				<view class="item-sales u-skeleton-rect">销量:{{item.sales}}</view>
			</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			item:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.goods-item {
		padding: 40rpx;
		box-shadow: 0 12rpx 20rpx 0 rgba(0,0,0,.1);
		.good-item-name {
			margin: 10rpx 0;
			font-weight: 500;
			font-size: 32rpx;
		}
		.item-price {
			color: red;
		}
		.item-sales {
			color: #888
		}
	}
</style>
