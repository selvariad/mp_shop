// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
// let sampleUrl = '/api/sample';

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 首页
	let getIndex = (params = {}) => vm.$u.get('/api/index', params);
	// 登录认证
	const getLogin = params => vm.$u.post('/api/auth/login', params);
	// 注册认证
	const getRegister = params => vm.$u.post('/api/auth/register', params);
	// 用户信息认证
	const getUserInfo = () => vm.$u.get('/api/user')
	// 修改用户信息
	const UserInfoUpdate = params => vm.$u.put('/api/user',params)
	// 头像上传
	const avatarUpdate = () => vm.$u.get('/api/auth/oss/token')
	// 更新头像
	const avatarRefresh = params => vm.$u.patch('/api/user/avatar',params)
	// 退出登录
	const Logout = () => vm.$u.post('/api/auth/logout');
	// 获取商品
	const getGoods = params => vm.$u.get('/api/goods',params)
	// 获取商品信息
	const getGoodsInfo = id => vm.$u.get(`/api/goods/${id}`)
	// 商品收藏
	const goodsCollect = id => vm.$u.post(`/api/collects/goods/${id}`)
	// 添加购物车
	const addCart = params => vm.$u.post('/api/carts',params)
	// 请求购物车列表
	const getCartList = () => vm.$u.get('/api/carts')
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getIndex,
		getLogin,
		getRegister,
		getUserInfo,
		UserInfoUpdate,
		avatarUpdate,
		avatarRefresh,
		Logout,
		getGoods,
		getGoodsInfo,
		goodsCollect,
		addCart,
		getCartList
	};
}

export default {
	install
}