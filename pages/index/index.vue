<template>
	<view >
		<u-swiper :list="slides" name="img_url" height="320"></u-swiper>
		<view class="u-text-center">
			<u-tabs :list="sortList" :current="currentSort" @change="changeSort" bar-width="100" item-width="160"></u-tabs>
		</view>
		<u-row gutter="16" class="u-skeleton">
			<u-col span="6" v-for="(item,index) in goods.length !== 0 ? goods : [{}]" :key="index">
				<goods-card :item="item"></goods-card>
			</u-col>
		</u-row>
		<!-- 引入骨架屏 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentSort:0,
				page:1,
				slides:[],
				sortList:[{name:'默认'},{name:'销量'},{name:'推荐'},{name:'最新'}],
				goods:[],
				loading:false,
			}
		},
		onLoad(options) {
			this.$u.utils.validToken()
			
			this.getNewData()
		},
		methods: {
			changeSort(index) {
				this.currentSort = index
				this.goods = [] //改变分页时，情况原列表加载新产品信息
				this.getNewData()
			},
			async getNewData() {
				this.loading = true
				const params = {
					page:this.page
				}
				if(this.currentSort == 1) params.sales = 1
				if(this.currentSort == 2) params.recommend = 1
				if(this.currentSort == 3) params.new = 1
				const res = await this.$u.api.getIndex(params)
				this.loading = false
				this.slides = res.slides
				this.goods = [...this.goods,...res.goods.data] //es6语法，将原有的展开，后续加载放到数组后
			}
		},
		onReachBottom(){
			// 下拉刷新请求新数据
			this.page += 1
			this.getNewData()
		}
	}
</script>


