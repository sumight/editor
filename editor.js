(function(){
var currentNode;
var emptyNode;
var editor = document.getElementById("editor");
editor.firstElementChild.focus();
currentNode = editor.firstElementChild;
delegate(editor,"keydown",function(event){
	event = event||window.event
	if (event.keyCode==13) {
		//如果节点没有内容，则判定为空，空节点需要被清理
		if(currentNode.childNodes.length===0) emptyNode = currentNode;
		// 如果按下了shit+回车
		if(event.shiftKey){
			// 看看当前元素的下一个兄弟是否是P，即不能在p之前查入section
			if(!currentNode.nextElementSibling||currentNode.nextElementSibling.tagName !=='P'){
				createSectionAsNextSibling(currentNode);
			}
		}else{// 如果按下了回车
			var tagName = currentNode.tagName;
			if(tagName==="H1"){
				// 判断h1下面是否有兄弟元素，即是否跳过内容进行插入,如果不是则进行正常插入
				if(!currentNode.nextElementSibling){
					createSectionAsNextSibling(currentNode);
					if(!isTop(currentNode))
						toHighLevel(currentNode);
				}else if(currentNode.nextElementSibling.tagName==='P'){
					createPAsNextSibling(currentNode);
				}else if(currentNode.nextElementSibling.tagName==='section'){
					createSectionAsNextSibling(currentNode);
				}
			}else if(tagName==="P"){
				createPAsNextSibling(currentNode);
			}else if(tagName==="LI"){
				createLIAsNextSibling(currentNode);
			}
		}
		event.preventDefault()
	}else if(event.keyCode === 9){
		//如果节点没有内容，则判定为空，空节点需要被清理
		if(currentNode.childNodes.length===0) emptyNode = currentNode;
		// 如果按下tab键
		toHighLevel(currentNode);
		currentNode.focus();
		event.preventDefault();
	}else if(event.ctrlKey&&event.keyCode===79){
		//如果节点没有内容，则判定为空，空节点需要被清理
		if(currentNode.childNodes.length===0) emptyNode = currentNode;
		// 按下ctl+o的时候创建有序列表
		createOLAsNextSibling(currentNode);
		event.preventDefault();
	}else if(event.ctrlKey&&event.keyCode===85){
		//如果节点没有内容，则判定为空，空节点需要被清理
		if(currentNode.childNodes.length===0) emptyNode = currentNode;
		// 按下ctl+u的时候创建无序列表
		createULAsNextSibling(currentNode);
		event.preventDefault();
	}else if(event.shiftKey&&event.keyCode==32){
		//如果节点没有内容，则判定为空，空节点需要被清理
		if(currentNode.childNodes.length===0) emptyNode = currentNode;
		// 按下shift+空格创建正文
		if(currentNode.tagName==='LI'){
			createPAsNextSibling(currentNode.parentNode);
		}else{
			createPAsNextSibling(currentNode);
		}
		event.preventDefault();
	}
	// 清理空元素
	clearEmpty(emptyNode);
	currentNode.focus();
	console.log(event.keyCode);
	console.log("shiftKey "+event.shiftKey);
	console.log("control "+event.ctrlKey);
})
// 确定当前元素，即焦点所在的元素
delegate(editor,"focus",function(event){
	event = event||window.event
	currentNode = event.target;
})
// 确定当前元素，即焦点所在的元素
// delegate(editor,"blur",function(event){
// 	event = event||window.event
// 	currentNode = event.target;
// 	console.log(currentNode);
// 	//如果节点没有内容，则判定为空，空节点需要被清理
// 	if(currentNode.childNodes.length===0){
// 		console.log("clear")
// 		clearEmpty(currentNode);
// 	}
// 	console.log("blur")
// })
// 创建一个p作为当前元素的后兄弟元素
function createPAsNextSibling(currentNode){
	var p = document.createElement("p");
	p.setAttribute("contentEditable","");
	currentNode.parentNode.insertBefore(p,currentNode.nextElementSibling)
	p.focus();
}
// 创建一个section-h 作为当前元素的后兄弟元素
function createSectionAsNextSibling(currentNode){
	var h = document.createElement("h1");
	// 让h可编辑
	h.setAttribute("contentEditable","")
	//创建section，并装入h 
	var section = document.createElement("section");
	section.appendChild(h);
	// 在document中插入section
	currentNode.parentNode.insertBefore(section,currentNode.nextElementSibling)
	h.focus()
}
// 创建有序列表
function createOLAsNextSibling(currentNode){
	var ol = document.createElement("ol")
	var li = document.createElement("li")
	ol.appendChild(li);
	currentNode.parentNode.insertBefore(ol,currentNode.nextElementSibling);
	li.setAttribute("contentEditable","");
	li.focus();
}
// 创建无序列表
function createULAsNextSibling(currentNode){
	var ul = document.createElement("ul")
	var li = document.createElement("li")
	ul.appendChild(li);
	currentNode.parentNode.insertBefore(ul,currentNode.nextElementSibling);
	li.setAttribute("contentEditable","");
	li.focus();
}
// 创建列表项
function createLIAsNextSibling(currentNode){
	var li = document.createElement("li");
	currentNode.parentNode.insertBefore(li,currentNode.nextElementSibling);
	li.setAttribute("contentEditable","");
	li.focus()
}
// 将当前section层次后移
function toLowLevel(section){
	// 判断是否有前section兄弟元素
	// 如果有则把自己作为其最后一个子元素
	if(section.previousElementSibling&&section.previousElementSibling.tagName==="SECTION"){
		section.previousElementSibling.appendChild(section);
	}
}
// 将当前section层次迁移
function toHighLevel(currentNode){
	// 如果currentNode是H
	if(currentNode.tagName === 'H1'){
		var pNode = currentNode.parentNode;
		if(pNode.parentNode.id!=='editor'){
			// 判断父元素是否有下兄弟元素
			if(!pNode.nextElementSibling){
				// 将自己作为父section的下兄弟section
				pNode.parentNode.parentNode.insertBefore(pNode,pNode.parentNode.nextSibling);
			}
		}
	}else
	// 如果currentNode是P
	if(currentNode.tagName==="P"){
		// 判断自己是否有下兄弟元素
		if(!currentNode.nextElementSibling){
			createSectionAsNextSibling(currentNode);
		}
	}else
	// 如果currentNode是li
	if(currentNode.tagName==="LI"){
		createPAsNextSibling(currentNode.parentNode);
	}
}
// // 将本h对应的section其兄弟section的子section，并且降低h的level
// function convertToLowLevelSection(currentNode){
// 	// 替换为低等级的h
// 	var hTagName = currentNode.tagName;
// 	var level = hTagName.charAt(1);
// 	if (level<6) {
// 		level = Number(level)+1;
// 	}else{
// 		// 如果h的level已经最低则无法进行此操作
// 		return;
// 	}
// 	hTagName = "h"+level;
// 	var section = currentNode.parentNode;
// 	var newH = document.createElement(hTagName);
// 	newH.innerText = currentNode.innerText;
// 	newH.setAttribute("contentEditable","")
// 	section.replaceChild(newH,currentNode);	
// 	// 移动section位置
// 	var preSectionSibling;
// 	if(section.previousElementSibling){
// 		section.previousElementSibling.appendChild(section);
// 	}else{
// 		// 如果没有前兄弟section，无法进行此操作
// 		return;
// 	}
// }

// 判断元素是否为空
function isEmpty(ele){
		if(ele.childNodes.length===0){
			return true
		}
	return false;
}
// 判断元素是否在最外层
function isTop(currentNode){
	if(currentNode.parentNode.id === "editor"){
		return true;
	}else{
		return false;
	}
}
// 将section拆掉包装
function discardSectionWrap(section){
	var df = document.createDocumentFragment();
	section.removeChild(section.firstElementChild);
	while(section.lastChild) df.appendChild(section.lastChild);
	section.parentNode.replaceChild(df,section);
}

// 清理空节点
function clearEmpty(en){
	if(currentNode !== emptyNode){
		if(en){
			if(en.tagName==="P"){
				en.parentNode.removeChild(en);
			}else if(en.tagName==="H1"){
				// 在清理外壳之前先要将section丢到前兄弟的最里面
				while(en.parentNode.previousElementSibling.tagName==='SECTION'){
					toLowLevel(en.parentNode)
				}
				discardSectionWrap(en.parentNode);
			}else if(en.tagName==='LI'){
				if(en.parentNode.children.length===1){
					en.parentNode.parentNode.removeChild(en.parentNode);
				}else{
					en.parentNode.removeChild(en);
				}
			}
		}
	}


	emptyNode = undefined;
}
// 时间代理
function delegate(parentElement,eventType,eventHandle){
	// 如果浏览器支持addEventListener，说明是IE9以及以上版本	
	if(parentElement.addEventListener){
		// 使用addEventListener，进行事件捕获，为了支持focus等无法冒泡的事件
		parentElement.addEventListener(eventType,function(event){
			eventHandle(event);
		},true);
	// 如果不支持addEventListener，说明是IE9以下版本
	}else if(parentElement.attachEvent){
		// IE9以下版本不支持事件的捕获，但是focus，blur等又无法冒泡，
		// 所以替换为可以冒泡的focusin和focusout	
		if(eventType==="focus") eventType="focusin";
		if(eventType==="blur") eventType="focusout";
		parentElement.attachEvent("on"+eventType,function(event){
			event = event||window.event;
			eventHandle(event);
		})
	}
}

})()
