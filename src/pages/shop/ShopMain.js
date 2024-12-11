import React, { useState, useEffect } from 'react';
import Products from './product/Products';

const App = () => {
  return (
    <div>
      <h1>상품 목록</h1>
      <Products />
    </div>
  );
};

export default App;

