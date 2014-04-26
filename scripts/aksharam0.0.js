var Aksharam = new(function(){
	
	var doc,
	    fonts = ['Arial Black', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'],
	    flist = [];
		
	function MyDoc() {
        this.characterCount = 0;
        this.docBody = document.createElement("div");
        this.docBody["className"] = "mydoc";
        this.docBody.contentEditable = "true";
        this.docWidth = 80;
        this.padding = [5, 2, 3];
    }
    
    var docProto = MyDoc.prototype;
    
    docProto.render = function(parent) {
		var backDrop = document.createElement("div"),
		    docStyle = this.docBody.style;
		backDrop["id"] = "bd";
		docStyle.width = this.docWidth + "vw";
		docStyle.paddingTop = this.padding[0] + "%";
		docStyle.paddingLeft = this.padding[1] + "%";
		docStyle.paddingRight = this.padding[2] + "%";
		docStyle.minHeight = "100%";
		docStyle.fontSize = "1.2vw";
		parent.appendChild(backDrop);
		backDrop.appendChild(this.docBody);
		document.execCommand('fontName', false, 'Times New Roman');
		document.execCommand('fontSize', false, 4);
	};
    
    this.getFile = function() {
		return doc.docBody.innerHTML;
	};
	
	this.openFile = function(file) {
		doc.docBody.innerHTML = file;
	}
	
    this.init = function(parent, file) {
		doc = new MyDoc();
		doc.render(parent);
		if(file) 
			doc.openFile(file);
		for(var i = 0; i < fonts.length; ++i) 
			flist[i] = {'id': i+1, 'value': fonts[i]};
    };

    this.getMenu = function(){
		var sizeList = [];
		for(var i = 1; i < 8; ++i)
			sizeList[i-1] = {'id': i, 'value': i};
        return [ {
				type: 'main',
				id: 'ipsum lorem',
				title: 'Tools',
				icon: 'fa-wrench',
				groups: [
					{
						type: 'group',
						id: 'group2',
						multiple: true,
						required: false,
						items: [
							{
								type: 'button',
								id: 'undo',
								title: 'Undo',
								icon: 'fa-undo',
								onoff: false,
								currState: false,
								callback: changeText
							},
							{
								type: 'button',
								id: 'redo',
								title: 'Redo',
								icon: 'fa-repeat',
								onoff: false,
								currState: false,
								callback: changeText
							}
						]
					},
					{
						type: 'group',
						id: 'group1',
						multiple: true,
						required: false,
						items: [
							{
								type: 'button',
								id: 'bold',
								title: 'Bold',
								icon: 'fa-bold',
								onoff: false,
								currState: false,
								callback: changeText
							},
							{
								type: 'button',
								id: 'italic',
								title: 'Italic',
								icon: 'fa-italic',
								onoff: false,
								currState: false,
								callback: changeText
							},
							{
								type: 'button',
								id: 'underline',
								title: 'Underline',
								icon: 'fa-underline',
								onoff: false,
								currState: false,
								callback: changeText
							}
						]
					},
					{
						type: 'group',
						id: 'group2',
						multiple: true,
						required: false,
						items: [
							{
								type: 'button',
								id: 'subscript',
								title: 'Subscript',
								icon: 'fa-subscript',
								onoff: false,
								currState: false,
								callback: changeText
							},
							{
								type: 'button',
								id: 'superscript',
								title: 'Superscript',
								icon: 'fa-superscript',
								onoff: false,
								currState: false,
								callback: changeText
							},
							{
								type: 'button',
								id: 'strikeThrough',
								title: 'Strike Through',
								icon: 'fa-strikethrough',
								onoff: false,
								currState: false,
								callback: changeText
							}
						]
					},
					{
						type: 'group',
						id: 'group3',
						multiple: true,
						required: false,
						items: [
							{
								type: 'button',
								id: 'justifyLeft',
								title: 'Left',
								icon: 'fa-align-left',
								onoff: false,
								currState: false,
								callback: changeText
							},
							{
								type: 'button',
								id: 'justifyCenter',
								title: 'Centre',
								icon: 'fa-align-center',
								onoff: false,
								currState: false,
								callback: changeText
							},
							{
								type: 'button',
								id: 'justifyRight',
								title: 'Right',
								icon: 'fa-align-right',
								onoff: false,
								currState: false,
								callback: changeText
							}
						]
					},
					{
						type: 'group',
						id: 'group5',
						multiple: false,
						required: false,
						items: [ {
								type: 'color',
							    id: 'color',
							    title: 'Font Color',
							    icon: 'fa-tint', 
							    currState: 'black',
							    text: 'Text Colour', 
							    callback: changeColour
							},
						    { 
								type: 'list',
							    id: 'fontsize',
							    title: 'Font Size',
							    icon: 'fa-text-height',
							    currState: '4',  
							    list: sizeList,
							    callback: changeFontSize
							},
							{
								type: 'list',
							    id: 'fontlist',
							    title: 'Font', 
							    currState: 8, 
							    list: flist,
							    callback: changeFont
							}
						]
					}
				]
			},
			{
				type: 'main',
				id: 'pecuniae',
				title: 'Insert',
				icon: 'fa-plus',
				groups: [ {
						type: 'group',
						id: 'group3',
						multiple: true,
						required: false,
						items: [ {
								type: 'button',
								id: 'image',
								title: 'Image',
								icon: 'fa-picture-o',
								onoff: false,
								currState: false,
								callback: insertImage
							}
						]
					},
					{
						type: 'group',
						id: 'group4',
						multiple: true,
						required: false,
						items: [ {
								type: 'button',
								id: 'ul',
								title: 'Unordered List',
								icon: 'fa-list-ul',
								onoff: false,
								currState: false,
								callback: makeList
							},
							{
								type: 'button',
								id: 'ol',
								title: 'Ordered List',
								icon: 'fa-list-ol',
								onoff: false,
								currState: false,
								callback: makeList
							}
						]
					},
					{
						type: 'group',
						id: 'group19',
						multiple: true,
						required: false,
						items: [ {
								type: 'button',
								id: 'head',
								title: 'Heading',
								icon: 'fa-star',
								onoff: false,
								currState: false,
								callback: makeHeading
							},
							{
								type: 'button',
								id: 'shead',
								title: 'Sub-Heading',
								icon: 'fa-star-half',
								onoff: false,
								currState: false,
								callback: makeHeading
							}
						]							
					}
				]
			}
        ];
    };
    
    this.resize = function(){
    
    };
    
    function changeText(e, f) {
		var sel = document.getSelection();
		if(sel.rangeCount == 1) {
			var range = document.createRange();
			range = sel.getRangeAt(0).cloneRange();
			doc.docBody.focus();
			sel.removeAllRanges();
			sel.addRange(range);
			document.execCommand(e);
		}
		else {
			var	arr = new Array();
			for(var i = 0; i < sel.rangeCount; ++i) 
				arr.push(sel.getRangeAt(i).cloneRange());
			for(var i = 0; i < arr.length; ++i) {
				sel.removeAllRanges();
				sel.addRange(arr[i]);
				if(e !== 'undefined')
					document.execCommand(e, false, f);
			}
			sel.removeAllRanges();
			for(var i = 0; i < arr.length; ++i)
				sel.addRange(arr[i]);
		}
	}
	
	function insertImage() {
		var imgURL = prompt("Please enter the URL of the image: ");
		document.execCommand("insertImage", false, imgURL);
	}
	
	function changeColour(e, f) {
		f = JSON.parse('[' + f.split('(')[1].split(')')[0] + ']');
		var val = "#" + f[0].toString(16) + f[1].toString(16) + f[2].toString(16);
		document.execCommand('foreColor', false, val);
	}
	
	function changeFontSize(e, f) {
		document.execCommand('fontSize', false, f);
	}
	
	function makeList(e) {
		if(e[0] == 'u')
			document.execCommand("insertUnorderedList");
		else
			document.execCommand("insertOrderedList");
	}
	
	function changeFont(e, f) {
		document.execCommand("fontName", false, fonts[f-1]);
		console.log(fonts[f-1]);
	}
	
	function makeHeading(e) {
		changeText();
		if(e[0] == 's')
			document.execCommand('heading', false, 'H3');
		else
			document.execCommand('heading', false, 'H1');
	}
	
})();

module = Aksharam;
