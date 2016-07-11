require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.scss')

import React from 'react';



// 获取图片相关数据
var imageDatas = require('../data/imageData.json');


// 利用函数将图片名信息转成图片URL信息
function genImageURL(imageDatasArr) {
	for (var i = 0, len = imageDatasArr.length; i < len; i++) {
		var singleImageData = imageDatasArr[i]

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;

	}
	return imageDatasArr
}

imageDatas = genImageURL(imageDatas)

class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec"></section>
				<nav className="controller-nav"></nav>1
			</section>

		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;