import React from "react";
import './Home.css'
import Carousel from "./Carousel";
import { CgEnter } from "react-icons/cg";
import { Link } from "react-router-dom";

function Home() {
    return (
      <div>
        <div>
          <div style={{
                height: '100%',
                paddingBottom: 250, 
                backgroundImage: `url(/BGPhoto.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}>
              <div style={{height:70}}></div>
            <div className="translucent-box" style={{paddingTop: 100,paddingBottom: 80}}>
                <div style={{fontSize: 45, fontFamily: "Comic Sans MS", fontWeight: 900,color:"black"}}>ECOMERCY</div>
                <h2 style={{fontSize: 17, color: "black", fontFamily: "Comic Sans MS"}}>
                    Ваш надежный онлайн-магазин для покупок качественных товаров по доступным ценам.
                </h2>
                <div className="butCont center">
                    <Link style={{width: '100%'}} to="/News" ><button style={{width: '100%'}} className="greyBut">News</button></Link>
                    <Link style={{width: '100%'}} to="/Catalog"><button style={{width: '100%'}} className="blackBut">Catalog</button></Link>
                </div>
            </div>
          </div>
          <div style={{paddingBottom: 50, paddingTop:150}}>
            <Carousel />
          </div>
        </div>
      </div>
    );
  }
  
  export default Home;
