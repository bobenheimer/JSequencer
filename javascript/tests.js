var trackbuilder = new TrackBuilder(Synth1);
var notes = [];
notes [notes.length] = new Note(440, 0, 1); 
notes [notes.length] = new Note(660, 1, 1);
notes [notes.length] = new Note(550, .5, .5);



for (var i = 0; i < notes.length; i++) {
    trackbuilder.addNote(notes[i]);
} 

trackbuilder.changeTempo(140);
trackbuilder.play();