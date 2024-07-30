import React from 'react';
import './Cart.css';

const Cart = ({ cart, onDelete }) => {
    return (
        <div className="cart">
            <h2>Your Cart</h2>
            <ul>
                {cart.map((product, index) => (
                    <li key={index} className="cart-item">
                        <img src={product.image} alt={product.name} />
                        <div className="product-details">
                            <h1>{product.name}</h1>
                            <h4>${product.price}</h4>
                            <p>Count: {product.count}</p>
                        </div>
                        <div className="delete-button-container">
                            <button className="delete-button" onClick={() => onDelete(product.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cart;
