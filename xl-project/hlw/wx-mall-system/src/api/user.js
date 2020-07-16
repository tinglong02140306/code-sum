import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/xlshop/auth/jwt/ntoken',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/xlshop/sys/user/info',
    method: 'get',
    params: { token }
  })
}

export function resetPwd(data) {
	return request({
		url: '/xlshop/sys/user/reset',
		method: 'post',
		data
	})
}

export function fetchList(data) {
	return request({
		url: '/xlshop/sys/user/list',
		method: 'post',
		data
	})
}

export function addUser(data) {
	return request({
		url: '/xlshop/sys/user/add',
		method: 'post',
		data
	})
}

export function updateUser(data){
	return request({
		url: '/xlshop/sys/user/update',
		method: 'post',
		data
	})
}

export function updateUcUser(data) {
	return request({
		url: '/xlshop/user/user/updateUcUser',
		method: 'post',
		data: data
	})
}

