import React from "react";
import { useNavigate } from "react-router-dom";
import './ProductList.css';
import products from './Items';

const ProductList = ({ priceRange, selectedCheckboxes, searchQuery, onAddToCart  }) => {
    const navigate = useNavigate();

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    const handleAddToCart = (product, e) => {
        e.stopPropagation();
        onAddToCart(product);
    };

    const filteredProducts = products.filter(product => {
        const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
        const inSelectedBrands = Object.keys(selectedCheckboxes).some(brand => 
            selectedCheckboxes[brand] && product.brand.toLowerCase() === brand );
        const selectedSizes = Object.keys(selectedCheckboxes).filter(size => 
            size.startsWith('_') && selectedCheckboxes[size]
        );
        const inSelectedSize = selectedSizes.includes(`_${product.size}`);
        const noBrandSelected = Object.values(selectedCheckboxes).slice(0, 3).every(v => !v); 
        const noSizeSelected = selectedSizes.length === 0;
        const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearchQuery && inPriceRange && (inSelectedBrands || noBrandSelected) && (inSelectedSize || noSizeSelected);
    });

    return (
        <div className="product-list">
            {filteredProducts.map(product => (
                <div 
                    className="product-card" 
                    key={product.id} 
                    onClick={() => handleProductClick(product.id)}
                >
                    <img src={product.image} alt={product.brand} className="product-image" />
                    <div className="product-details">
                        <h2>{product.name}</h2>
                        <h4>{product.brand}</h4>
                        <p>Size: {product.size}</p>
                        <p>Price: ${product.price}</p>
                        <button onClick={(e) => handleAddToCart(product, e)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
