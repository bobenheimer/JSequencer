var toString = function(arr) {
    var i;
    var str = "[";
    for (i=0; i < arr.length; i++)
        str += arr[i] + ",";
    console.log(str + "]");
}

trackbuilder = new TrackBuilder();
trackbuilder.addNote(440, 0, 1);
trackbuilder.addNote(660, 2, 1);
trackbuilder.addNote(880, 5, 1);
trackbuilder.addNote(659.26, 1, 1);
trackbuilder.addNote(659.26, 3, 2);
trackbuilder.addNote(523.25, 6, 2);
//poo.addNote(880, 3, 1);
toString(trackbuilder.durationPattern);
toString(trackbuilder.frequencyPattern);
toString(trackbuilder.beatPattern);
console.log(trackbuilder.lastBeat);
trackbuilder.play();