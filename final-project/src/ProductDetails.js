import React from "react";
import { useParams } from "react-router-dom";
import './ProductDetails.css';
import products from './Items';

const ProductDetails = () => {
    const { id } = useParams();
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="product-details-container">
            <img src={product.image} alt={product.brand} className="product-details-image" />
            <div className="product-details-info">
                <h2>{product.name}</h2>
                <h4>{product.brand}</h4>
                <p>Size: {product.size}</p>
                <p>Price: ${product.price}</p>
                <p>{product.description}</p>
            </div>
        </div>
    );
};

export default ProductDetails;
