
function test2() {


var notes = [];

var song = new Song();
song.createTrack(Synth1);
song.createTrack(Synth2);
song.createTrack(Synth3);
var track1 = song.tracks[0];
var track2 = song.tracks[1];
var track3 = song.tracks[2];



notes [notes.length] = new Note(164.81, 0, 8, 1); 
notes [notes.length] = new Note(110, 0, 8, 1); 
notes [notes.length] = new Note(440, 0, 0.5, 1); 
notes [notes.length] = new Note(523.25, 0.5, 0.5, 1);
notes [notes.length] = new Note(659.26, 1, 0.5, 1);
notes [notes.length] = new Note(880, 1.5, 0.5, 1);
notes [notes.length] = new Note(1046.50, 2, 0.5, 1);
notes [notes.length] = new Note(880, 2.5, 0.5, 1);
notes [notes.length] = new Note(659.26, 3, 0.5, 1);
notes [notes.length] = new Note(523.25, 3.5, 0.5, 1);
notes [notes.length] = new Note(440, 4, 0.5, 1);
notes [notes.length] = new Note(523.25, 4.5, 0.5, 1);
notes [notes.length] = new Note(659.26, 5, 0.5, 1);
notes [notes.length] = new Note(880, 5.5, 0.5, 1);
notes [notes.length] = new Note(1046.50, 6, 0.5, 1);
notes [notes.length] = new Note(880, 6.5, 0.5, 1);
notes [notes.length] = new Note(659.26, 7, 0.5, 1);
notes [notes.length] = new Note(523.25, 7.5, 0.5, 1);
notes [notes.length] = new Note(440, 8, 2, 1); 



track2.addNote(new Note(220, 0, 1, 1));
track2.addNote(new Note(330, 1, 1, 1));
track2.addNote(new Note(220, 2, 1, 1));
track2.addNote(new Note(330, 3, 1, 1));
track2.addNote(new Note(220, 4, 1, 1));
track2.addNote(new Note(330, 5, 1, 1));
track2.addNote(new Note(220, 6, 1, 1));
track2.addNote(new Note(330, 7, 1, 1));
track2.addNote(new Note(220, 8, 1, 1));


track3.addNote(new Note(330, 0, 1, 1));
track3.addNote(new Note(330, 1, 1, 1));
track3.addNote(new Note(330, 2, 1, 1));
track3.addNote(new Note(330, 3, 1, 1));
track3.addNote(new Note(330, 4, 1, 1));
track3.addNote(new Note(330, 5, 1, 1));
track3.addNote(new Note(330, 6, 1, 1));
track3.addNote(new Note(330, 7, 1, 1));
track3.addNote(new Note(330, 8, 1, 1));  
//track3.addNote(new Note(330, 7, 1)); */

for (var i = 0; i < notes.length; i++) {
    track1.addNote(notes[i]);
} 

//trackbuilder.removeNote(notes[3]);

//track1.changeTempo(140);
song.changeTempo(300);
song.play();

}

function test1() {

}



