var Aksharam = new(function(){
	
	var doc;	
	
	function MyDoc() {
        this.characterCount = 0;
        this.docBody = document.createElement("div");
        this.docBody["className"] = "mydoc";
        this.docBody.contentEditable = "true";
        this.docWidth = 80;
        this.padding = [5, 2, 3];
        this.render();
    }
    
    var docProto = MyDoc.prototype;
    
    docProto.render = function() {
		var backDrop = document.createElement("div"),
		    docStyle = this.docBody.style,
		    parentDiv = document.getElementById("editable");
		backDrop["id"] = "bd";
		docStyle.width = this.docWidth + "vw";
		docStyle.paddingTop = this.padding[0] + "%";
		docStyle.paddingLeft = this.padding[1] + "%";
		docStyle.paddingRight = this.padding[2] + "%";
		docStyle.minHeight = "100%";
		parentDiv.appendChild(backDrop);
		backDrop.appendChild(this.docBody);
	};
    
    this.init = function(){
		this.newDoc = new MyDoc();
		doc = this.newDoc;		
    };

    this.getMenu = function(){
        return [
			{
				type: 'main',
				id: 'lorem ipsum',
				title: 'Tools',
				icon: 'fa-usd',
				groups: [
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
					}
				]
			}
        ];
    };
    
    this.resize = function(){
    
    };
    
    function changeText(e) {
		var sel = document.getSelection(),
			arr = new Array();
		for(var i = 0; i < sel.rangeCount; ++i) 
			arr.push(sel.getRangeAt(i));
		for(var i = 0; i < arr.length; ++i) {
			sel.removeAllRanges();
			sel.addRange(arr[i]);
			document.execCommand(e);
		}
	}

})();

module = Aksharam;
