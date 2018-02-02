import React from 'react';
import ReactDom from 'react-dom';
import MyComponent from './components/MyComponent.jsx';

ReactDom.render(
    <MyComponent />,
    document.getElementById('content')
);