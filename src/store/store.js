import Vue from 'vue';
import Vuex from 'vuex';
import tagsview from '@/common/modules/tagsview.js'
import getters from '@/common/getter.js'

Vue.use(Vuex)
const store= new Vuex.Store({
  modules:{
    tagsview
  },
  getters
})

export default store
