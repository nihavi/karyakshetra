var Aksharam = new(function(){
	
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
		docStyle.height = "100%";
		docStyle.paddingTop = this.padding[0] + "%";
		docStyle.paddingLeft = this.padding[1] + "%";
		docStyle.paddingRight = this.padding[2] + "%";
		docStyle.height = this.initialHeight + "vw";
		parentDiv.appendChild(this.docBody);
		parentDiv.appendChild(backDrop);
	};
    
    this.init = function(){
		this.newDoc = new MyDoc();		
    };

    this.getMenu = function(){
        return [
        ]
    };
    
    this.resize = function(){
    
    };

})();

module = Aksharam;
