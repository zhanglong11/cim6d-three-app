import api from '@/api/systemConfig'
import $utils from '@/utils/utils'
export default {
  namespaced: true,
  state: {
    argTree: JSON.parse(wx.getStorageSync('argTree') || '[]')
  },
  mutations: {
    changeList(state, tree) {
      state.argTree = tree
    }
  },
  actions: {
    async getArgTree({ commit }) {
      const tree = await api.getArgTree()
      $utils.treeForEach(tree, e => {
        e.label = e.argText
        e.value = e.argCode
      })
      wx.setStorageSync('argTree', JSON.stringify(tree))
      commit('changeList', tree)
    }
  }
}
