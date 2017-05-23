"use strict";

class Cont {
    constructor() {
        this.texts = window.texts;
		delete window.texts;
        this.lowerTexts = this.texts.map(function(text) {
            return text.toLowerCase();
        });
        
        // double alphabet
        
        this.idsByDoubleAlpha = {};
        this.lowerTexts.map(this.getDoubleAlphabet).forEach(function(doubleAlphabet, id) {
            for (var i=0, n=doubleAlphabet.length; i<n; i++) {
                var doubleAlpha = doubleAlphabet[i],
					list = this.idsByDoubleAlpha[doubleAlpha];
                
                if ( !list ) {
                    this.idsByDoubleAlpha[doubleAlpha] = [id,id];
					this.idsByDoubleAlpha[doubleAlpha].count = 1;
                } else {
					var last = list[list.length - 1];
					if ( last === id - 1 ) {
						list[ list.length - 1 ] = id;
					} else {
						list.push(id);
						list.push(id);
					}
					list.count++;
                }
            }
        }, this);
    }
    
    getAlphabet(text) {
    	var alpha = {};
    	for (var i=0, n=text.length; i<n; i++) {
    		alpha[ text[i] ] = 1;
    	}
    	return Object.keys(alpha).join("");
    }
    
    getDoubleAlphabet(text) {
        var doubleAlpha = {};
    	for (var i=0, n=text.length; i<n-2; i++) {
    		doubleAlpha[ text.slice(i, i+3) ] = 1;
    	}
    	return Object.keys(doubleAlpha);
    }
    
    find1(search) {
        var out = [];
        var m = search.length;
        var match;
        var firstLetter = search[0];
        
        for (var i=0, n=this.lowerTexts.length; i<n; i++) {
        	var text = this.lowerTexts[i];
            
            for (var k=0, l=text.length-m; k<=l; k++) {
                if ( text[k] == firstLetter ) {
                    match = true;
                    for (var j=1; j<m; j++) {
                        if ( text[k + j] !== search[j] ) {
                            match = false;
                            break;
                        }
                    }
                    if ( match ) {
                        out.push(i);
                        continue;
                    }
                }
            }
        }
        return out;
    }
    
    find2(search) {
        var out = [];
        for (var i=0, n=this.lowerTexts.length; i<n; i++) {
        	if ( this.lowerTexts[i].indexOf(search) >= 0 ) {
        		out.push(i);
        	}
        }
        return out;
    }
    
    find3(search) {
        search = search.toLowerCase();
        if ( search.length <= 3 ) {
            return this.idsByDoubleAlpha[search] || [];
        }
        
        var doubleAlphabet = this.getDoubleAlphabet(search),
            doubleAlpha = doubleAlphabet[0],
            minIds = this.idsByDoubleAlpha[doubleAlpha],
            i, n, ids;
        
        for (i=1, n=doubleAlphabet.length; i<n; i++) {
            doubleAlpha = doubleAlphabet[i];
            ids = this.idsByDoubleAlpha[doubleAlpha];
            
            if ( !ids ) {
                return [];
            }
            
            if ( ids.count < minIds.count ) {
                minIds = ids;
            }
        }
        
        var out = [];
        for (i=0, n=minIds.length; i<n; i+=2) {
            var firstId = minIds[i],
				lastId = minIds[i+1];
            
			for (var id=firstId; id<=lastId; id++) {
				var text = this.lowerTexts[ id ];
				
				if ( text.indexOf(search) > -1 ) {
					out.push(id);
				}
			}
        }
        return out;
    }
    
    test(method, search, count) {
        count = count || 1;
        method = this[ method ].bind(this);
        
        var out;
        var timeStart = Date.now();
        for (var i=0; i<count; i++) {
            out = method(search);
        }
        console.log(Date.now() - timeStart);
        return out;
    }
}
