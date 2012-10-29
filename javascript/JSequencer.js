var Poo = function() {
    this.audiolet = new Audiolet();
    this.durationPattern = [1];
    this.frequencyPattern = [440];
    this.currentPosition = 0;//current pointer position
    this.lastBeat = 0; //last beat of the last note so far (=map + durationpattern 
    
    
}

/**
 * Add a single note to the track
 * @param frequency
 * @param beatNumber
 * @param noteLength
 */
Poo.prototype.addNote = function(frequency, beatNumber, noteLength) {
    
}

Poo.prototype.changeTempo = function(newTempo) {
    this.audiolet.scheduler.setTempo(newTempo);
}

/**
 * Remove note given ???
 */
Poo.prototype.removeNote = function() {
    
}

/**
 * Play the song
 */
Poo.prototype.play = function() {
    this.playHighSynth();
}


Poo.prototype.playHighSynth = function() {
    this.highSynth = new HighSynth(this.audiolet);
    this.highSynth.connect(this.audiolet.output);
    var durationPattern = new PSequence([this.durationPattern], 1);
    var frequencyPattern = new PSequence([this.frequencyPattern], 1);
    this.audiolet.scheduler.play([frequencyPattern], durationPattern,
        function(frequency) {
            this.highSynth.trigger.trigger.setValue(1);
            this.highSynth.triangle.frequency.setValue(frequency);
        }.bind(this)
    );
}

var HighSynth = function(audiolet, frequency) {
    AudioletGroup.call(this, audiolet, 0, 1);

    // Triangle base oscillator
    this.triangle = new Triangle(audiolet, frequency);

    // Note on trigger
    this.trigger = new TriggerControl(audiolet);

    // Gain envelope
    this.gainEnv = new PercussiveEnvelope(audiolet, 0, 0.1, 0.15);
    this.gainEnvMulAdd = new MulAdd(audiolet, 0.1);
    this.gain = new Gain(audiolet);

    // Feedback delay
    this.delay = new Delay(audiolet, 0.1, 0.1);
    this.feedbackLimiter = new Gain(audiolet, 0.5);

    // Stereo panner
    this.pan = new Pan(audiolet);
    this.panLFO = new Sine(audiolet, 1 / 8);

    // Connect oscillator
    this.triangle.connect(this.gain);

    // Connect trigger and envelope
    this.trigger.connect(this.gainEnv);
    this.gainEnv.connect(this.gainEnvMulAdd);
    this.gainEnvMulAdd.connect(this.gain, 0, 1);
    this.gain.connect(this.delay);

    // Connect delay
    this.delay.connect(this.feedbackLimiter);
    this.feedbackLimiter.connect(this.delay);
    this.gain.connect(this.pan);
    this.delay.connect(this.pan);

    // Connect panner
    this.panLFO.connect(this.pan, 0, 1);
    this.pan.connect(this.outputs[0]);
}
extend(HighSynth, AudioletGroup);

poo = new Poo();
poo.play();