"use strict";

class View {
    constructor(cont, method) {
        this.cont = cont;
        this.method = method;
        
        this.el = document.createElement("div");
        this.el.className = "search";
        this.el.innerHTML = `
                <h1>${method}</h1>
                <input/>
                <div class='results'></div>
        `;
        this.ui = {};
        this.ui.input = this.el.querySelector("input");
        this.ui.results = this.el.querySelector(".results");
        
        this.ui.input.onkeyup = this.onKeyupInput.bind(this);
        
        document.body.appendChild( this.el );
    }
    
    onKeyupInput() {
        var search = this.ui.input.value || "";
		var out = [];
        var timeStart = Date.now();
		if ( search.length >= 4 ) {
			out = this.cont[ this.method ](search);
		}
        this.out = out;
        var time = Date.now() - timeStart;
        
        var header = "<h2>("+ out.length +") of "+ time +"ms</h2>";
        
        this.ui.results.innerHTML = header + out.slice(0, 100).map(function(id) {
            return "<div class='results-line'>" + this.cont.texts[id] + "</div>";
        }.bind(this)).join("");
    }
}