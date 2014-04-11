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
				title: 'lorem ipsum',
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
								id: 'boldbutton',
								title: 'Bold',
								icon: 'fa-bold',
								onoff: false,
								currState: false,
								callback: makeBold
							},
							{
								type: 'button',
								id: 'boldbutton',
								title: 'Italic',
								icon: 'fa-italic',
								onoff: false,
								currState: false,
								callback: makeItalic
							},
							{
								type: 'button',
								id: 'boldbutton',
								title: 'Underline',
								icon: 'fa-underline',
								onoff: false,
								currState: false,
								callback: makeUnderline
							}
						]
					}
				]
			}
        ];
    };
    
    this.resize = function(){
    
    };
    
    function makeBold() {
		var sel = document.getSelection();
		for(var i = 0; i < sel.rangeCount; ++i)
			console.log(sel.getRangeAt(i));
		document.execCommand("bold");
		console.log("bold");
	}
	
	function makeItalic() {
		document.execCommand("italic");
		console.log("italic");
	}
	
	function makeUnderline() {
		document.execCommand("underline");
		console.log("underline");
	}

})();

module = Aksharam;
