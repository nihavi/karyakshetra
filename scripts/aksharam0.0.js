var Aksharam = new(function(){
	
	function MyDoc() {
        this.characterCount = 0;
        this.docBody = document.createElement("div");
        this.docBody["classname"] = "mydoc";
        this.docBody.contentEditable = "true";
        this.render();
    }
    
    var docProto = MyDoc.prototype;
    
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
