import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const user = {

  state: () => {
    return {
      token: getToken(),
      name: '',
      avatar: ''
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // user login
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // get user info
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { nickname, avatar } = data

          commit('SET_NAME', nickname)
          commit('SET_AVATAR', avatar === null || avatar === '' || avatar === undefined ? '../assets/default_avatar.jpg' : avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // user logout
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        removeToken() // must remove  token  first
        commit('RESET_STATE')
        resolve()
      })
    }
  }
}
export default user
