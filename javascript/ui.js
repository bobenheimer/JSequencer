var Piano = function(sharpHeight, adgHeight, bcefHeight, track) {
    this.track = track;
    this.blackfillStyle = "#aae3ab";
    this.whitefillStyle = "#ddf4fc";
    this.strokeStyle = "#FA6";
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
    this.container = document.getElementById('piano-container');
    this.blackKeyLookup = [];
    this.whiteKeyLookup = [];
    this.pastKey = null;
    this.piano.onmousedown = (function(e) {
        var x = e.pageX - this.piano.offsetLeft;
        var y = e.pageY - this.piano.offsetTop + this.container.scrollTop;
        var key = this.getKey(x, y);
        this.playNote(key);
    }).bind(this);
    
    this.piano.onmousemove = (function(e) {
        console.log(this.piano.offsetTop);
        var x = e.pageX - this.piano.offsetLeft;
        var y = e.pageY - this.piano.offsetTop  + this.container.scrollTop;
        //console.time('poo');
        var key = this.getKey(x, y);
        //console.log(key);
        if (key != this.pastKey) {
            this.drawNote(key, true)
            if (this.pastKey != null) {
                this.drawNote(this.pastKey, false)             
            }          
            this.pastKey = key;
        }

        //console.timeEnd('poo');
    }).bind(this);
    
    this.piano.onmouseout = (function() {
        this.drawNote(this.pastKey, false);
    }).bind(this);
}

Piano.prototype.drawNote = function(key, highlight) {
    if (highlight) {
        if (key.black) {
            key.draw(this.blackContext, this.blackfillStyle, this.strokeStyle);
        }
        else {
            key.draw(this.whiteContext, this.whitefillStyle, this.strokeStyle);
        }        
    }
    else {
        if (key.black) {
            key.draw(this.blackContext);
        }
        else {
            key.draw(this.whiteContext);
        }            
    }
}

Piano.prototype.drawPiano = function(startKey, startOctave, numKeys) {
    this.height = 0;
    var notes =  ['g#', 'g', 'f#', 'f', 'e', 'd#', 'd' ,'c#', 'c', 'b', 'a#', 'a'];
    var mappings=[ 8,    7,    6,   5,   4,   3,   2,   1,   0,   11,   10,    9];
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
    var startNote = 12 * startOctave - 8 + mappings[startindex] 
    octave = startOctave;
    var nextY = 0;
    for(var i=0, j = startindex; i < numKeys; i++, j = (j + 1) % 12) {
        var frequency =  Math.pow(2, (Math.abs(startNote - i) - 49) / 12) * 440;
        if(notes[j][1] == '#') {
            this.keys[i] = new PianoKey(nextY, this.sharpHeight, notes[j], octave, frequency);
            //this.keys[i].draw(this.blackContext);
        }
        else if(notes[j] == 'a' || notes[j] == 'd' || notes[j] == 'g') {
            this.height += this.adgHeight;
            this.keys[i] = new PianoKey(nextY, this.adgHeight, notes[j], octave, frequency);
            //this.keys[i].draw(this.whiteContext);
        }
        else {
            this.height += this.bcefHeight;
            this.keys[i] = new PianoKey(nextY, this.bcefHeight, notes[j], octave, frequency);
            //this.keys[i].draw(this.whiteContext);
        }
        if (this.keys[i].note == 'c') {
            octave -= 1;
        }
        nextY += notesOffset[j];
    }
    //create lookup table for black keys
    for(var i = 0; i < 12; i++) {
        if (this.keys[i].black) {
            for (var j = 0, k = this.keys[i].y; j < this.keys[i].height; j++, k++) {
                this.blackKeyLookup[k] = i;
            }
        }
    }
    //create lookup table for white keys
    for(var i = 0; i < 12; i++) {
        if (!this.keys[i].black) {
            for (var j = 0, k = this.keys[i].y; j < this.keys[i].height; j++, k++) {
                this.whiteKeyLookup[k] = i;
            }
        }
    }    
    if (this.keys[this.keys.length - 1].black) {
        this.height += this.blackOffset
    }
    
    this.piano.style.height = this.height + "px";
    this.whiteCanvas.height = this.height;
    this.blackCanvas.height = this.height;
    for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].black) {
            this.keys[i].draw(this.blackContext);
        }
        else {
            this.keys[i].draw(this.whiteContext);
        }
    }

}

Piano.prototype.getHeight = function() {
    return this.keys[this.keys.length - 1].y + this.keys[this.keys.length - 1].height;
}


Piano.prototype.playNote = function(key) {
    this.track.playNote(key.frequency, 0, 1, 1);
}

Piano.prototype.getKey = function(x, y) {
    var relativeYOffset = y % this.octaveHeight;
    var octaveOffset = 12 * Math.floor(y / this.octaveHeight);
    if (x > 75) {
        return this.keys[this.whiteKeyLookup[relativeYOffset] + octaveOffset];
    }
    else {
        if(y > this.octaveHeight * Math.floor(y / this.octaveHeight) && y < this.octaveHeight * Math.floor(y / this.octaveHeight) + this.blackOffset) {
            return this.keys[this.blackKeyLookup[this.octaveHeight] + octaveOffset - 12];
        }
        return this.keys[this.blackKeyLookup[relativeYOffset] + octaveOffset] || this.keys[this.whiteKeyLookup[relativeYOffset] + octaveOffset];
    }
}


var PianoKey = function (y, height, note, octave, frequency) {
    this.octave = octave;
    this.frequency = frequency || 440;
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
    context.fillStyle = fillStyle || this.fillStyle; 
    context.strokeStyle = strokeStyle || '#000';
    context.lineWidth = 0;
    context.fillRect(0, this.y, this.width, this.height);
    context.strokeRect(0, this.y, this.width, this.height);
    if (this.black) {
        context.fillStyle = "#FFF";    
    }
    else {
        context.fillStyle = "#000";             
    }
    context.fillText(this.note.toUpperCase() + this.octave, this.width - 25, this.y + (this.height / 2));    
}

var Grid = function(canvas, noteCanvas, piano) {
    this.piano = piano;
    this.keyHeight = this.piano.blackOffset * 2;
    this.keys = piano.keys;
    this.beatsPerMeter = 4;
    canvas.height = piano.height;
    noteCanvas.height = piano.height;
    this.context = canvas.getContext("2d");
    this.noteContext = noteCanvas.getContext("2d");
    this.grid = document.getElementById('grid');
    this.grid.style.height = piano.height + "px";
    this.container = document.getElementById('grid-container');
    this.width = canvas.width;
    this.height = canvas.height;
    //this.gridToNoteMap = {};
    this.currentNoteDuration = 0.5;
    this.smallestBeatIncrement = 0.25;
    this.startY = 0;
    this.pastKey;
    this.grid.onmousemove = (function(e) {
        var x = e.pageX - this.grid.offsetLeft + this.container.scrollLeft;
        var y = e.pageY - this.grid.offsetTop + this.container.scrollTop;
        var key = this.keys[this.getKeyIndex(x, y)];
        if (key == undefined) {
            return;
        }
        if (key != this.pastKey) {
            this.piano.drawNote(key, true)
            if (this.pastKey != null) {
                this.piano.drawNote(this.pastKey, false)             
            }     
            this.pastKey = key;
        }
    }).bind(this);
    
    this.grid.onmousedown = (function(e) {
        var x = e.pageX - this.grid.offsetLeft + this.container.scrollLeft;
        var y = e.pageY - this.grid.offsetTop + this.container.scrollTop;;
        this.processClick(x, y);
    }).bind(this);
    
    this.grid.onmouseout = (function() {
        this.piano.drawNote(this.pastKey, false);
    }).bind(this);
    
}


Grid.prototype.drawGrid = function(cellWidth, cellBeatLength) {
    this.cellWidth = cellWidth || this.width / 16;
    this.cellBeatLength = cellBeatLength || 1;
    this.smallestPixelBeatIncrement = this.cellWidth * this.smallestBeatIncrement / this.cellBeatLength;
    this.noteXLookup = [];
    this.context.lineWidth = 0;
    if (this.keys[0].black) {
        this.startY = 0;        
    }
    else {
        this.startY = this.piano.blackOffset;        
    }
    
    for(var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].black) {
            this.context.fillStyle = '#cae3eb';
        }
        else if (!this.keys[i].black){
            this.context.fillStyle = '#ddf4fc';
        }
        
        if(this.keys[i].black) {
            this.context.fillRect(0, this.keys[i].y, this.width, this.keys[i].height);
            this.context.strokeRect(0, this.keys[i].y, this.width, this.keys[i].height);
            //this.gridToNoteMap[keys[i].y] = keys[i];
        }
        else if(this.keys[i].note == 'a' || this.keys[i].note == 'd' || this.keys[i].note == 'g'){
            this.context.fillRect(0, this.keys[i].y + this.piano.blackOffset, this.width, this.keys[i].height -  this.piano.blackOffset);
            this.context.strokeRect(0, this.keys[i].y + this.piano.blackOffset, this.width, this.keys[i].height - this.piano.blackOffset);   
            //this.gridToNoteMap[keys[i].y + this.piano.blackOffset] = keys[i];
        }
        else if(this.keys[i].note == 'c' || this.keys[i].note == 'f'){
            this.context.fillRect(0, this.keys[i].y + this.piano.blackOffset, this.width, this.keys[i].height);
            this.context.strokeRect(0, this.keys[i].y + this.piano.blackOffset, this.width, this.keys[i].height);  
            //this.gridToNoteMap[keys[i].y + this.piano.blackOffset] = keys[i];
        }
        else {
            this.context.fillRect(0, this.keys[i].y, this.width, this.keys[i].height -  this.piano.blackOffset);
            this.context.strokeRect(0, this.keys[i].y, this.width, this.keys[i].height -  this.piano.blackOffset);  
            //this.gridToNoteMap[keys[i].y] = keys[i];
        }
    }
    
    var numCells = this.width / this.cellWidth;
    var cellsInMeasure = this.beatsPerMeter / this.cellBeatLength;
    //console.log(cellsInMeasure);
    for(var i = 0; i < numCells; i++) {
        if(i % cellsInMeasure == 0) {
            this.context.strokeStyle = '#000';
        }
        else {
            this.context.strokeStyle = '#6E6E6E';   
        }
        this.context.beginPath();
        this.context.moveTo(i * this.cellWidth, 0);
        this.context.lineTo(i * this.cellWidth, this.height);
        this.context.stroke();

    }
    
    /*for (var i = 0; i < this.width; i = i + this.cellWidth) {
        if (i % this.beatsPerMeter == 0) {
            this.context.strokeStyle = '#ff0000';
        }
        else {
            this.context.strokeStyle = '#000';
        }
        this.context.moveTo(i, 0);
        this.context.lineTo(i, this.height);
        this.context.stroke();
    }*/
    
    //REDOE THE NOTEXGRIDTHING
    
    for (var i = 0; i < this.width / this.smallestPixelBeatIncrement; i++) {
        this.noteXLookup[i] = [];
    }
    //console.log(this.noteXLookup);
}

Grid.prototype.getKeyIndex = function(x, y) {
    var keyIndex = Math.floor((y - this.startY)/ this.keyHeight);
    //console.log(keyIndex);
    return keyIndex;
   // return this.keys[keyIndex];
}

Grid.prototype.drawNote = function(x, y, height, width) {

    //console.log(xPosition);
    this.noteContext.fillStyle = '#F00';
    //console.log(this.startY + keyIndex * this.keyHeight);
    this.noteContext.fillRect(x, y, height, width);
    this.noteContext.strokeRect(x, y, height, width);
    
    //this.noteContext.save();

 // Use the identity matrix while clearing the canvas
    //this.noteContext.setTransform(1, 0, 0, 1, 0, 0);
    //this.noteContext.lineWidth = 1;
    //this.noteContext.clearRect(x, y, height + 1, width + 1);

 // Restore the transform
    //this.noteContext.restore();
    
    /*this.noteContext.lineWidth = 0;
    this.noteContext.clearRect(x, y, height, width); */
}

Grid.prototype.processClick = function(x, y) {
    var cellLocation = Math.floor(x / this.cellWidth) * this.cellWidth;
    var notePixelLength = this.currentNoteDuration / this.cellBeatLength * this.cellWidth;
    var cellLocationOffset = Math.floor(x % this.cellWidth  / (this.smallestBeatIncrement * this.cellWidth / this.cellBeatLength)) *  this.smallestPixelBeatIncrement;
    //* this.cellWidth * this.smallestBeatIncrement;
    var xPosition = cellLocation + cellLocationOffset;
    var keyIndex = Math.floor((y - this.startY)/ this.keyHeight);
    var yPosition = this.startY + keyIndex * this.keyHeight;
    
    
    var beatNumber = xPosition * this.cellBeatLength / this.cellWidth;
    //console.log(beatNumber);
    if (1) {
        var noteToDraw = new DrawnNote(xPosition, yPosition, notePixelLength);
        //this.drawNote(xPosition, yPosition, notePixelLength, this.keyHeight);
        var currentIndex = xPosition / this.smallestPixelBeatIncrement;
        if (this.noteXLookup[currentIndex].length == 0) {
            this.noteXLookup[currentIndex] = [noteToDraw];
            this.drawNote(xPosition, yPosition, notePixelLength, this.keyHeight);
            this.piano.track.playNote(this.keys[keyIndex].frequency, 0, this.currentNoteDuration, 1);       
            this.piano.track.addNote(new Note(this.keys[keyIndex].frequency, beatNumber, this.currentNoteDuration, 1));
        }
        else {
            if (!this.checkSameNote(noteToDraw, this.noteXLookup[currentIndex])) {
                this.noteXLookup[currentIndex][this.noteXLookup[currentIndex].length] = noteToDraw; 
                this.drawNote(xPosition, yPosition, notePixelLength, this.keyHeight);
                this.piano.track.playNote(this.keys[keyIndex].frequency, 0, this.currentNoteDuration, 1);       
                this.piano.track.addNote(new Note(this.keys[keyIndex].frequency, beatNumber, this.currentNoteDuration, 1));
            }
            else {
                this.removeNote(yPosition, this.noteXLookup[currentIndex]);
                this.drawNotes();
                this.piano.track.removeNote(this.keys[keyIndex].frequency, beatNumber, this.currentNoteDuration, 1);
            }

        }
        //console.log(this.noteXLookup);

    }



    
}

Grid.prototype.removeNote = function(y, notes) {
    //console.log(y);
    for (var i = 0; i < notes.length; i++) {
        if(notes[i].y == y) {
            notes.splice(i ,1);
            return;
        }
    }
}

Grid.prototype.checkSameNote = function(noteToDraw, notes) {
    //console.log(noteToDraw);
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].x == noteToDraw.x && notes[i].y == noteToDraw.y)
            return true;
    }
    return false;
}

Grid.prototype.drawNotes = function() {
    //this.noteContext.save();
    //this.noteContext.setTransform(1, 0, 0, 1, 0, 0);
    this.noteContext.clearRect(0, 0, this.width, this.height);
    //this.noteContext.restore();
    
    for (var i = 0; i < this.noteXLookup.length; i++) {
        for(var j = 0; j < this.noteXLookup[i].length; j++) {
            this.drawNote(this.noteXLookup[i][j].x, this.noteXLookup[i][j].y, this.noteXLookup[i][j].length, this.keyHeight);
        } 
    }
}

var DrawnNote = function(x, y, length) {
    this.x = x;
    this.y = y;
    this.length = length;
}

var Controls = function(song, piano, grid) {
    this.song = song;
    this.piano = piano;
    this.grid = grid;
    this.playButton = document.getElementById('play-button');
    this.tempoButton = document.getElementById('tempo');
    this.tempoButton.value = this.song.tempo;
    this.noteLengthsElements = document.getElementById('note-lengths').children;
    this.noteLengths = [4, 2, 1, 0.5, 0.25];
    
}

Controls.prototype.addListeners = function() {
    var self = this;
    this.playButton.addEventListener('click', function() {
        //console.log(self.song);
        self.song.play(0);
    }, false);
    
    this.tempoButton.onblur = (function() {
        if (this.tempoButton.valueAsNumber < 30) {
            this.tempoButton.value = this.song.tempo;
        }
        else {
            this.song.changeTempo(this.tempoButton.valueAsNumber);
        }

    }.bind(this));

    /*this.tempoButton.oninput = function() {
        self.song.changeTempo(parseInt(self.tempoButton.value, 10));
        //console.log(self.song.tempo);
    }*/
    
    for (var i = 0; i < this.noteLengthsElements.length; i++) {
        this.noteLengthsElements[i].addEventListener('click', this.addNoteLength.bind(this, this.noteLengths[i], this.noteLengthsElements[i]), false);
    }
    
    
} 

Controls.prototype.addNoteLength = function(length, element) {
    this.grid.currentNoteDuration = length;
    for (var i = 0; i < this.noteLengthsElements.length; i++) {
        this.noteLengthsElements[i].style.border = "outset";
    }
    element.style.border = "inset";
}

var initialize = function() {
    //var mainHeight = window.innerHeight document.getElementById();
    var menuHeight = document.getElementById('menu').clientHeight;
    //var measureCounterHeight = document.getElementById('measure-counter').clientHeight;
    //var height = window.innerHeight - menuHeight - measureCounterHeight - 10;
    var height = window.innerHeight - menuHeight - 10;
    console.log(height);
    document.getElementById('main').style.height = height + "px";
}

