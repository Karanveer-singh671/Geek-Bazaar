// Used for hitting the inventory route
import Api from '@/services/Api';

export default {
  retrieveCart() {
    return Api().get('cart');
  },
  addToCart(inventory) {
    return Api().post('cart', inventory);
  },
  removeFromCart(inventoryId) {
    return Api().delete(`cart/${inventoryId}`);
  },
};