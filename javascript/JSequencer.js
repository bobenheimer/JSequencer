var TrackBuilder = function(instrument) {
    this.audiolet = new Audiolet();
    this.notes = [];
    this.instrument = instrument;
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
TrackBuilder.prototype.removeNote = function(note) {   
    //binary search tree seems kind of overkill for now
    for (var i = 0; i < this.notes.length; i++) {
        if (this.notes[i] == note) {
            this.notes.splice(i, 1);
        }
    }
}

/**
 * Play the song
 */
TrackBuilder.prototype.play = function() {
    for (var i = 0; i < this.notes.length; i++) {
        this.audiolet.scheduler.addRelative(this.notes[i].beat, this.playNote.bind(this, this.notes[i].frequency));
        this.audio
    }
}

TrackBuilder.prototype.playNote = function(frequency) {
    var note = new this.instrument(this.audiolet, frequency);
    note.connect(this.audiolet.output);
}

var Note = function(frequency, beat, length) {
    this.frequency = frequency;
    this.beat = beat;
    this.length = length;    
}

Note.prototype.toString = function() {
    return "frequency:" + this.frequency + " beat: " + this.beat + " length: " + this.length; 
}




var Synth1 = function(audiolet, frequency, attack, release ) {
    //console.log(frequency)
    AudioletGroup.apply(this, [audiolet, 0, 1]);
    // Basic wave
    this.sine = new Sine(audiolet, frequency);
    
    // Gain envelope
    this.gain = new Gain(audiolet);
    this.env = new PercussiveEnvelope(audiolet, 1, 0.01, .55,
        function() {
            audiolet.scheduler.addRelative(0, this.remove.bind(this));
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
extend(Synth1, AudioletGroup);
