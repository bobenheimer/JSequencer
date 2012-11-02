var Synth1 = function(audiolet, frequency, duration, volume) {
    AudioletGroup.apply(this, [audiolet, 0, 1]);
    // Basic wave
    var attack = 0.01;
    var release = 0.5 * duration;
    this.sine = new Sine(audiolet, frequency);
    
    // Gain envelope
    this.gain = new Gain(audiolet, 4);
    this.env = new PercussiveEnvelope(audiolet, 1, 0.01, release,
        function() {
            audiolet.scheduler.addRelative(0, this.remove.bind(this));
        }.bind(this)
    );
    this.envMulAdd = new MulAdd(audiolet, 0.2 * volume, 0);

    // Main signal path
    this.sine.connect(this.gain);
    this.gain.connect(this.outputs[0]);

    // Envelope
    this.env.connect(this.envMulAdd);
    this.envMulAdd.connect(this.gain, 0, 1);
}
extend(Synth1, AudioletGroup);

var Synth2 = function(audiolet, frequency, duration, volume) {
    AudioletGroup.apply(this, [audiolet, 0, 1]);
    
    var release = 0.5 * duration;
    // Basic wave
    this.sine = new Saw(audiolet, frequency);
    
    this.filter = new DampedCombFilter(audiolet, 0.06, 0.02, 0.04, 0.2);
    
    //this.filter = new Reverb(audiolet, 1.5, 0.5, 0.8);
    
    // Gain envelope
    this.gain = new Gain(audiolet, 0.1);
    this.env = new PercussiveEnvelope(audiolet, 0.01, 0.05, release,
      function() {
        this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
      }.bind(this)
    );
    
    this.envMulAdd = new MulAdd(audiolet, 0.1 * volume, 0);

    // Main signal path
    //this.sine.connect(this.gain);
    this.sine.connect(this.filter);
    this.filter.connect(this.gain);    
    this.gain.connect(this.outputs[0]);

    // Envelope
    this.env.connect(this.envMulAdd);
    this.envMulAdd.connect(this.gain, 0, 1);
}
extend(Synth2, AudioletGroup);

var Synth3 = function(audiolet, frequency, duration, volume) {
    AudioletGroup.apply(this, [audiolet, 0, 1]);
    // Basic wave
    this.white = new WhiteNoise(audiolet);        
    this.filter = new BandPassFilter(audiolet, frequency);
    
    this.sine = new Sine(audiolet, frequency);
    this.clip = new SoftClip(audiolet);
    
    this.gain = new Gain(audiolet);
    
    this.env = new PercussiveEnvelope(audiolet, 0.01, 0.01, 0.1,
      function() {
        this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
      }.bind(this)
    );
    this.envMulAdd = new MulAdd(audiolet, 0.5 * volume, 0);
    
    this.sine_filteredwhite_MulAdd = new MulAdd(audiolet, 0.5, 0);
       
    //Main signal path
    this.white.connect(this.filter);
    this.sine.connect(this.sine_filteredwhite_MulAdd);
    this.sine_filteredwhite_MulAdd.connect(this.filter);
       
    // Envelope    
    this.filter.connect(this.gain);
    
    this.env.connect(this.envMulAdd);
    this.envMulAdd.connect(this.gain, 0, 1);
    this.gain.connect(this.outputs[0]);
}
extend(Synth3, AudioletGroup);