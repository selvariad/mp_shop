<template>
	<u-upload 
	ref="upload"
	:action="action" 
	:max-size="5 * 1024 * 1024" 
	max-count="1"
	:multiple="false"
	:custom-btn="true"
	:beforeUpload="beforeUpload"
	:show-upload-list="false"
	:form-data="formData"
	@on-success="onSuccess"
	>
	  <u-avatar :src="vuex_user.avatar_url" size="140" slot="addBtn"></u-avatar>
	</u-upload>
</template>

<script>
	let _this = {} //防止this找不到实例
	export default {
		created() {
			_this = this
		},
		data() {
			return {
				action: '',
				formData:{},
				FixFileName:''
			};
		},
		methods:{
			async beforeUpload(index,list) {
				// 获取文件名
				const {file} = list[0]
				// #ifdef H5
				const fileName = file.name
				// #endif
				
				// #ifndef H5
				const fileName = file.path
				// #endif
				// 请求上传API
				const osstoken = await _this.$u.api.avatarUpdate()
				// 设置上传域名
				_this.action = osstoken.host
				// 给上传文件设置全局唯一标识符guid（文件名）
				const lastName = fileName.slice(fileName.lastIndexOf('.'))
				const FixName = _this.$u.guid(20) + lastName
				this.FixFileName = FixName
				// 设置上传参数
				_this.formData = {
					'key' : FixName,
					'policy': osstoken.policy,
					'OSSAccessKeyId': osstoken.accessid, 
					'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
					'signature': osstoken.signature,
				}
			},
			async onSuccess(){ // 文件上传成功回调函数
			    // 移除老的头像
				this.$refs.upload.remove(0)
				// 请求更新头像API
				await this.$u.api.avatarRefresh({
					'avatar':this.FixFileName
				})
				// 更新用户信息
				this.$u.utils.UpdateUserInfo()
				this.$u.vuex('vuex_user',UserInfo)
				this.$u.toast('头像上传成功')
			}
		}
	}
</script>

<style>

</style>
