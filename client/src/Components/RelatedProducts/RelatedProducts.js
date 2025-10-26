import React, { useEffect, useState } from 'react';
import Items from '../Item/Items';
import 'bootstrap/dist/css/bootstrap.min.css';

const RelatedProducts = () => {

  const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
      fetch('https://shoppy-server-by-thalir.onrender.com/related')
      .then((response) => response.json())
      .then((data)=>{setRelatedProducts(data)}); 
    }, [])

  return (
    <div className="container text-center my-5">
      <h1 className="fw-bold text-dark mb-3">Related Products</h1>
      <hr
        className="mx-auto mb-5"
        style={{
          width: '200px',
          height: '6px',
          backgroundColor: '#252525',
          borderRadius: '10px',
          border: 'none',
        }}
      />

      <div className="row g-4">
        {relatedProducts.map((item, i) => (
          <Items
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
