import React, { useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Catalog.css';
import Search from "./Search";
import ProductList from "./ProductList";

const Catalog = ({ onAddToCart }) => {
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({
        niki: false,
        mizunki: false,
        abibas: false,
        black: false,
        white: false,
        red: false,
        _39: false,
        _40: false,
        _41: false,
        _42: false,
        _43: false,
        _44: false,
        _45: false,
    });
    const [searchQuery, setSearchQuery] = useState('');

    const handleCheckboxChange = (e) => {
        setSelectedCheckboxes({
            ...selectedCheckboxes,
            [e.target.name]: e.target.checked,
        });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <div className="container">
            <div className="box box1" style={{ textAlign: "left", fontSize: 20 }}>
                <h1 style={{ fontSize: 20 }}>Company</h1>
                <div style={{ paddingLeft: 20 }}>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                name="niki" 
                                checked={selectedCheckboxes.niki} 
                                onChange={handleCheckboxChange} 
                            />
                            Niki
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                name="mizunki" 
                                checked={selectedCheckboxes.mizunki} 
                                onChange={handleCheckboxChange} 
                            />
                            Mizunki
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                name="abibas" 
                                checked={selectedCheckboxes.abibas} 
                                onChange={handleCheckboxChange} 
                            />
                            Abibas
                        </label>
                    </div>
                </div>
                <div>
                    <label>
                        <h1 style={{ fontSize: 20 }}>Price : </h1> {priceRange[0]} - {priceRange[1]} $
                        <Slider
                            range
                            min={0}
                            max={1000}
                            value={priceRange}
                            onChange={setPriceRange}
                            trackStyle={[{ backgroundColor: 'black' }]}
                            handleStyle={[
                                { borderColor: 'black', backgroundColor: 'black' },
                                { borderColor: 'black', backgroundColor: 'black' }
                            ]}
                            railStyle={{ backgroundColor: 'black' }}
                        />
                    </label>
                </div>
                <h1 style={{ fontSize: 20 }}>Color</h1>
                <div className="checkbox-row" style={{ paddingLeft: 20 }}>
                    <label>
                        <input 
                            type="checkbox" 
                            name="black" 
                            checked={selectedCheckboxes.black} 
                            onChange={handleCheckboxChange} 
                        />
                        Black
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="white" 
                            checked={selectedCheckboxes.white} 
                            onChange={handleCheckboxChange} 
                        />
                        White
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="red" 
                            checked={selectedCheckboxes.red} 
                            onChange={handleCheckboxChange} 
                        />
                        Red
                    </label>
                </div>
                <h1 style={{ fontSize: 20 }}>Size</h1>
                <div className="checkbox-row" style={{ paddingLeft: 20 }}>
                    <label>
                        <input 
                            type="checkbox" 
                            name="_39" 
                            checked={selectedCheckboxes._39} 
                            onChange={handleCheckboxChange} 
                        />
                        39
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="_40" 
                            checked={selectedCheckboxes._40} 
                            onChange={handleCheckboxChange} 
                        />
                        40
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="_41" 
                            checked={selectedCheckboxes._41} 
                            onChange={handleCheckboxChange} 
                        />
                        41
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="_42" 
                            checked={selectedCheckboxes._42} 
                            onChange={handleCheckboxChange} 
                        />
                        42
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="_43" 
                            checked={selectedCheckboxes._43} 
                            onChange={handleCheckboxChange} 
                        />
                        43
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="_44" 
                            checked={selectedCheckboxes._44} 
                            onChange={handleCheckboxChange} 
                        />
                        44
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="_45" 
                            checked={selectedCheckboxes._45} 
                            onChange={handleCheckboxChange} 
                        />
                        45
                    </label>
                </div>
            </div>
            <div className="box box2">
                <Search onSearch={handleSearch} />
                <ProductList
                    priceRange={priceRange}
                    selectedCheckboxes={selectedCheckboxes}
                    searchQuery={searchQuery}
                    onAddToCart={onAddToCart}
                />
            </div>
        </div>
    );
}

export default Catalog;
