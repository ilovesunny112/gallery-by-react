require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.scss')

import React from 'react';
import ReactDOM from 'react-dom';



// 获取图片相关数据
var imageDatas = require('json!../data/imageData.json');


// 利用函数将图片名信息转成图片URL信息
function genImageURL(imageDatasArr) {
	for (var i = 0, len = imageDatasArr.length; i < len; i++) {
		var singleImageData = imageDatasArr[i]

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;

	}
	return imageDatasArr
}

imageDatas = genImageURL(imageDatas);



function getRangeRandom(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

/*
获取 0-30度之间的正负值
*/

function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
	// return getRangeRandom(-30, 30)
	// return 50
}

// var ControllerUnit = React.createClass({
// 			handleClick: function(e) {
// 				e.stopPropagation;
// 				e.preventDefault();
// 			},
// 			render: function() {
// 					return (
// 							<span className="controller-unit" ><span>
// 					);
// 			}
// });

class ControllerUnit extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.stopPropagation();
		e.preventDefault();

		// 如果点击是选中态按钮则反转 否则居中 

		if (this.props.arrange.isCenter) {
			this.props.inverse()
			console.log(1);
		} else {
			this.props.center()
		}
		console.log(e);


	}
	render() {

		var controllerUnitClassName = "controller-unit";
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += " is-center";
			console.log(1);

		}
		if (this.props.arrange.isInverse) {
			controllerUnitClassName += " is-inverse";
			console.log(2);
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}  ><i className="iconfont"></i></span>
		);
	}
}

class ImgFigure extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}


	// imgfigure 点击处理函数
	handleClick(e) {



		if (this.props.arrange.isCenter) {
			console.log(this)
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault()
	}
	render() {

		var styleObj = {};


		// 如果图片的旋转角度有值且不为零 add旋转角度

		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		} else {

		}
		if (this.props.arrange.rotate) {
			['Moz', 'ms', 'Webkit', ''].forEach(function(value, index) {
				styleObj[value + "Transform"] = "rotate(" + this.props.arrange.rotate + "deg)";
			}.bind(this))



			// styleObj["transform"] = "rotate(" + this.props.arrange.rotate + "deg)"
		}

		var imgFigureClassName = "img-figure";
		imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} /> 
				<figcaption  >
					<h2 className="img-title">{this.props.data.title}</h2> 
				</figcaption>
				<div className="img-back" onClick = {this.handleClick}>
					<p>
						{this.props.data.description}
					</p>
				</div>
			</figure>
		)
	}
}

class AppComponent extends React.Component {

	Constant = {
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
	}


	// 反转图片 输入当前被执行inverse 操作的图片对应的index return一个闭包：其内return 一个真正等待被执行的函数


	inverse(index) {
			return function() {
				var imgsArrangeArr = this.state.imgsArrangeArr;
				imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
				this.setState({
					imgsArrangeArr: imgsArrangeArr
				})
			}.bind(this);
		}
		// 组件加载以后 为每张图片计算其位置的范围
	componentDidMount() {
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.floor(stageW / 2),
			halfStageH = Math.floor(stageH / 2);

		// 拿到一个imgfiure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.floor(imgW / 2),
			halfImgH = Math.floor(imgH / 2);


		// 计算中心图片位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH

		}

		// 计算左侧 右侧 区域 取值范围 
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;


		// 计算上测区域取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;



		this.rearrange(0);
	}


	// 重新布局所有图片
	// @param center
	rearrange(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			// 取一个或者不取
			topImgNum = Math.floor(Math.random() * 2);

		var
			topImgSpliceIndex = 0,

			imgArrnageCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		// 首先居中  centerIndex 的图片
		imgArrnageCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isInverse: false,
			isCenter: true
		}


		// 取出要布局上侧图片状态信息
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));

		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		// 布局上侧的图片

		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isInverse: false,
				isCenter: false
			}
		})

		// 布局左右的图片
		for (var i = 0, len = imgsArrangeArr.length, j = len / 2; i < len; i++) {
			var hPosRangeLORX = null;
			// 前半部分布局左边 右半部分布局右边

			if (i < j) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX
			}

			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isInverse: false,
				isCenter: false
			}
		}

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
		}

		imgsArrangeArr.splice(centerIndex, 0, imgArrnageCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})

	}


	center(index) {
		return function() {
			this.rearrange(index);
		}.bind(this)
	}

	constructor(props) {
		super(props);
		this.state = {
			imgsArrangeArr: [
				/*{
								pos: {
									left: '0',
									top: '0'
								}
							},
					rotate:0,
					isInverse:false
							*/
			]
		};

		// Bind callback methods to make `this` the correct context.
		// this.onRadChange = this.onRadChange.bind(this);
	}


	// getInitialState() {
	// 	return {
	// 		imgsArrangeArr: [{
	// 			pos: {
	// 				left: '0',
	// 				top: '0'
	// 			}
	// 		}]
	// 	}
	// }



	render() {
		var controllerUnits = [],
			imgFigures = [];


		imageDatas.forEach(function(value, index) {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			imgFigures.push(<ImgFigure data={value} onClick={this.handleClick} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
			controllerUnits.push(<ControllerUnit inverse={this.inverse(index)} center={this.center(index)}  arrange={this.state.imgsArrangeArr[index]}   onClick={this.handleClick}    />);

		}.bind(this));

		return (
			<section className="stage"  ref="stage">
				<section className="img-sec" key="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav" key="controller-nav">
					{controllerUnits}
				</nav>
			</section>

		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;