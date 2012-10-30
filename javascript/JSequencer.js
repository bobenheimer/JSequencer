

var TrackBuilder = function() {
    this.audiolet = new Audiolet();
    this.durationPattern = [];
    this.frequencyPattern = [];
    this.beatPattern = [];
    this.currentPosition = 0;//current pointer position
    this.lastBeat = 0; //last beat of the last note so far (=map + durationpattern   
}


/**
 * []
 * [1]
 * [1, 2] 
 * 
 * 
 * case 1: beatNumber is the next beat (beatNumber = lastbeat)
 * case 2: beatNumber is past the next beat (beatNumber > lastbeat)
 * case 3: beatNumber is somewhere in between and doesnt overlap
 *  a. beatNumber is right after another beat somewhere and right before
 *  b. beatNumber is not right after another beat but is right before another
 *  c. beatNumber is right after anther beat somewhere but not right before the next
 *  d. beatNumber does not touch either
 * case 4: beatNumber is somewhere in  between and does overlap another note (throw exception for now)
 */

/**
 * Add a single note to the track
 * @param frequency
 * @param beatNumber
 * @param noteLength
 */
TrackBuilder.prototype.addNote = function(frequency, beatNumber, noteLength) {
    var beatDiff = beatNumber - this.lastBeat;
    if (beatDiff == 0) {
        this.update(frequency, beatNumber, noteLength, this.durationPattern.length, true, true);
    }
    else if (beatDiff > 0) {
        this.update(0, beatNumber, beatDiff, this.durationPattern.length, true, true);
        this.update(frequency, beatNumber, noteLength, this.durationPattern.length, true, true);   
    }
    else {
        var beatIndex = this.beatPattern.indexOf(beatNumber);
        if (beatIndex == false) {
            //I'LL DO THIS SHIT LATER
        }
        else { //check if the note placement is empty
            var leftOverRest = this.durationPattern[beatIndex] - noteLength;  
            if (this.frequencyPattern[beatIndex] == 0) {
                if (leftOverRest == 0) {
                    this.update(frequency, beatNumber, noteLength, beatIndex, false, false);
                }
                
            }
        }

    }
}

TrackBuilder.prototype.update = function(frequency, beatNumber, noteLength, index, updateBeatPattern, updateLastBeat) {
    if (updateBeatPattern) {
        if (this.beatPattern.length > 0) {
            this.beatPattern[index] = this.beatPattern[index - 1] + this.durationPattern[index - 1];            
        }
        else {
            this.beatPattern[0] = 0;            
        }
    } 
    this.durationPattern[index] = noteLength;
    this.frequencyPattern[index] = frequency;
    if (updateLastBeat) {
        this.lastBeat += noteLength;
    }

}

TrackBuilder.prototype.changeTempo = function(newTempo) {
    this.audiolet.scheduler.setTempo(newTempo);
}

/**
 * Remove note given ???
 */
TrackBuilder.prototype.removeNote = function() {
    
}

/**
 * Play the song
 */
TrackBuilder.prototype.play = function() {
    this.playHighSynth();
}


TrackBuilder.prototype.playHighSynth = function() {
    this.highSynth = new HighSynth(this.audiolet);
    this.highSynth.connect(this.audiolet.output);
    var durationPattern = new PSequence(this.durationPattern, 1);
    var frequencyPattern = new PSequence(this.frequencyPattern, 1);
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

