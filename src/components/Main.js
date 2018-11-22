require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom' ;

//根据json文件加载数据
var imageDataList = require('../sources/ImageData.json');

//根据文件名获取文件路径
imageDataList = (function GetUrlByFileName(imageArr) {
  imageArr.forEach(element => {
    element.imageURL = require("../images/" + element.filename);
  });
  return imageArr;
})(imageDataList);

//获取区间内的随机值
function getRangeRandom(low,high){
 return Math.ceil(Math.random()*(high-low) +low);
}

//获取角度随机值
function getDegRandom(){
  return((Math.random()>0.5?'':'-') + Math.ceil(Math.random()*30));
 }

 class Controller extends React.Component{ 
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};

    var spanClassName = "img-controller";
    
    if(this.props.arrange.isCenter){
      spanClassName += ' is-center';
    }
    spanClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <span className={spanClassName} style={styleObj} onClick={this.handleClick}>
      </span>
    )
  }

 }

class Gallery extends React.Component {  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }


  render() {
    var styleObj = {};

    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    if(this.props.arrange.rotate){
      (['-moz-','-ms-','-webkit-','']).forEach(function(value,index) {
      styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 10;
    }
    var figureClassName = "img-figure";
    figureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={figureClassName} style={styleObj} onClick={this.handleClick}>
        {/* <img className="figure-img" src={this.props.data.imageURL} alt={this.props.data.title} /> */}
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
        <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
};

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      imageArr: [
        {
          pos: {
            left: 0,
            top: 0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      ]
    };
  };

  inversePic(index){
    return function(){
      var imgsArrangeArr = this.state.imageArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imageArr : imgsArrangeArr
      });
    }.bind(this);
  };
  
  centerPic(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  };
  
  //重布局
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imageArr,
    constant = this.state.Constant,
    centerPos = constant.centerPos,
    hPosRange = constant.hPosRange,
    vPosRange = constant.vPosRange,
    hPosRangeLeftSecX = hPosRange.leftSecX,
    hPosRangeRightSecX = hPosRange.rightSecX,
    hPosRangeY = hPosRange.y,
    vPosRangeTopY = vPosRange.topY,
    vPosRangeX = vPosRange.x,
    imgsTopArr = [],
    topImgsNum = Math.ceil(Math.random()*2),
    topImgSpliceIndex = 0,
    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    imgsArrangeCenterArr[0] = {
      pos : centerPos,
      rotate : 0,
      isInverse:false,
      isCenter : true
    };

    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgsNum));
    imgsTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgsNum);

    imgsTopArr.forEach(function(value,index){
      imgsTopArr[index] = {
          pos : {
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
        },
        rotate : getDegRandom(),
        isInverse:false,
        isCenter : false
      }
    });
    for(var i = 0; i < imgsArrangeArr.length; i++){
      var hPosRangeLORX = null;
      if(i < imgsArrangeArr.length / 2){
        hPosRangeLORX = hPosRangeLeftSecX;
      }
      else{
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos : {
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
        },
        rotate : getDegRandom(),
        isInverse:false,
        isCenter : false
      }
    }
    if(imgsTopArr && imgsTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

    this.setState({
      imageArr : imgsArrangeArr
    });
  };

  componentDidMount () {
    //获取舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
    //获取图片大小
    var galleryDom = ReactDOM.findDOMNode(this.refs.Gallery0),
      galleryW = galleryDom.scrollWidth,
      galleryH = galleryDom.scrollHeight,
      halfGallertW = Math.ceil(galleryW / 2),
      halfGalleryH = Math.ceil(galleryH / 2);

    this.state.Constant.centerPos = {
      left: halfStageW - halfGallertW,
      top: halfStageH - halfGalleryH * 3
    };

    this.state.Constant.hPosRange.leftSecX[0] = 0;
    this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfGallertW * 3;
    this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfGallertW;
    this.state.Constant.hPosRange.rightSecX[1] = stageW - galleryW;
    this.state.Constant.hPosRange.y[0] = -halfGalleryH;
    this.state.Constant.hPosRange.y[1] = stageH - halfGalleryH;

    this.state.Constant.vPosRange.x[0] = halfStageW - galleryW;
    this.state.Constant.vPosRange.x[1] = halfStageW;
    this.state.Constant.vPosRange.topY[0] = -halfGalleryH;
    this.state.Constant.vPosRange.topY[1] = halfStageH - halfGalleryH * 3;

    this.rearrange(0);
  };

  render() {
    var picList = [],
      picController = [];
    var key = 0;
    imageDataList.forEach(function (value, index) {
      if (!this.state.imageArr[index]){
        this.state.imageArr[index]= {
          pos: {
            left: 0,
            top: 0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      } 
      picList.push(<Gallery data={value} ref={'Gallery' + index} 
      arrange={this.state.imageArr[index]}
       inverse={this.inversePic(index)} 
       center={this.centerPic(index)}/>);

       picController.push(<Controller 
        arrange={this.state.imageArr[index]}
        inverse={this.inversePic(index)} 
        center={this.centerPic(index)}/>);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {picList}
        </section>
        <nav className="controller-nav">
          {picController}
        </nav>
      </section>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
