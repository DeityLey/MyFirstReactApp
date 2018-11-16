require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//根据json文件加载数据
var imageDataList = require('../sources/ImageData.json');

//根据文件名获取文件路径
imageDataList = (function GetUrlByFileName(imageArr) {
  imageArr.forEach(element => {
    element.imageURL = "../images/" + element.filename;
  });
  return imageArr;
})(imageDataList);

class Gallery extends React.Component {
  render(){
    return (
      <figure className="figure">
        <img className="figure-img" src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption className="figure-caption">
          <h2>{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
};

class AppComponent extends React.Component {
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }

  },
  componentDidMount : function(){
    //获取舞台大小
    var stageDOM = React.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //获取图片大小
    var galleryDom = React.findDOMNode(this.refs.gallery0),
        galleryW = galleryDom.scrollWidth,
        galleryH = galleryDom.scrollHeight,
        halfGallertW = Math.ceil(galleryW/2),
        halfGalleryH = Math.ceil(galleryH/2);

    this.Constant.centerPos = {
      left: stageW - galleryW,
      top: stageH - galleryH
    }
  },
  render() {
    var picList = [],
      picController = [];
      var key = 0;
  imageDataList.forEach(function (value, index) {
    picList.push(<Gallery data={value} ref={'Gallery' + index} />);
    });
    return (
      <section className="stage" ref="stage">
        <section className="pic-sec">
          {picList}
        </section>
        <nav className="controller-nav">
          {picController}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
