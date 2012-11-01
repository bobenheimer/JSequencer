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
            return;
        }
    }
}

/**
 * Play the song
 * may want to add startbeat as an instance variable or something and then have a setter function
 */
TrackBuilder.prototype.play = function(beat) {
	var difference = 0, start = 0;
	if(beat > this.notes[this.notes.length - 1].beat) {
		start = this.notes.length;
	}
	else if(beat) {
		var i = 0;
		while(beat > this.notes[i].beat) {
			i++;
			//console.log(i);
		}
		//console.log(i);
		start = i;
		difference = this.notes[i].beat - beat;
		console.log(difference);
	}
	for (var i = start; i < this.notes.length; i++) {
	    this.audiolet.scheduler.addRelative(difference + 
	    		this.notes[i].beat, this.playNote.bind(this, this.notes[i]));
	}
}

TrackBuilder.prototype.playNote = function(note) {
    var note = new this.instrument(this.audiolet, note.frequency, note.duration);
    note.connect(this.audiolet.output);
}

/**
 * Get the index where the Beat should be
 */
TrackBuilder.prototype.getBeatIndex = function(beat) {
	for (var i = 0; i < this.notes.length; i++) {
		
	}
}

var Note = function(frequency, beat, duration) {
    this.frequency = frequency;
    this.beat = beat;
    this.duration = duration;    
}

Note.prototype.toString = function() {
    return "frequency:" + this.frequency + " beat: " + this.beat + " duration: " + this.duration; 
}

var Song = function() {
	this.tempo = 100;
	this.tracks = [];
}

Song.prototype.play = function() {
	for (var i = 0; i < this.tracks.length; i++) {
		//add i guess
	}
}


var Synth1 = function(audiolet, frequency, duration) {
    AudioletGroup.apply(this, [audiolet, 0, 1]);
    // Basic wave
    var attack = 0.01;
    var release = 0.5 * duration;
    console.log(release);
    this.sine = new Sine(audiolet, frequency);
    
    // Gain envelope
    this.gain = new Gain(audiolet);
    this.env = new PercussiveEnvelope(audiolet, 1, 0.01, release,
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