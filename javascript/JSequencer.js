

var TrackBuilder = function() {
    this.audiolet = new Audiolet();
    this.notes = [];
}

/**
 * Add a single note to the track
 * @param frequency
 * @param beatNumber
 * @param noteLength
 */
TrackBuilder.prototype.addNote = function(note) {
    //binary search tree seems kind of overkill for now
    for (var i = 0; i < this.notes.length; i++) {
        if (this.notes[i].beat >= note.beat) {
            this.notes.splice(i, 0, note);
            return note;
        }
    }
    this.notes[this.notes.length] = note;
    return note;
}

TrackBuilder.prototype.changeTempo = function(newTempo) {
    this.audiolet.scheduler.setTempo(newTempo);
}

/**
 * Remove note given
 */
TrackBuilder.prototype.removeNote = function() {
    
}

/**
 * Play the song
 */
TrackBuilder.prototype.play = function() {
    for (var i = 0; i < this.notes.length; i++) {
        this.audiolet.scheduler.addRelative(this.notes[i].beat, this.playNote.bind(this, this.notes[i].frequency));
    }
}

TrackBuilder.prototype.playNote = function(frequency) {
    var synth = new Synth(this.audiolet, frequency);
    synth.connect(this.audiolet.output);  
}

var Note = function(frequency, beat, length) {
    this.frequency = frequency;
    this.beat = beat;
    this.length = length;    
}

Note.prototype.toString = function() {
    return "frequency:" + this.frequency + " beat: " + this.beat + " length: " + this.length; 
}

var Synth = function(audiolet, frequency, attack, release ) {
    AudioletGroup.apply(this, [audiolet, 0, 1]);
    // Basic wave
    this.sine = new Sine(audiolet, frequency);
    
    // Gain envelope
    this.gain = new Gain(audiolet);
    this.env = new PercussiveEnvelope(audiolet, 1, 0.01, .55,
        function() {
            this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
        }.bind(this)
    );
    this.envMulAdd = new MulAdd(audiolet, 0.2, 0);

    // Main signal path
    this.sine.connect(this.gain);
    this.gain.connect(this.outputs[0]);

    // Envelope
    this.env.connect(this.envMulAdd);
    this.envMulAdd.connect(this.gain, 0, 1);
}
extend(Synth, AudioletGroup);

