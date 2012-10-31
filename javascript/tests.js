trackbuilder = new TrackBuilder();
trackbuilder.addNote(new Note(440, 0, 1));
trackbuilder.addNote(new Note(660, 1, 1));
/*trackbuilder.addNote(new Note(660, 0, 8));
trackbuilder.addNote(new Note(660, 2, 1));
trackbuilder.addNote(new Note(880, 5, 1));
trackbuilder.addNote(new Note(659.26, 1, 1));
trackbuilder.addNote(new Note(659.26, 3, 2));
trackbuilder.addNote(new Note(523.25, 6, 2));*/
for (var i = 0; i < trackbuilder.notes.length; i++)
{
    console.log(trackbuilder.notes[i].toString());
}
//trackbuilder.changeTempo()
trackbuilder.play();