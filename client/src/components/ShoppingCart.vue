<template lang="html">
  <section class="shopping-cart">
    <div class="list" v-if="inventories" v-for="inventory in inventories">
        <div class="row inventory">
          <div class="col-xs-12 col-sm-6 name">{{inventory.name}}</div>
          <div class="col-xs-12 col-sm-6 metadata">
            <!-- quantity end -->
            <div class="price">${{inventory.price}}</div>
            <button type="button" class="close btn-remove" @click.prevent.stop="removeFromCart(inventory.id)">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    <div v-if="!inventories.length" class="cart-empty">
      No inventories :(
    </div>
    <div class="total"><span>Total</span> ${{total}}</div>
    <router-link :to="'orders'" tag="button" :disabled="!inventories.length" class="btn btn-primary btn-block" @click.native="checkoutCart()">
      Checkout
    </router-link>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  created () {
    this.$store.dispatch('fetchCart');
  },
  computed: {
    total () {
     return this.inventories.reduce((sum, p) => sum + (p.quantity * p.price), 0)
    },
    ...mapGetters({
      inventories: 'getCartItems'
    })
  },
  methods: mapActions([
      'addToCart',
      'removeFromCart',
      'subtractFromCart',
      'checkoutCart'
    ]) 
}
</script>

<style lang="scss" scoped>
.btn-primary {
  color: #ffffff;
  background-color: #E37222;
  border-color: #E37222;
}
.btn-primary:hover {
  background-color: #E37222;
  border-color: #E37222;
  opacity: 0.8;
}
.btn-primary:disabled {
  background-color: #E37222;
  border-color: #E37222;
  opacity: 0.8;
}

.shopping-cart {
  padding: 1rem;
}

.inventory {
  padding: .5rem 0;
  align-items: center;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  flex-grow: 1;
  text-overflow: ellipsis;
  font-weight: 500;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.metadata {
  display: flex;
  align-items: center;
}

.quantity {
  width: auto;
  flex-shrink: 0;

  input.form-control {
    width: 2rem;
    flex: 0;
    text-align: center;
    padding-left: 0;
    padding-right: 0;
    background-color: #fff;
  }
}

.price {
  font-weight: 500;
  width: 5rem;
  padding: 0 0.5rem;
  flex-shrink: 0;
  flex-grow: 1;
  text-align: right;
}

.btn-remove {
  flex-shrink: 0;
  margin: 0 .5rem;
}

.cart-empty {
  text-align: center;
  padding: 2rem;
  font-weight: 500;
}

.total {
  font-weight: 500;
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}

@media (min-width: 576px) {
  .shopping-cart {
    min-width: 28rem;
  }
}
</style>
