window.onload = function(){

  $('#modal').modal('show');

  const createButton = document.getElementById('createButton');

  let iterator = 0;
  // Clocks is an object that contains an object for each div to house the methods associated with displaying clock faces
  let clocks = [];

  const elementCreator = function(object){
    let element = document.createElement(object.tag);
    if (object.classes){
      for (let i = 0; i < object.classes.length; i++) {
        element.classList.add(object.classes[i]);
      };
    }
    for (key in object.attributes) {
      element.setAttribute(key, object.attributes[key])
    }
    if (object.innerHTML != null) {
      element.innerHTML = object.innerHTML;
    }
    return element;
  };

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
      // Ticks are the number of milliseconds in one second of the unit of time
      ticks: Math.floor(86400000 / (formDivisions * formHours * formMinutes * formSeconds)),
      clockVar: '',
      clockTime: '',
      calculateTime: function(){
        let offset = new Date;
        offset = offset.getTimezoneOffset();
        let milliseconds = Date.now() % 86400000;
        // Adjust the milliseconds based on the timezone offset from GMT
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
        this.clockSeconds = ('000' + this.clockSeconds).slice(0 - this.maxSeconds.length);
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
          // Every "second", calculate the time of day and render it on the clock div
          this.calculateTime();
          this.renderClock();
        },this.ticks);
        this.calculateTime();
      },
      stopTime: function(){
        clearInterval(this.clockVar);
      },
      renderClock: function(){
        let display = document.getElementById('clockText ' + this.id);
        display.innerHTML = this.clockTime;
      },

      stopwatchVar: '',
      stopwatchTime: '',
      stopwatchCountUp: function(){
        // Each "second," the stopwatch needs to add a second, roll over minutes/hours, and render
        this.stopwatchSeconds ++;
        if (this.stopwatchSeconds === this.seconds) {
          this.stopwatchMinutes ++;
          this.stopwatchSeconds =0;
        };
        if (this.stopwatchMinutes === this.minutes) {
          this.stopwatchHours ++;
          this.stopwatchMinutes = 0;
        };
        // For display purposes, put zeroes in front of any digits that aren't long enough to fill the spaces in the maxSeconds
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
      },
      resetStopwatch: function(){
        clearInterval(this.stopwatchVar);
        let display = document.getElementById('stopwatchText ' + this.id);
        display.innerHTML = "0:" + '0000'.slice(0 - this.maxMinutes.length) + ":" + '0000'.slice(0 - this.maxSeconds.length);
      },

      countdownVar: '',
      countdownTime: '',
      calculateCountdown: function(){
        // Since the countdown renders the time at the "beginning" of a second, define the countdown time before calculating the time at the next second
        this.countdownTime = this.countdownHours + ":" + ('000' + this.countdownMinutes).slice(0 - this.maxMinutes.length) + ":" + ('000' + this.countdownSeconds).slice(0 - this.maxSeconds.length);
        this.countdownSeconds --;
        // If the seconds or minutes are at zero, roll them down to the maxSeconds/Minutes
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
        // Get the hours, miutes, and seconds from the selects on the countdown div
        let hours = document.getElementById('countdownHourSelect ' + id);
        this.countdownHours = parseInt(hours.options[hours.selectedIndex].value);
        let minutes = document.getElementById('countdownMinuteSelect ' + id);
        this.countdownMinutes = parseInt(minutes.options[minutes.selectedIndex].value);
        let seconds = document.getElementById('countdownSecondSelect ' + id);
        this.countdownSeconds = parseInt(seconds.options[seconds.selectedIndex].value);
        // Display the initial time and render the initial time
        this.calculateCountdown();
        this.renderCountdown();
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
      }
    };
    return newClock;
  };

  let createStopwatch = function(id){
    // Div for the stopwatch
    let stopwatchDiv = elementCreator({
      tag: 'div',
      classes: ['stopwatch', 'face'],
      attributes: {
        id: 'stopwatch ' + id
      }
    });
    // Text for stopwatch
    let stopText = elementCreator({
      tag: 'p',
      innerHTML: "Stopwatch",
      classes: ['timeText'],
      attributes: {
        id: 'stopwatchText ' + id
      }
    })
    stopwatchDiv.append(stopText);
    // "Start" button for the stopwatch
    let stopStartButton = elementCreator({
      tag: 'button',
      innerHTML: "Start",
      classes: ['btn'],
      attributes: {
        id: 'stopwatchStart ' + id,
        value: id
      }
    });
    stopStartButton.addEventListener('click', function(){
      clocks[id].startStopwatch();
    });
    stopwatchDiv.append(stopStartButton);
    // "Stop" button for the stopwatch
    let stopStopButton = elementCreator({
      tag: 'button',
      innerHTML: "Stop",
      classes: ['btn'],
      attributes: {
        id: 'stopwatchStop ' + id,
        value: id
      }
    })
    stopStopButton.addEventListener('click', function(){
      clocks[id].stopStopwatch();
    })
    stopwatchDiv.append(stopStopButton)
    // "Reset" button for the stopwatch
    let stopResetButton = elementCreator({
      tag: 'button',
      innerHTML: "Reset",
      classes: ['btn'],
      attributes: {
        id: 'stopwatchReset ' + id,
        value: id
      }
    });
    stopResetButton.addEventListener('click', function(){
      clocks[id].resetStopwatch();
    })
    stopwatchDiv.append(stopResetButton);
    // Button to toggle back to clock
    let stopHideButton = elementCreator({
      tag: 'button',
      innerHTML: "Back to Clock",
      classes: ['btn'],
      attributes: {
        id: 'stopwatchHideButton ' + id,
        value: id
      }
    });
    stopHideButton.addEventListener('click', function(){
      changeFace('show-stopwatch','show-clock', id)
    });
    stopwatchDiv.append(stopHideButton);
    return stopwatchDiv;
  };

  let changeFace = function(remove, add, id){
    let clockBox = document.getElementById(id);
    clockBox.classList.remove(remove);
    clockBox.classList.add(add);
  };

  let createClockTime = function(id){
    let clockTimeDiv = elementCreator({
      tag: 'div',
      classes: ['clock', 'face']
    });
    // Text to display the readout of the clock
    let clockText = elementCreator({
      tag: 'p',
      innerHTML: "Clock Time",
      classes: ['timeText'],
      attributes: {
        id: 'clockText ' + id
      }
    });
    clockTimeDiv.append(clockText);
    // Button to toggle to stopwatch
    let clockUpButton = elementCreator({
      tag: 'button',
      innerHTML: "Stopwatch",
      classes: ['btn'],
      attributes: {
        id: 'clockUpButton ' + id,
        value: id
      }
    });
    clockUpButton.addEventListener('click', function(){
      clocks[id].stopwatchTime = "0:" + ('0000').slice(0 - clocks[id].maxMinutes.length) + ":" + ('0000').slice(0 - clocks[id].maxSeconds.length);
      clocks[id].renderStopwatch();
      changeFace('show-clock','show-stopwatch', id)
    });
    clockTimeDiv.append(clockUpButton);
    // Button to toggle to the timer
    let clockDownButton = elementCreator({
      tag: 'button',
      innerHTML: "Timer",
      classes: ['btn'],
      attributes: {
        id: 'clockDownButton ' + id,
        value: id
      }
    });
    clockDownButton.addEventListener('click', function(){
      clocks[id].countdownTime = "0:" + ('0000').slice(0 - clocks[id].maxMinutes.length) + ":" + ('0000').slice(0 - clocks[id].maxSeconds.length);
      clocks[id].renderCountdown();
      changeFace('show-clock','show-countdown', id)
    });
    clockTimeDiv.append(clockDownButton);
    // Button to remove the clock from the DOM entirely
    let removeButton = elementCreator({
      tag: 'button',
      innerHTML: "Remove Clock",
      classes: ['btn'],
      attributes: {
        id: 'removeButton ' + id,
        value: id
      }
    });
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
    let countdownDiv = elementCreator({
      tag: 'div',
      classes: ['countdown', 'face']
    });
    let countdownText = elementCreator({
      tag: 'p',
      innerHTML: "Countdown",
      classes: ['timeText'],
      attributes: {
        id: 'countdownText ' + id
      }
    });
    countdownDiv.append(countdownText);
    let selectorDiv = elementCreator({
      tag: 'div',
      classes: ['countdownSelectors']
    })
    let hourSelect = elementCreator({
      tag: 'select',
      classes: ['select', 'form-control-lg'],
      attributes: {
        id: 'countdownHourSelect ' + id
      }
    });
    for (let i = 0; i < clocks[id].hours * clocks[id].divisions; i++) {
      let option = elementCreator({
        tag: 'option',
        innerHTML: i,
        attributes: {
          value: i
        }
      });
      hourSelect.append(option);
    }
    selectorDiv.append(hourSelect);
    let minuteSelect = elementCreator({
      tag: 'select',
      classes: ['select', 'form-control-lg'],
      attributes: {
        id: 'countdownMinuteSelect ' + id
      }
    });
    for (let i = 0; i < clocks[id].minutes; i++) {
      let option = elementCreator({
        tag: 'option',
        innerHTML: i,
        attributes: {
          value: i
        }
      })
      minuteSelect.append(option);
    }
    selectorDiv.append(minuteSelect)
    let secondSelect = elementCreator({
      tag: 'select',
      classes: ['select', 'form-control-lg'],
      attributes: {
        id: 'countdownSecondSelect ' + id
      }
    })
    for (let i = 0; i < clocks[id].seconds; i++) {
      let option = elementCreator({
        tag: 'option',
        innerHTML: i,
        attributes: {
          value: i
        }
      })
      secondSelect.append(option);
    }
    selectorDiv.append(secondSelect);
    let startCountdownButton = elementCreator({
      tag: 'button',
      innerHTML: "Start",
      classes: ['btn'],
      attributes: {
        id: 'countdownStart ' + id,
        value: id
      }
    });
    countdownDiv.append(selectorDiv);
    startCountdownButton.addEventListener('click', function(){
      clocks[id].startCountdown();
    })
    countdownDiv.append(startCountdownButton);
    let stopCountdownButton = elementCreator({
      tag: 'button',
      innerHTML: "Stop",
      classes: ['btn'],
      attributes: {
        id: 'countdownStop ' + id,
        value: id
      }
    })
    stopCountdownButton.addEventListener('click', function(){
      clocks[id].stopCountdown();
    });
    countdownDiv.append(stopCountdownButton);
    let stopShowClock = elementCreator({
      tag: 'button',
      innerHTML: "Back to Clock",
      classes: ['btn'],
      attributes: {
        id: 'stopwatchHide ' + id,
        value: id
      }
    })
    stopShowClock.addEventListener('click', function(){
      changeFace('show-countdown','show-clock', id)
    });
    countdownDiv.append(stopShowClock);
    return countdownDiv;
  };

  let createTimerBox = function(count){
        // Div for a new time unit
  let newDiv = elementCreator({
          tag: 'div',
          classes: ['clockBox', 'show-clock'],
          attributes: {
            id: count
          }
        })
        // Div for a new entry form
        let entryForm = elementCreator({
          tag: 'div',
          classes: ['entryForm'],
          attributes: {
            id: 'entryForm ' + count
          }
        });
        // Time units form
        let form = elementCreator({
          tag: 'form',
          attributes: {
            id: 'form ' + count
          }
        })
        let divisionsGroup = elementCreator({
          tag: 'div',
          classes: ['form-group']
        })
        let divisionsLabel = elementCreator({
          tag: 'label',
          innerHTML: "Divsions",
          attributes: {
            for: 'divisions ' + count
          }
        })
        let divisions = elementCreator({
          tag: 'select',
          classes: ['form-control' , 'form-control-lg'],
          attributes: {
            id: 'divisions ' + count
          }
        })
        for (let i = 1; i <= 4; i++) {
          let option = elementCreator({
            tag: 'option',
            innerHTML: i,
            attributes: {
              value: i
            }
          })
          divisions.append(option);
        }
        divisionsGroup.append(divisionsLabel);
        divisionsGroup.append(divisions);
        form.append(divisionsGroup);
        let hoursGroup = elementCreator({
          tag: 'div',
          classes: ['form-group']
        });
        let hoursLabel = elementCreator({
          tag: 'label',
          innerHTML: "Hours",
          attributes: {
            for: 'hours ' + count
          }
        });
        let hours = elementCreator({
          tag: 'select',
          classes: ['form-control', 'form-control-lg'],
          attributes: {
            id: 'hours ' + count
          }
        })
        for (let i = 1; i <= 72; i++) {
          let option = elementCreator({
            tag: 'option',
            innerHTML: i,
            attributes: {
              value: i
            }
          })
          hours.append(option);
        }
        hoursGroup.append(hoursLabel);
        hoursGroup.append(hours);
        form.append(hoursGroup);
        let minutesGroup = elementCreator({
          tag: 'div',
          classes: ['form-group']
        });
        let minutesLabel = elementCreator({
          tag: 'label',
          innerHTML: "Minutes",
          attributes: {
            for: 'minutes ' + count
          }
        });
        let minutes = elementCreator({
          tag: 'select',
          classes: ['form-control', 'form-control-lg'],
          attributes: {
            id: 'minutes ' + count
          }
        });
        for (let i = 1; i <= 300; i++) {
          let option = elementCreator({
            tag: 'option',
            innerHTML: i,
            attributes: {
              value: i
            }
          })
          minutes.append(option);
        }
        minutesGroup.append(minutesLabel);
        minutesGroup.append(minutes);
        form.append(minutesGroup);
        let secondsGroup = elementCreator({
          tag: 'div',
          classes: ['form-group']
        })
        let secondsLabel = elementCreator({
          tag: 'label',
          innerHTML: "Seconds",
          attributes: {
            for: 'seconds ' + count
          }
        })
        let seconds = elementCreator({
          tag: 'select',
          classes: ['form-control', 'form-control-lg'],
          attributes: {
            id: 'seconds ' + count
          }
        })
        for (let i = 1; i <= 1000; i++) {
          let option = elementCreator({
            tag: 'option',
            innerHTML: i,
            attributes: {
              value: i
            }
          })
          seconds.append(option);
        }
        secondsGroup.append(secondsLabel);
        secondsGroup.append(seconds);
        form.append(secondsGroup);
        // Start button and data collection
        let button = elementCreator({
          tag: 'button',
          innerHTML: "Start Clock",
          classes: ['btn', 'startButton'],
          attributes: {
            value: count
          }
        })
        button.addEventListener('click', function(e){
          let id = e.target.value;
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
        });
        form.append(button);
        entryForm.append(form);
        let newBox = elementCreator({
          tag: 'div',
          classes: ['box', 'card']
        });
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
