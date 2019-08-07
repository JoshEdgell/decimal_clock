window.onload = function(){

  $('#modal').modal('show');

  const cotainer = document.getElementById('container');
  // let createButton = $("#create");
  const createButton = document.getElementById('createButton');
  let iterator = 0;
  // Clocks is an object that contains an object for each div to house the methods associated with displaying clock faces
  let clocks = [];

  // Data-Management Functions
  let defineClock = function(id){
    let formDivisions = document.getElementById('divisions ' + id).value;
    let formHours = document.getElementById('hours ' + id).value;
    let formMinutes = document.getElementById('minutes ' + id).value;
    let formSeconds = document.getElementById('seconds ' + id).value
    let newClock = {
      id: id,
      divisions: parseInt(formDivisions),
      hours: parseInt(formHours),
      minutes: parseInt(formMinutes),
      maxMinutes: parseInt(formMinutes) - 1,
      seconds: parseInt(formSeconds),
      maxSeconds: parseInt(formSeconds) - 1,
      ticks: Math.floor(86400000 / (formDivisions * formHours * formMinutes * formSeconds)),
      clockVar: '',
      clockTime: '',
      calculateTime: function(){
        let offset = new Date;
        offset = offset.getTimezoneOffset();
        let milliseconds = Date.now() % 86400000;
        milliseconds -= (offset * 60000);
        if (milliseconds < 0) {
          milliseconds += 86400000;
        }
        this.clockSeconds = Math.floor(milliseconds / this.ticks);
        this.clockMinutes = Math.floor(this.clockSeconds / this.seconds);
        this.clockHours = Math.floor(this.clockMinutes / this.minutes);
        this.maxSeconds = this.maxSeconds.toString();
        this.maxMinutes = this.maxMinutes.toString();
        this.clockSeconds %= this.seconds;
        this.clockSeconds = ('000' + this.clockSeconds).slice(0 - this.maxSeconds.length)
        this.clockMinutes %= this.minutes;
        this.clockMinutes = ('000' + this.clockMinutes).slice(0 - this.maxMinutes.length);
        this.clockHours %= this.hours;

        if (this.clockHours === 0) {
          this.clockHours = this.hours
        }
        this.clockTime = this.clockHours + ":" + this.clockMinutes + ":" + this.clockSeconds;
      },
      startTime: function(){
        this.clockVar = setInterval(()=>{
          this.calculateTime();
          this.renderClock();
        },this.ticks);
        this.calculateTime();
      },
      stopTime: function(){
        clearInterval(this.clockVar);
        console.log("time stopped");
      },
      renderClock: function(){
        let display = document.getElementById('clockText ' + this.id);
        display.innerHTML = this.clockTime;
      },

      stopwatchVar: '',
      stopwatchTime: '',
      stopwatchCountUp: function(){
        this.stopwatchSeconds ++;
        if (this.stopwatchSeconds === this.seconds) {
          this.stopwatchMinutes ++;
          this.stopwatchSeconds =0;
        }
        if (this.stopwatchMinutes === this.minutes) {
          this.stopwatchHours ++;
          this.stopwatchMinutes = 0;
        }
        this.stopwatchDisplaySeconds = ('000' + this.stopwatchSeconds).slice(0 - this.maxSeconds.length)
        this.stopwatchDisplayMinutes = ('000' + this.stopwatchMinutes).slice(0 - this.maxMinutes.length);
        this.stopwatchTime = this.stopwatchHours + ":" + this.stopwatchDisplayMinutes + ":" + this.stopwatchDisplaySeconds;
        this.renderStopwatch();
      },
      renderStopwatch: function(){
        let display = document.getElementById('stopwatchText ' + this.id);
        display.innerHTML = this.stopwatchTime;
      },
      startStopwatch: function(){
        this.stopwatchSeconds = 0;
        this.stopwatchMinutes = 0;
        this.stopwatchHours = 0;
        this.stopwatchVar = setInterval(()=>{
          this.stopwatchCountUp();
        },this.ticks);
      },
      stopStopwatch: function(){
        clearInterval(this.stopwatchVar);
        console.log("stopwatch stopped");
      },
      resetStopwatch: function(){
        clearInterval(this.stopwatchVar);
        let display = document.getElementById('stopwatchText ' + this.id);
        display.innerHTML = "0:00:00"
      },

      countdownVar: '',
      countdownTime: '',
      calculateCountdown: function(){
        this.countdownTime = this.countdownHours + ":" + ('000' + this.countdownMinutes).slice(0 - this.maxMinutes.length) + ":" + ('000' + this.countdownSeconds).slice(0 - this.maxSeconds.length);
        this.countdownSeconds --;
        if (this.countdownSeconds < 0) {
          this.countdownMinutes --;
          this.countdownSeconds = this.maxSeconds;
        }
        if (this.countdownMinutes < 0) {
          this.countdownHours --;
          this.countdownMinutes = this.maxMinutes;
        }
      },
      renderCountdown: function(){
        let countdownText = document.getElementById('countdownText ' + id);
        countdownText.innerHTML = this.countdownTime;
      },
      startCountdown: function(){
        // Get the hours, miutes, and seconds
        let hours = document.getElementById('countdownHourSelect ' + id);
        this.countdownHours = parseInt(hours.options[hours.selectedIndex].value);
        let minutes = document.getElementById('countdownMinuteSelect ' + id);
        this.countdownMinutes = parseInt(minutes.options[minutes.selectedIndex].value);
        let seconds = document.getElementById('countdownSecondSelect ' + id);
        this.countdownSeconds = parseInt(seconds.options[seconds.selectedIndex].value);
        // Display the initial time
        this.calculateCountdown();
        this.renderCountdown();
        console.log("rendered before entering timer");
        this.countdownVar = setInterval(()=>{
          // Calculate the countdown time
          this.calculateCountdown();
          // Render the time
          this.renderCountdown();
          // If the countdown reaches "0:00:00", stop the countdown , remove the current face class, and show the countdown face
          if ((this.countdownHours * this.minutes * this.seconds) + (this.countdownMinutes * this.seconds) + this.countdownSeconds < 0) {
            let removeClass = document.getElementById(this.id).classList[1];
            changeFace(removeClass, 'show-countdown', this.id);
            let countdownText = document.getElementById('countdownText ' + this.id);
            countdownText.classList.add('blinking');
            this.stopCountdown();
            setTimeout(()=>{
              countdownText.classList.remove('blinking');
            },3000);
          }
        },this.ticks);
      },
      stopCountdown: function(){
        clearInterval(this.countdownVar);
        console.log("countdown stopped");
      }


    };
    return newClock;
  };

  // DOM Manipulation Functions
  let createStopwatch = function(id){
    let stopwatchDiv = document.createElement('div');
    stopwatchDiv.classList.add('stopwatch', 'face')
    stopwatchDiv.setAttribute('id', 'stopwatch ' + id);

    // Text to display the readout of the stopwatch
    let stopText = document.createElement('p');
    stopText.innerHTML = "Stopwatch";
    stopText.classList.add('timeText');
    stopText.setAttribute('id', 'stopwatchText ' + id);
    stopwatchDiv.append(stopText);

    // "Start" button for the stopwatch
    let stopStartButton = document.createElement('button');
    stopStartButton.setAttribute('id', 'stopwatchStart ' + id);
    // The button's value could be used to identify the id of the clock targeted
    stopStartButton.setAttribute('value', id);
    stopStartButton.classList.add('btn')
    stopStartButton.innerHTML = "Start";
    stopStartButton.addEventListener('click', function(){
      clocks[id].startStopwatch();
    });
    stopwatchDiv.append(stopStartButton);

    // "Stop" button for the stopwatch
    let stopStopButton = document.createElement('button');
    stopStopButton.setAttribute('id', 'stopwatchStop ' + id);
    stopStopButton.classList.add('btn');
    stopStopButton.setAttribute('value', id);
    stopStopButton.innerHTML = "Stop";
    stopStopButton.addEventListener('click', function(){
      clocks[id].stopStopwatch();
    })
    stopwatchDiv.append(stopStopButton)

    // "Reset" button for the stopwatch
    let stopResetButton = document.createElement('button');
    stopResetButton.setAttribute('id', 'stopwatchReset ' + id);
    stopResetButton.classList.add('btn');
    stopResetButton.setAttribute('value', id);
    stopResetButton.innerHTML = "Reset";
    stopResetButton.addEventListener('click', function(){
      clocks[id].resetStopwatch();
    })
    stopwatchDiv.append(stopResetButton);

    // Button to toggle back to clock
    let stopHideButton = document.createElement('button');
    stopHideButton.setAttribute('id', 'stopwatchHideButton ' + id);
    stopHideButton.classList.add('btn');
    // The button's value could be used to identify the id of the clock targeted
    stopHideButton.setAttribute('value', id);
    stopHideButton.innerHTML = "Back to Clock";
    stopHideButton.addEventListener('click', function(){
      changeFace('show-stopwatch','show-clock', id)
    });
    stopwatchDiv.append(stopHideButton);
    return stopwatchDiv;
  };

  let changeFace = function(remove, add, id){
    console.log('removing: ' + remove);
    console.log('adding: ' + add);
    let clockBox = document.getElementById(id);
    clockBox.classList.remove(remove);
    clockBox.classList.add(add);
  };

  let createClockTime = function(id){
    let clockTimeDiv = document.createElement('div')
    clockTimeDiv.classList.add('clock', 'face');
    // Text to display the readout of the clock
    let clockText = document.createElement('p');
    clockText.innerHTML = "Clock Time";
    clockText.classList.add('timeText');
    clockText.setAttribute('id', 'clockText ' + id);
    clockTimeDiv.append(clockText);
    // Button to toggle to stopwatch
    let clockUpButton = document.createElement('button');
    clockUpButton.setAttribute('id', 'clockUpButton ' + id);
    clockUpButton.classList.add('btn');
    clockUpButton.setAttribute('value', id);
    clockUpButton.innerHTML = "Stopwatch";
    clockUpButton.addEventListener('click', function(){
      clocks[id].stopwatchTime = "0:" + ('0000').slice(0 - clocks[id].maxMinutes.length) + ":" + ('0000').slice(0 - clocks[id].maxSeconds.length);
      clocks[id].renderStopwatch();
      changeFace('show-clock','show-stopwatch', id)
    });
    clockTimeDiv.append(clockUpButton);
    // Button to toggle to the timer
    let clockDownButton = document.createElement('button');
    clockDownButton.setAttribute('id', 'clockDownButton ' + id);
    clockDownButton.setAttribute('value', id);
    clockDownButton.classList.add('btn');
    clockDownButton.innerHTML = "Timer";
    clockDownButton.addEventListener('click', function(){



      clocks[id].countdownTime = "0:" + ('0000').slice(0 - clocks[id].maxMinutes.length) + ":" + ('0000').slice(0 - clocks[id].maxSeconds.length);
      clocks[id].renderCountdown();





      changeFace('show-clock','show-countdown', id)
    });


    clockTimeDiv.append(clockDownButton);
    // Button to remove the clock from the DOM entirely
    let removeButton = document.createElement('button');
    removeButton.setAttribute('id', 'removeButton ' + id);
    removeButton.classList.add('btn');
    removeButton.setAttribute('value', id);
    removeButton.innerHTML = "Remove Clock";
    removeButton.addEventListener('click', function(e){
      let id = parseInt(e.target.value);
      clocks[id].stopTime();
      clocks[id].stopStopwatch();
      clocks[id].stopCountdown();
      removeClock(id);
    });
    clockTimeDiv.append(removeButton);
    return clockTimeDiv;
  };

  let createCountdown = function(id){
    let countdownDiv = document.createElement('div');
    countdownDiv.classList.add('countdown', 'face');
    // Text to display the readout of the countdown
    let countdownText = document.createElement('p');
    countdownText.setAttribute('id', 'countdownText ' + id);
    countdownText.classList.add('timeText')
    countdownText.innerHTML = "Countdown";
    countdownDiv.append(countdownText);
    // This is going to end up being a ton of work.  The user will have to be able to set a countdown (probably through a form - the form will have to use number inputs similar to the original form, and will also have to have max and min limits based on the clock's limits) for a given number of hours, minutes, and seconds.  Then, the user will start the countdown, at which point the timer will render the coundown, changing the structure of the div.

    // At some point, most of this is going to have to be in a function of its own.  If the options are going to be removed from the div at some point only to be added later, this will all have to be a function.

    let hourSelect = document.createElement('select');
    hourSelect.setAttribute('id', 'countdownHourSelect ' + id);
    hourSelect.classList.add('select', 'form-control-lg');
    for (let i = 0; i < clocks[id].hours * clocks[id].divisions; i++) {
      let option = document.createElement('option');
      option.innerHTML = i;
      option.setAttribute('value', i);
      hourSelect.append(option);
    }
    countdownDiv.append(hourSelect);
    let minuteSelect = document.createElement('select');
    minuteSelect.setAttribute('id', 'countdownMinuteSelect ' + id);
    minuteSelect.classList.add('select', 'form-control-lg');
    for (let i = 0; i < clocks[id].minutes; i++) {
      let option = document.createElement('option');
      option.innerHTML = i;
      option.setAttribute('value', i);
      minuteSelect.append(option);
    }
    countdownDiv.append(minuteSelect);
    let secondSelect = document.createElement('select');
    secondSelect.setAttribute('id', 'countdownSecondSelect ' + id);
    secondSelect.classList.add('select', 'form-control-lg');
    for (let i = 0; i < clocks[id].seconds; i++) {
      let option = document.createElement('option');
      option.innerHTML = i;
      option.setAttribute('value', i);
      secondSelect.append(option);
    }
    countdownDiv.append(secondSelect);

    let startCountdownButton = document.createElement('button');
    startCountdownButton.setAttribute('id', 'countdownStart ' + id);
    startCountdownButton.setAttribute('value', id);
    startCountdownButton.classList.add('btn');
    startCountdownButton.innerHTML = "Start";
    startCountdownButton.addEventListener('click', function(){
      clocks[id].startCountdown();
    })
    countdownDiv.append(startCountdownButton);

    let stopCountdownButton = document.createElement('button');
    stopCountdownButton.setAttribute('id', 'countdownStop ' + id);
    stopCountdownButton.setAttribute('value', id);
    stopCountdownButton.classList.add('btn');
    stopCountdownButton.innerHTML = "Stop";
    stopCountdownButton.addEventListener('click', function(){
      clocks[id].stopCountdown();
    });
    countdownDiv.append(stopCountdownButton);

    let stopShowClock = document.createElement('button');
    stopShowClock.setAttribute('id', 'stopwatchHide ' + id);
    stopShowClock.setAttribute('value', id);
    stopShowClock.classList.add('btn');
    stopShowClock.innerHTML = "Back to Clock";
    stopShowClock.addEventListener('click', function(){
      changeFace('show-countdown','show-clock', id)
    });
    countdownDiv.append(stopShowClock);


    return countdownDiv;
  };

  let createTimerBox = function(count){

    //entryForm should be appended to ".box" (newBox)
    //clockBox (newDiv) should be appended to ".box" (newBox)

        // Div for a new time unit
        let newDiv = document.createElement('div');
        newDiv.setAttribute('id', count);
        newDiv.classList.add('clockBox', 'show-clock');
        // Div for a new entry form
        let entryForm = document.createElement('div');
        entryForm.setAttribute('id', 'entryForm ' + count);
        entryForm.classList.add('entryForm');

        // Time units form
        let form = document.createElement('form');
        form.setAttribute('id', 'form ' + count);

        // Will these "inputs" work as "selects"?

        let divisionsGroup = document.createElement('div');
        divisionsGroup.classList.add('form-group');
        let divisionsLabel = document.createElement('label');
        divisionsLabel.setAttribute('for', 'divisions ' + count);
        divisionsLabel.innerHTML = "Divisions";
        let divisions = document.createElement('select');
        divisions.setAttribute('id', 'divisions ' + count);
        divisions.classList.add('form-control', 'form-control-lg');
        for (let i = 1; i <= 4; i++) {
          let option = document.createElement('option');
          option.setAttribute('value', i);
          option.innerHTML = i;
          divisions.append(option);
        }
        divisionsGroup.append(divisionsLabel);
        divisionsGroup.append(divisions);

        form.append(divisionsGroup);

        let hoursGroup = document.createElement('div');
        hoursGroup.classList.add('form-group');
        let hoursLabel = document.createElement('label');
        hoursLabel.setAttribute('for', 'hours ' + count);
        hoursLabel.innerHTML = "Hours";
        let hours = document.createElement('select');
        hours.setAttribute('id', 'hours ' + count);
        hours.classList.add('form-control', 'form-control-lg');
        for (let i = 1; i <= 72; i++) {
          let option = document.createElement('option');
          option.setAttribute('value', i);
          option.innerHTML = i;
          hours.append(option);
        }
        hoursGroup.append(hoursLabel);
        hoursGroup.append(hours);

        form.append(hoursGroup);

        let minutesGroup = document.createElement('div');
        minutesGroup.classList.add('form-group');
        let minutesLabel = document.createElement('label');
        minutesLabel.setAttribute('for', 'minutes ' + count);
        minutesLabel.innerHTML = "Minutes";
        let minutes = document.createElement('select');
        minutes.setAttribute('id', 'minutes ' + count);
        minutes.classList.add('form-control', 'form-control-lg');
        for (let i = 1; i <= 300; i++) {
          let option = document.createElement('option');
          option.setAttribute('value', i);
          option.innerHTML = i;
          minutes.append(option);
        }
        minutesGroup.append(minutesLabel);
        minutesGroup.append(minutes);

        form.append(minutesGroup);

        let secondsGroup = document.createElement('div');
        secondsGroup.classList.add('form-group');
        let secondsLabel = document.createElement('label');
        secondsLabel.setAttribute('for', 'seconds ' + count);
        secondsLabel.innerHTML = "Seconds";
        let seconds = document.createElement('select');
        seconds.classList.add('form-control', 'form-control-lg');
        seconds.setAttribute('id', 'seconds ' + count);
        for (let i = 1; i <= 1000; i++) {
          let option = document.createElement('option');
          option.setAttribute('value', i);
          option.innerHTML = i;
          seconds.append(option);
        }

        secondsGroup.append(secondsLabel);
        secondsGroup.append(seconds);
        form.append(secondsGroup);

        // entryForm.append(form);



        // Start button and data collection
        let button = document.createElement('button');
        button.classList.add('btn', 'startButton');
        button.innerHTML = "Start Clock";
        button.setAttribute('value', count);
        button.addEventListener('click', function(e){
          console.log(e);
          // Eventually, there's going to have to be some form validation so the user will have to put in valid options before being allowed to start a clock.
          let id = e.target.value;
          console.log(id);


          // define new clock object
          clocks[id] = defineClock(id);

          // Find the entryForm div and hide it
          let entryForm = document.getElementById('entryForm ' + id);
          entryForm.parentNode.removeChild(entryForm);

          // The clockBox is the parent of all clock display divs. It will contain divs for displaying time, a stopwatch, and a timer
          let clockBox = document.getElementById(id);

          // create stopwatch div and append it to the clockBox
          let stopwatchDiv = createStopwatch(id);
          clockBox.append(stopwatchDiv);

          // create clockTime div and append it to the clockBox
          let clockTimeDiv = createClockTime(id);
          clockBox.append(clockTimeDiv);

          // create countdown div and append it to the clockBox
          let countdownDiv = createCountdown(id);
          clockBox.append(countdownDiv);

          // Start running the time on the clock
          clocks[id].startTime();
          clocks[id].calculateTime();
          clocks[id].renderClock();

        })


        //entryForm should be appended to ".box" (newBox)
        //clockBox (newDiv) should be appended to ".box" (newBox)



        // entryForm.append(button);
        form.append(button);
        entryForm.append(form);

        // newDiv.append(entryForm);

        let newBox = document.createElement('div');
        newBox.classList.add('box', 'card');

        newBox.append(entryForm);

        newBox.append(newDiv);

        container.append(newBox);
      };

  let removeClock = function(id){
    let targetDiv = document.getElementById(id);
    let remove = targetDiv.parentElement;
    targetDiv = targetDiv.parentElement;
    targetDiv.parentNode.removeChild(targetDiv);
  };

  // When the create button is clicked, a div with a form in it will appear, with inputs for divisions, hours, minutes, and seconds
  // Additionally, there will be a button with "Start Clock" on it, to start displaying the current time in the desired increments
  createButton.addEventListener('click', function(){
    createTimerBox(iterator);
    iterator++;
  })
};
