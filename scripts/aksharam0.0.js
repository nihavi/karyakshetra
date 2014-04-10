var Aksharam = new(function(){
	
	function MyDoc() {
        this.characterCount = 0;
        this.docBody = document.createElement("div");
        this.docBody["className"] = "mydoc";
        this.docBody.contentEditable = "true";
        this.docWidth = 80;
        this.padding = [1, 2, 3];
        this.render();
    }
    
    var docProto = MyDoc.prototype;
    
    docProto.render = function() {
		var docStyle = this.docBody.style;
		docStyle.width = this.docWidth + "vw";
		docStyle.height = "100%";
		docStyle.paddingTop = this.padding[0];
		docStyle.paddingLeft = this.padding[1];
		docStyle.paddingRight = this.padding[2];
		docStyle.height = this.initialHeight + "vw";
		document.getElementById("editable").appendChild(this.docBody);
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
