var trackbuilder = new TrackBuilder(Synth1);
var notes = [];
/*notes [notes.length] = new Note(880, 0, 1); 
notes [notes.length] = new Note(1320, 1, 1);
notes [notes.length] = new Note(880, 2, 1); 
notes [notes.length] = new Note(1320, 3, 1);
notes [notes.length] = new Note(880, 4, 1); 
notes [notes.length] = new Note(1320, 5, 2);


notes [notes.length] = new Note(440, 0, 0.5); 
notes [notes.length] = new Note(523.25, 0.5, 0.5);
notes [notes.length] = new Note(659.26, 1, 0.5);
notes [notes.length] = new Note(880, 1.5, 1);
notes [notes.length] = new Note(659.26, 2.5, 0.5);
notes [notes.length] = new Note(523.25, 3, 0.5);
notes [notes.length] = new Note(440, 3.5, 2);*/

notes [notes.length] = new Note(880, 0, 1); 
notes [notes.length] = new Note(1320, 1, 2);

for (var i = 0; i < notes.length; i++) {
    trackbuilder.addNote(notes[i]);
} 


trackbuilder.changeTempo(140);
trackbuilder.play();