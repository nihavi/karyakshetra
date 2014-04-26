var Aksharam = new(function(){
	
	var doc;	
	
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
		parent.appendChild(backDrop);
		backDrop.appendChild(this.docBody);
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
    };

    this.getMenu = function(){
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
						id: 'group4',
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
							}
						]
					},
					{
						type: 'group',
						id: 'group5',
						multiple: false,
						required: false,
						items: [ { 
								type: 'size',
							    id: 'sizewq',
							    title: 'Font Size',
							    icon: 'fa-sort-numeric-asc',
							    currState: '4', 
							    rangeStart: '1', 
							    rangeEnd: '7',
							    callback: changeFontSize
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
	
	function changeFontSize(f, e) {
		console.log('called');
		document.execCommand('fontSize', false, e);
	}
	
})();

module = Aksharam;
