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
var barrier = [];//障碍物数组
var timer=null;//定时器
var num = 1;//初始速度
var flag =true;
var oAudio=document.getElementsByTagName('audio');//获取音乐
window.onload=function(){
	// 用户名字先显示出来
	var yourname=document.getElementById('yourname');
	yourname.value=getData();	
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
	document.getElementById('pause').getElementsByTagName("span")[2].onclick=function(){
		JumpToAndSendData(' ../snake-select.html',getData());
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

// 获取连接中闯过来的用户名字
function getData(){
  var loc = location.href;
  var length = loc.length;//地址的总长度
  var index = loc.indexOf("=");//取得=号的位置
  var user= decodeURI(loc.substr(index+1, length-index));//从=号后面的内容	
  return   user;	
}	

//做蛇
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
//蛇移动
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

	var scoreV=document.getElementById('scoreV');
	var nv=document.getElementById('yourname');
	
	for(var i=0;i<snake.length-1;i++){
		if(snake[i].offsetLeft==newLeft&&
			snake[i].offsetTop==newTop){
			oAudio[0].pause();//背景音乐关闭
			oAudio[1].play();//死亡音效
			oTip.style.display='block';
			oPs.innerHTML='ps:咬到自己啦！';
			clearInterval(timer);
			stopsomething();
		}
	}
	//判断是否撞到障碍物
	for(var i=0;i<barrier.length;i++){
		if(barrier[i].offsetLeft==newLeft
			&&barrier[i].offsetTop==newTop){
			oAudio[0].pause();//背景音乐关闭
			oAudio[1].play();//死亡音效
			oTip.style.display='block';
			oPs.innerHTML='ps:障碍物不能吃哦！';
			clearInterval(timer);
			stopsomething();
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
		scoreV.value=count*10;
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
		stopsomething();
	}
	//如果合理，让蛇头移动到合理的新位置
	head.style.left=newLeft+"px";
	head.style.top=newTop+"px";
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
//制作地图与障碍物
function initMap(){
	var con=document.getElementById("container");
	var num=(con.offsetWidth/20)*(con.offsetHeight/20);
	for(var i=1;i<=num;i++){
		var newSpan=document.createElement("span");
		newSpan.className="map";
		con.appendChild(newSpan);
	}
	var oSpan=document.getElementsByTagName('span');
	for(var i=0;i<oSpan.length;i++){
			if(oSpan[i].offsetLeft==140&&
				oSpan[i].offsetTop>180&&
				oSpan[i].offsetTop<300||
				oSpan[i].offsetTop==240&&
				oSpan[i].offsetLeft>=160&&
				oSpan[i].offsetLeft<=240||
				oSpan[i].offsetLeft==260&&
				oSpan[i].offsetTop>180&&
				oSpan[i].offsetTop<300||
				oSpan[i].offsetTop==140&&
				oSpan[i].offsetLeft>=400&&
				oSpan[i].offsetLeft<460||
				oSpan[i].offsetLeft==380&&
				oSpan[i].offsetTop>=140&&
				oSpan[i].offsetTop<=240||
				oSpan[i].offsetTop==240&&
				oSpan[i].offsetLeft>=400&&
				oSpan[i].offsetLeft<460||
				oSpan[i].offsetLeft==500&&
				oSpan[i].offsetTop>280&&
				oSpan[i].offsetTop<=340||
				oSpan[i].offsetTop==340&&
				oSpan[i].offsetLeft>420&&
				oSpan[i].offsetLeft<=480){
				var grass=document.createElement('span');
				grass.className='grass';
				oSpan[i].appendChild(grass);
			}
			else if(oSpan[i].offsetLeft==140&&
				oSpan[i].offsetTop>=140&&
				oSpan[i].offsetTop<=180||
				oSpan[i].offsetLeft==140&&
				oSpan[i].offsetTop>=300&&
				oSpan[i].offsetTop<=340||
				oSpan[i].offsetLeft==260&&
				oSpan[i].offsetTop>=140&&
				oSpan[i].offsetTop<=180||
				oSpan[i].offsetLeft==260&&
				oSpan[i].offsetTop>=300&&
				oSpan[i].offsetTop<=340||
				oSpan[i].offsetTop==140&&
				oSpan[i].offsetLeft>=460&&
				oSpan[i].offsetLeft<=500||
				oSpan[i].offsetTop==240&&
				oSpan[i].offsetLeft>=460&&
				oSpan[i].offsetLeft<=500||
				oSpan[i].offsetLeft==500&&
				oSpan[i].offsetTop>240&&
				oSpan[i].offsetTop<=280||
				oSpan[i].offsetTop==340&&
				oSpan[i].offsetLeft>=380&&
				oSpan[i].offsetLeft<=420){
				oSpan[i].style.background='url("../TCS/img/barrier.jpg") no-repeat';
				oSpan[i].style.backgroundSize="200%";
				oSpan[i].style.backgroundPosition="center center";
				barrier.push(oSpan[i]);
			}
		}
}
//产生食物
function showFood(){
	food=document.createElement("span");
	food.className="food";
	//设置food一个随机的有效的top和left
	var left,top;
	//判断下在不在蛇的身体里
	do{
		left=Math.floor(Math.random()*25)*20;
		top=Math.floor(Math.random()*25)*20;
	}while(isInSnake(left,top)||isInBarrier(left,top));
	//给食物启用随机坐标
	food.style.left=left+"px";
	food.style.top=top+"px";
	document.getElementById("container").appendChild(food);
}
//食物是否在障碍物
function isInBarrier(left,top){
	for(var i=0;i<barrier.length;i++){
		if(barrier[i].offsetLeft==left
			&&barrier[i].offsetTop==top){
			return true;
		}
	}
	return false;
}
function JumpToAndSendData(url,str){
    location.href=url+"?"+"yourname="+encodeURI(str);
}    
//游戏结束后oStart按钮和空格键失效，按下空格键重新游戏
function stopsomething(){ 
	var oTip1=document.getElementById('tip');//游戏结束弹窗
	var oStart1=document.getElementById('start');
	if(oTip1.style.display=='block'){
		oStart1.innerHTML='Replay'
		oStart1.onclick=function(){
			window.location.href=window.location.href;
		};
		document.onkeydown=function(e){
			if(e.keyCode==32){
				
			}
		}
		document.onkeyup=function(e){
			if(e.keyCode==32){
				window.location.href=window.location.href;
			}
		}
   }
}  