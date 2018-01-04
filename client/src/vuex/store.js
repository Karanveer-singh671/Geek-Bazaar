import Vue from 'vue';
import Vuex from 'vuex';
import inventories from './modules/inventories';
import cart from './modules/cart';
import order from './modules/order';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    inventories,
    cart,
    order,
  },
  strict: debug,
});
