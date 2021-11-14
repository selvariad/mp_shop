const install = (Vue,vm) => {
	// 验证是否有token，否则跳转登录页
	const validToken = () => {
		const token = vm.vuex_token
		if (!token) {
			// 记录跳转前页面
			const currentPage = getCurrentPages().pop()
			const { options , route } = currentPage //获取页面参数
			let pageParams = '' //保存页面参数
			if(Object.keys(options).length !== 0) {
				pageParams = Object.keys(options).reduce((pre,current) => {
					return `${pre}${current}=${options[current]}&` //options[current] = value[key] key对应的值
				},'?').slice(0,-1)
			}
			uni.setStorageSync('back_Url',route + pageParams)
			vm.$u.toast('请登录')
			setTimeout(() => {
				vm.$u.route({
					type:'reLaunch',
					url:'pages/auth/login'
				})
			},2000)
			return false
		}
		return true
	};
	// 用户信息变更时更新信息
	const UpdateUserInfo = async () => {
		// 重新请求用户信息
		const UserInfo = await vm.$u.api.getUserInfo()
		// 重新缓存用户信息
		vm.$u.vuex('vuex_user',UserInfo)
	}
	vm.$u.utils = {
		validToken,
		UpdateUserInfo
	}
}

export default {
	install
}