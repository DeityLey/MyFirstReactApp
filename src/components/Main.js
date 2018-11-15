require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//根据json文件加载数据
var imageDataList = require('../sources/ImageData.json');

//根据文件名获取文件路径
imageDataList = (function GetUrlByFileName(imageArr) {
  imageArr.forEach(element => {
    element.imageURL = require("../images/" + element.filename);
  });
  return imageArr;
})(imageDataList);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="pic_sec"></section>
        <nav className="controller_nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
