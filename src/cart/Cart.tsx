import React from 'react';
import CartItem from '../cartItem/cartItem';
import { Wrapper } from './cart.style';
import { CartItemType } from '../App';
import Item from '../items/Item';

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
}

const cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {

    const calculateTotal = (items: CartItemType[]) =>
        items.reduce(( ack: number, item ) => ack + item.amount * item.price, 0);

    return (
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? <p>No Items Added Yet</p> : null}
            {cartItems.map( item => (
                <CartItem 
                    key = {item.id} 
                    item = {item} 
                    addToCart = {addToCart} 
                    removeFromCart = {removeFromCart}
                />
            ))}
            <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
        </Wrapper>
    )
}

export default cart
