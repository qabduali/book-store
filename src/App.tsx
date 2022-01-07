import React from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { LinearProgress, Grid, Drawer, Badge } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Wrapper, StyledButton } from './App.styles';
import { isLabeledStatement } from 'typescript';
import Item from './items/Item';
import Cart from './cart/Cart';


export type CartItemType = {
  id: number;
  category: string;
  description: string; 
  image: string;
  price: number;
  title: string;
  amount: number;
}

const getBooks = async(): Promise<CartItemType[]> =>
  await ( await fetch('https://fakestoreapi.com/products')).json();

const App = () => {

  const [cartOpen, setCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'books', 
    getBooks
  );

  console.log( data );
  
  const getTotal = (items: CartItemType[]) => 
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems( prev => {

      const isInCart = prev.find( item => item.id === clickedItem.id);

      if( isInCart ){
        return prev.map( item => (
          item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item
        ))
      };

      return [...prev, { ...clickedItem, amount: 1 }];
    })
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems( prev => (
      prev.reduce( (ack, item) => {
        if( item.id === id ) {
          if( item.amount === 1 ) return ack;
          return [...ack, {...item, amount: item.amount - 1}];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[] ) 
    ))
  };

  if (isLoading) return <LinearProgress/>;
  if (error) return <div>You have an error</div>

  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={()=>setCartOpen(false)}>
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart}></Cart>
      </Drawer>
      <StyledButton onClick={()=>setCartOpen(true)}>
        <Badge badgeContent={getTotal(cartItems)} color='error'>
          <ShoppingCartIcon></ShoppingCartIcon>
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        )))}
      </Grid>
    </Wrapper>
  );
}

export default App;
