import React, { useReducer } from 'react'

export default function ProductList() {
   const [state, dispatch] =  useReducer(reducer, initialState)
   const initialState = { cart: [] }
    function reducer(state, action){
        switch (action.type) {
          case 'ADD_ITEM':
            return
          case 'REMOVE_ITEM':
            return
          case 'CLEAR_CART ':
            return
        }
    }
  return (
    <div>
      <h1>Cart Managers</h1>
      <h3>Products</h3>
      <div>
        <p>Book - 2000</p>
        <button onClick={() => dispatch({ type: 'ADD_ITEM' })}>
          Add to Cart
        </button>
      </div>
      <div>
        <p>Laptop - 150000</p>
        <button onClick={() => dispatch({ type: 'ADD_ITEM' })}>
          Add to Cart
        </button>
      </div>
      <div>
        <p>Headphones- 2000</p>
        <button onClick={() => dispatch({ type: 'ADD_ITEM' })}>
          Add to Cart
        </button>
      </div>
      <div>
        <h2>Cart</h2>
      </div>
    </div>
  )
}