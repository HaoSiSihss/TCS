//辅助变量
var DIR={//枚举
	DIR_RIGHT:1,
	DIR_LEFT:2,
	DIR_TOP:3,
	DIR_BOTTOM:4
};
var dir=DIR.DIR_RIGHT;//记录当前蛇的移动方向
var snake=[];//保存的是蛇的每一节身体对应的span
var food=null;	//始终指向一个食物
var count = 0;//计分
var timer=null;//定时器
var num = 1;//初始速度
var barrier = [];//障碍物数组
var oAudio=document.getElementsByTagName('audio');//获取音乐
window.onload=function(){
	document.getElementsByTagName('body')[0].onmousedown=function(ev){
		//取消默认行为
		ev.preventDefault();
	}
	//初始化地图
	initMap();
	//初始化蛇
	initSnake();
	//让蛇动起来
	// setInterval(snakeMove,500);
	//初始化食物
	showFood();
	//捕获键盘点击,控制蛇移动
	document.onkeyup=function(e){
		var head=snake[snake.length-1];
		switch(e.keyCode){
			case 37:dir=DIR.DIR_LEFT;
			head.style.transform='scale(-1,1)';
			break;
			case 38:dir=DIR.DIR_TOP;
			head.style.transform='rotate(-90deg)';
			break;
			case 39:dir=DIR.DIR_RIGHT;
			head.style.transform='rotate(0deg)';
			break;
			case 40:dir=DIR.DIR_BOTTOM;
			head.style.transform='rotate(90deg)';
			break;
			case 32:onOff();oStart.style.backgroundImage="url('img/before.png')";break;
			default:break;
		}
	};
	// 按下空格键，按钮背景色改变
	var oStart=document.getElementById('start');
	document.onkeydown=function(e){
		if(e.keyCode==32){
			oStart.style.backgroundImage="url('img/after.png')";
		}
	}
	//游戏开始与暂停按钮
	var oTitleBar=document.getElementById('titlebar');
	var timer2 = null;
	function onOff(){
		if(oStart.innerHTML=="Start"){
			oStart.innerHTML='Pause';
			oTitleBar.style.animationName="titlebar";
			clearInterval(timer);	
			timer2 = setTimeout(function() {
				timer=setInterval(snakeMove,300);
			},2000);
		}else if(oStart.innerHTML=="Pause"){
			oStart.innerHTML='Continue';
			clearInterval(timer);
			clearTimeout(timer2);
			document.getElementById('pause').style.animationName="drop";
		}else if(oStart.innerHTML=="Continue"){
			oStart.innerHTML='Pause';
			clearInterval(timer);
			timer=setInterval(snakeMove,300);
			document.getElementById('pause').style.animationName="raise";
		}
	}
	oStart.onclick=onOff;
	//titlebar 按钮设置
	document.getElementById('pause').getElementsByTagName("span")[0].onclick=function(){
		oStart.innerHTML='Pause';
		clearInterval(timer);
		timer=setInterval(snakeMove,300);
		document.getElementById('pause').style.animationName="raise";
	}
	document.getElementById('pause').getElementsByTagName("span")[1].onclick=function(){
		window.location.href=window.location.href;
	}
	// 游戏开始与暂停按钮背景色的改变
	oStart.onmousedown = function(){
		oStart.style.backgroundImage="url('img/after.png')";
	}
	oStart.onmouseup = function(){
		oStart.style.backgroundImage="url('img/before.png')";
	}
	//点击continue按钮，重新游戏
	var oContinue=document.getElementById('continue');
	oContinue.onclick=function(){
		window.location.href=window.location.href;
	}
	//背景音乐的播放与暂停
	var oBgmOnOff=document.getElementById('bgm_onoff');
	var flag=true;
	oBgmOnOff.onclick=function(){
		if(flag){
			this.style.backgroundImage='url("img/bgm-off.png")';
			oAudio[0].pause();
			flag=false;
		}else{
			this.style.backgroundImage='url("img/bgm-on.png")';
			oAudio[0].play();
			flag=true;
		}
	}
};
function initMap(){
	var con=document.getElementById("container");
	var num=(con.offsetWidth/20)*(con.offsetHeight/20);
	for(var i=1;i<=num;i++){
		var newSpan=document.createElement("span");
		newSpan.className="map";
		con.appendChild(newSpan);
	} 
	var oSpan=document.getElementsByTagName('span');
		
		for(var i=66;i<70;i++){//右上水平
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		for(var i=90;i<94;i++){//左上水平
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		for(var i=66;i<160;){//右上垂直
			i=i+32;
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		for(var i=93;i<160;){//左上垂直
			i=i+32;
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		for(var i=706;i<710;i++){//右下水平
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		for(var i=730;i<734;i++){//左下水平
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		for(var i=578;i<672;){//右下垂直
			i=i+32;
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		for(var i=605;i<698;){//左下垂直
			i=i+32;
			oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
			oSpan[i].style.backgroundSize="200%";
			oSpan[i].style.backgroundPosition="center center";
			barrier.push(oSpan[i]);
		}
		
		for(var i=0;i<oSpan.length;i++){
			if(oSpan[i].offsetLeft==140&&oSpan[i].offsetTop>=140&&oSpan[i].offsetTop<=340||oSpan[i].offsetTop==240&&oSpan[i].offsetLeft>=160&&oSpan[i].offsetLeft<=240||oSpan[i].offsetLeft==260&&oSpan[i].offsetTop>=140&&oSpan[i].offsetTop<=340||oSpan[i].offsetTop==140&&oSpan[i].offsetLeft>=400&&oSpan[i].offsetLeft<=500||oSpan[i].offsetLeft==380&&oSpan[i].offsetTop>=140&&oSpan[i].offsetTop<=240||oSpan[i].offsetTop==240&&oSpan[i].offsetLeft>=400&&oSpan[i].offsetLeft<=480||oSpan[i].offsetLeft==500&&oSpan[i].offsetTop>=240&&oSpan[i].offsetTop<=340||oSpan[i].offsetTop==340&&oSpan[i].offsetLeft>=380&&oSpan[i].offsetLeft<=480){
				var grass=document.createElement('span');
				grass.className='grass';
				oSpan[i].appendChild(grass);
			}
		}

}
function initSnake(){
	var con=document.getElementById("container");
	for(var i=1;i<=5;i++){
		var newBody=document.createElement("span");
		newBody.className="snake";
		newBody.style.top="0px";
		newBody.style.left=20*(i-1)+"px";
		con.appendChild(newBody);
		snake.push(newBody);
	}
	var head=snake[snake.length-1];
	head.className = 'head';
}
function snakeMove(){
	//蛇头的移动
	var head=snake[snake.length-1];
	for(var j=0;j<snake.length-1;j++){
		snake[j].style.backgroundColor='blue';
		head.className = 'head';
	}
	var newLeft=head.offsetLeft,newTop=head.offsetTop;//保存原来的位置
	switch(dir){
		case DIR.DIR_LEFT:
			newLeft-=20;break;
		case DIR.DIR_RIGHT:
			newLeft+=20;break;
		case DIR.DIR_TOP:
			newTop-=20;break;
		case DIR.DIR_BOTTOM:
			newTop+=20;break;
		default:
			break;
	}
	//如果蛇头进入自己身体(咬到自己)
	var oTip=document.getElementById('tip');//游戏结束弹窗	
	var oPs=document.getElementById('ps');
	for(var i=0;i<snake.length-1;i++){
		if(snake[i].offsetLeft==newLeft&&
			snake[i].offsetTop==newTop){
			oAudio[0].pause();//背景音乐关闭
			oAudio[1].play();//死亡音效
			oTip.style.display='block';
			oPs.innerHTML='ps:咬到自己啦！';
			clearInterval(timer);
		}
	}
	//吃到了食物
	//计分
	if(newLeft==food.offsetLeft&&newTop==food.offsetTop){
		head.className = 'snake';
		food.className = 'head eating';
		oAudio[2].play();
		num+=0.2 ;
		if(num>3){num = 3;}
		clearInterval(timer);
		timer = setInterval(snakeMove,400/num);
		snake.push(food);
		//刷新食物
		showFood();
		count++;
		return (document.getElementById('score').innerHTML='Score：'+count*10);
	}
	
	//没吃到食物
	//除蛇头外身体的移动
	for(var i=0;i<snake.length-1;i++){
		snake[i].style.left=snake[i+1].offsetLeft+"px";
		snake[i].style.top=snake[i+1].offsetTop+"px";
	}
	//判断新位置是否合理
	if(newLeft<0||newTop<0||newLeft>=640||newTop>=500){
		oAudio[0].pause();//背景音乐关闭
		oAudio[1].play();//死亡音效
		oTip.style.display='block';
		oPs.innerHTML='ps:墙都被你咬穿啦！';
		//window.location.href=window.location.href;//刷新
		clearInterval(timer);
	}
	//如果合理，让蛇头移动到合理的新位置
	head.style.left=newLeft+"px";
	head.style.top=newTop+"px";
}
function showFood(){
	food=document.createElement("span");
	food.className="food";
	//设置food一个随机的有效的top和left
	var left,top;
	//判断下在不在蛇的身体里
	do{
		left=Math.floor(Math.random()*32)*20;
		top=Math.floor(Math.random()*25)*20;
	}while(isInSnake(left,top)||isInBarrier(left,top));
	//给食物启用随机坐标
	food.style.left=left+"px";
	food.style.top=top+"px";
	document.getElementById("container").appendChild(food);
}
//判断你给的坐标在不在蛇的身体里
function isInSnake(left,top){
	for(var i=0;i<snake.length;i++){
		if(snake[i].offsetLeft==left
			&&snake[i].offsetTop==top){
			return true;
		}
	}
	return false;
}
function isInBarrier(left,top){
	for(var i=0;i<barrier.length;i++){
		if(barrier[i].offsetLeft==left
			&&barrier[i].offsetTop==top){
			return true;
		}
	}
	return false;
}
