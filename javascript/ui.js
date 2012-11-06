/*
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
        var x = e.pageX - piano.offsetLeft;
        var y = e.pageY - piano.offsetTop;
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
        var x = e.pageX - piano.offsetLeft;
        var y = e.pageY - piano.offsetTop;
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
 */

var Piano = function(sharpHeight, adgHeight, bcefHeight) {
    this.whiteWidth = 150;
    this.whiteCanvas = document.getElementById('white-keys');
    this.blackCanvas = document.getElementById('black-keys');
    this.whiteContext = this.whiteCanvas.getContext("2d");
    this.blackContext = this.blackCanvas.getContext("2d");
    this.keys = [];
    this.sharpHeight = sharpHeight;
    this.adgHeight = adgHeight;
    this.bcefHeight = bcefHeight;
    this.blackOffset = sharpHeight / 2;
    this.octaveHeight = 3 * this.adgHeight + 4 * this.bcefHeight; //The height of an entire octave is 7 x the height of a white key
    this.piano = document.getElementById('piano');
    this.piano.onmousedown = (function(e) {
        this.keys[1].draw(this.whiteContext, '#B0B', '#FAG');
    }).bind(this);
}

Piano.prototype.drawPiano = function(startKey, numKeys) {
    var notes = ['g#', 'g', 'f#', 'f', 'e', 'd#', 'd' ,'c#', 'c', 'b', 'a#', 'a'];
    var notesOffset = [
                       this.blackOffset,
                       this.adgHeight - this.blackOffset,
                       this.blackOffset,
                       this.bcefHeight,
                       this.bcefHeight - this.blackOffset,
                       this.blackOffset,
                       this.adgHeight - this.blackOffset,
                       this.blackOffset,
                       this.bcefHeight,
                       this.bcefHeight - this.blackOffset,
                       this.blackOffset,
                       this.adgHeight - this.blackOffset
                       ];
    var startindex = notes.indexOf(startKey);
    var nextY = 0;
    for(var i=0, j = startindex; i < numKeys; i++, j = (j + 1) % 12) {
       // console.log(notes[j]);
        if(notes[j][1] == '#') {
            this.keys[i] = new PianoKey(nextY, this.sharpHeight, notes[j]);
            this.keys[i].draw(this.blackContext);
        }
        else if(notes[j] == 'a' || notes[j] == 'd' || notes[j] == 'g') {
            this.keys[i] = new PianoKey(nextY, this.adgHeight, notes[j]);
            this.keys[i].draw(this.whiteContext);
        }
        else {
            this.keys[i] = new PianoKey(nextY, this.bcefHeight, notes[j]);
            this.keys[i].draw(this.whiteContext);
        }
        nextY += notesOffset[j];
    }

}

Piano.prototype.getHeight = function() {
    return this.keys[this.keys.length - 1].y + this.keys[this.keys.length - 1].height;
}

Piano.prototype.getKey = function(x, y) {
    var keyIndex = this.searchKeys(y);
    if (x > this.whiteWidth / 2) { //white keys only
        if (this.notes[keyIndex].black) {
            if(this.isInside(y, this.notes[keyIndex - 1])) {
                return this.notes[keyIndex - 1];
            }
            else {
                return this.notes[keyIndex + 1];
            }
        }
        else {
            return this.notes[keyIndex];
        }
    }
    else {
        if (this.notes[keyIndex].black) { //could be a black key
            
        }
        else {
            
        }
    } 
    //return this.searchKeys(90);

}

Piano.prototype.searchKeys = function(y) {
    var low = 0, high = this.keys.length - 1,
        i;
    while(low <= high) {
       // console.log('foo');
        i = Math.floor((low + high) / 2);
        //if (y >= this.keys[i].y && y <= this.keys[i].y + this.keys[i].height) {
         if (this.isInside(y, this.keys[i])) {
            //return this.keys[i];
            return i;
        }
        if (this.keys[i].y < y) {
            low = i + 1;
            continue;
        }
        if (this.keys[i].y > y) {
            high = i - 1;
            continue;
        }
        //return this.keys[i];
    }
    return null;
}

Piano.prototype.isInside = function(y, key) {
    return y >= key.y && y <= key.y + key.height;
}

/*Piano.prototype.drawWhiteKey = function(y, color, strokeColor) {
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
} */

var PianoKey = function (y, height, note) {
    this.y = y;
    this.height = height;
    this.note = note;
    if (this.note[1] == '#') {
        this.black = true;
        this.width = 75;
        this.fillStyle = '#000'; 
    }
    else {
        this.black = false;
        this.width = 150;
        this.fillStyle = '#FFF'; 
    }
}

PianoKey.prototype.draw = function(context, fillStyle, strokeStyle) {
    //if(this.note != 'f') return;
    //console.log(this.keys);
    context.fillStyle = fillStyle || this.fillStyle; 
    context.strokeStyle = strokeStyle || '#000';
    context.lineWidth = 0;
    context.fillRect(0, this.y, this.width, this.height);
    context.strokeRect(0, this.y, this.width, this.height);
}

var Grid = function(canvas) {
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    
}

Grid.prototype.drawGrid = function(numKeys, keyHeight, start, startNote) {
    var cellWidth = this.width / 16;
    var notes = ['g#', 'g', 'f#', 'f', 'e', 'd#', 'd' ,'c#', 'c', 'b', 'a#', 'a'];
    var startNotetoDraw = notes.indexOf(startNote);
    this.context.lineWidth = 0; 
    for(var i = start, j = startNotetoDraw; i < this.height; i = i + keyHeight, j = (j + 1) % 12) {
        if (notes[j][1] == '#' ) {
            this.context.fillStyle = '#cae3eb';   
        }
        else {
            //this.context.fillStyle = '#FFF';   
            //this.context.fillStyle = '#c3e1eb'; 
            this.context.fillStyle = '#ddf4fc';
        }
        console.log(i);
        this.context.fillRect(0, i, this.width, keyHeight);
        this.context.strokeRect(0, i, this.width, keyHeight);
    }
    this.context.lineWidth = 1; 
    for (var i = 0; i < this.width; i = i + cellWidth) {
        this.context.moveTo(i, 0);
        this.context.lineTo(i, this.height);
        //this.context.lineTo(graph.width(), graph.height() - yPadding);
        this.context.stroke();
    }


}
