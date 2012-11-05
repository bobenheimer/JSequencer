var Piano = function(track) {
    this.track = track;
    this.whiteCanvas = document.getElementById('white-keys');
    this.blackCanvas = document.getElementById('black-keys');
    this.whiteContext = this.whiteCanvas.getContext("2d");
    this.blackContext = this.blackCanvas.getContext("2d");
    this.whiteHeight = 40;
    this.whiteWidth = 150;
    this.blackHeight = 20;
    this.blackWidth = 75;
    this.blackOffset = this.whiteHeight - this.blackHeight / 2;
    this.octaveHeight = this.whiteHeight * 7; //The height of an entire octave is 7 x the height of a white key
    this.piano = document.getElementById('piano');
    this.sequencer = document.getElementById('sequencer');
    //this.sequencer.scrollTop = 500;
    this.pastKey = null;
    this.numbWhiteKeys = 52;
    this.clickTable = [0, this.whiteHeight, this.whiteHeight + this.blackOffset, 2 * this.whiteHeight, 2 * this.whiteHeight + this.blackOffset,
                      3 * this.whiteHeight, 3 * this.whiteHeight + this.blackOffset, 4 * this.whiteHeight, 5 * this.whiteHeight, 
                      5 * this.whiteHeight + this.blackOffset, 6 * this.whiteHeight, 6 * this.whiteHeight + this.blackOffset]; //starts at y location for C, then B, then A# and so on
    console.log(this.clickTable);
    //this.noteTable = ['c', 'b', 'a#', 'a', 'g#', 'g', 'f#', 'f', 'e', 'd#', 'd', 'c#'];
    this.piano.onmousedown = (function(e) {
        //var x = e.pageX - piano.offsetLeft;
        //var y = e.pageY - piano.offsetTop + this.sequencer.scrollTop;
        var x = e.pageX;
        var y = e.pageY;
        var drawY = this.getNoteOffset(x, y); 
        var octaveGroup = Math.floor(drawY / this.octaveHeight); //each group of notes consisting of an octave, starting from top: C8 - D7 is 0, C7 - C6 is 1, etc
        for (var i = 0; i < this.clickTable.length; i++) {
            if (this.clickTable[i] == drawY % this.octaveHeight) {
                this.track.playNote(
                        Math.pow(2, (Math.abs(octaveGroup * 12 + i - 88) - 49) / 12) * 440,
                        0, 1, 1);
                //console.log(Math.pow(2, (Math.abs(octaveGroup * 12 + i - 88) - 49) / 12) * 440);
                return;
            }
        }
        //this.track.playNote(new Note(440, 0, 1, 1));
    }).bind(this);
    this.piano.onmousemove = (function(e) {
        //console.log(this.sequencer.scrollTop);
        //var x = e.pageX - piano.offsetLeft;
        //var y = e.pageY - piano.offsetTop + this.sequencer.scrollTop; 
        var x = e.pageX;
        var y = e.pageY;
        var drawY = this.getNoteOffset(x, y);       
        //console.log(drawY);
        if (drawY != this.pastKey){
            //console.log(drawY);
            if (drawY % this.whiteHeight == 0) {
                this.drawWhiteKey(drawY, '#ABD', '#4FA');                     
            }
            else {
                this.drawBlackKey(drawY, '#B0B', '#FAB');
            }
            
            if (this.pastKey != null) {
                if (this.pastKey % this.whiteHeight == 0) { //revert the previous key that was moused over
                    this.drawWhiteKey(this.pastKey);                     
                }
                else {
                    this.drawBlackKey(this.pastKey);
                }                
            }            
            this.pastKey = drawY;
        }
    }).bind(this); 
    
    //draw the whole piano
    for(var i = 0; i < this.numbWhiteKeys; i++) {
        if (i % 7 == 0 || i % 7 == 4) {
            this.drawWhiteKey(i * this.whiteHeight);   

        }
        else {
            this.drawWhiteKey(i * this.whiteHeight);
            this.drawBlackKey(i * this.whiteHeight + this.blackOffset);  
        }
    }
}    


Piano.prototype.drawWhiteKey = function(y, color, strokeColor) {
    this.whiteContext.fillStyle = color ||'#FFF'; 
    this.whiteContext.strokeStyle = strokeColor || '#000'; 
    this.whiteContext.lineWidth = 0;
    this.whiteContext.fillRect(0, y, this.whiteWidth, this.whiteHeight);
    this.whiteContext.strokeRect(0, y, this.whiteWidth, this.whiteHeight);
}

Piano.prototype.drawBlackKey = function(y, color, strokeColor) {
    this.blackContext.fillStyle = color || '#000'; 
    this.blackContext.strokeStyle =strokeColor || '#000'; 
    this.blackContext.lineWidth = 0;
    this.blackContext.fillRect(0, y, this.blackWidth, this.blackHeight);
    this.blackContext.strokeRect(0, y, this.blackWidth, this.blackHeight);   
}

Piano.prototype.getNoteOffset = (function(x, y) {
    var octaveGroup = Math.floor(y / this.octaveHeight);  //each group of notes consisting of an octave, starting from top: C8 - D7 is 0, C7 - C6 is 1, etc
    var noteRectangle = Math.floor(y / this.whiteHeight) % 7; //which white key the x,y coordinates are in. 0 is C, 1 is D .... 6 is B
    var relativeNoteOffsetY = y % this.whiteHeight; //0 is the highest C, then 30 is B, 60 is A, etc
    
    //calculate whether we are on a black key or a white key
    if(noteRectangle == 0 || noteRectangle == 4) { //if we're on C or F, the note a half step below is white not black
        if (x < 75 && relativeNoteOffsetY <= (this.blackHeight / 2)) {
            return octaveGroup * this.octaveHeight - (this.blackHeight / 2) + noteRectangle * this.whiteHeight;
        }
    }
    else if(noteRectangle == 1 || noteRectangle == 5) { //if we're on B or E, the note a half step above is white note black
        if (x < 75 && relativeNoteOffsetY >= (this.whiteHeight - this.blackHeight / 2)) {
            return octaveGroup * this.octaveHeight + this.blackOffset + noteRectangle * this.whiteHeight;
        }
    }
    else { //all other notes have black keys 1 half step both ways
        if (x < 75 && relativeNoteOffsetY <= (this.blackHeight / 2)) {
            return octaveGroup * this.octaveHeight - (this.blackHeight / 2) + noteRectangle * this.whiteHeight;
        }
        if (x < 75 && relativeNoteOffsetY >= (this.whiteHeight - this.blackHeight / 2)) {
            return octaveGroup * this.octaveHeight + this.blackOffset + noteRectangle * this.whiteHeight;
        }        
    }
    return octaveGroup * this.octaveHeight + noteRectangle * this.whiteHeight;
});

Piano.prototype.getNoteNumber = (function(x, y) {
    var octaveGroup = Math.floor(y / this.octaveHeight); //each group of notes consisting of an octave, starting from top: C8 - D7, C7 - C6 etc
    var noteRectangle = Math.floor(y / this.whiteHeight) % 7; //which white key the x,y coordinates are in. 0 is C, 1 is D .... 6 is B
    var relativeNoteOffsetY = y % this.whiteHeight; //0 is the highest C, then 30 is B, 60 is A, etc
    
    //calculate whether we are on a black key or a white key
    if(noteRectangle == 0 || noteRectangle == 4) { //if we're on C or F, the note a half step below is white not black
        if (x < 75 && relativeNoteOffsetY <= 10) {
            return octaveGroup * 210 - 10 + noteRectangle * 30;
        }
        else {
            
        }
    }
    else if(noteRectangle == 1 || noteRectangle == 5) { //if we're on B or E, the note a half step above is white note black
        if (x < 75 && relativeNoteOffsetY >= 20) {
            return octaveGroup * 210 + 20 + noteRectangle * 30;
        }
    }
    else { //all other notes have black keys 1 half step both ways
        if (x < 75 && relativeNoteOffsetY <= 10) {
            return octaveGroup * 210 - 10 + noteRectangle * 30;
        }
        if (x < 75 && relativeNoteOffsetY >= 20) {
            return octaveGroup * 210 + 20 + noteRectangle * 30;
        }        
    }
    return octaveGroup * 210 + noteRectangle * 30;
});
