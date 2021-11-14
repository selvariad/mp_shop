<template>
	<view class="u-p-l-40 u-p-r-40">
			<u-form :model="form" ref="uForm">
				<u-form-item label="昵称" prop="name" required>
					<u-input v-model="form.name" />
				</u-form-item>
			</u-form>
			<u-button @click="submit">提交</u-button>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					intro: '',
				},
				rules: {
					name: [
						{ 
							required: true, 
							message: '请输入昵称', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
				}
			};
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						// 更新用户信息
						await this.$u.api.UserInfoUpdate(this.form)
						this.$u.utils.UpdateUserInfo()
						this.$u.toast('修改保存成功')
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.form.name = this.vuex_user.name
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>

<style>
</style>
