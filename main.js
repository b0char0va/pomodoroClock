var alarm = document.getElementById('alarm');
var breakLength; //number of seconds for break session
var sessionLength; //number of seconds for work session
var StartTime; //when session was started
var secondsLeft = 0;
var isPaused = true;
var isBreak = false;

$(document).ready(function () {
    $('#minus1').click(function () {
        reduceBreakTime();
    });
    $('#minus2').click(function () {
        reduceSessionTime();
    });
    $('#plus1').click(function () {
        addBreakTime();
    });
    $('#plus2').click(function () {
        addSessionTime();
    });
    $('.circle').click(function () {
        if (isPaused) {
            isPaused = false;
            $('button').prop('disabled', true);
            if (secondsLeft > 0) {
                var duration;
                if (isBreak) {
                    duration = breakLength;
                } else {
                    duration = sessionLength;
                }
                //now = 2018-03-24 12:00:00                 1521892800
                //now - 5 seconds = 2018-03-24 11:59:55     1521892795
                startTimer(Date.now() - (duration - secondsLeft) * 1000);
            } else {
                startTimer(Date.now());
            }
        } else {
            isPaused = true;
            if (isBreak) {
                $('#minus2').prop('disabled', true);
                $('#plus2').prop('disabled', true);
                $('#minus1').prop('disabled', false);
                $('#plus1').prop('disabled', false);
            } else {
                $('#minus1').prop('disabled', true);
                $('#plus1').prop('disabled', true);
                $('#minus2').prop('disabled', false);
                $('#plus2').prop('disabled', false);

            }
            clearInterval(sessionIntervalId);
        }
    });
});

function reduceBreakTime() {
    breakLength = parseInt($('#breakTime').text());
    secondsLeft = 0;
    if (breakLength > 1) {
        $('#breakTime').text(breakLength - 1);
    }
}

function reduceSessionTime() {
    sessionLength = parseInt($('#sessionTime').text());
    secondsLeft = 0;
    if (sessionLength > 1) {
        $('#sessionTime').html(sessionLength - 1);
    }
}

function addBreakTime() {
    breakLength = parseInt($('#breakTime').text());
    secondsLeft = 0;
    if (breakLength >= 1) {
        $('#breakTime').html(breakLength + 1);
    }
}

function addSessionTime() {
    sessionLength = parseInt($('#sessionTime').text());
    secondsLeft = 0;
    if (sessionLength >= 1) {
        $('#sessionTime').html(sessionLength + 1);
    }
}

function printTimer() {
    var hours, minutes, seconds, duration;
    var display = document.querySelector("#circleTime");
    breakLength = parseInt($('#breakTime').text()) * 60;
    sessionLength = parseInt($('#sessionTime').text()) * 60;
    if (isBreak) {
        duration = breakLength;
    } else {
        duration = sessionLength;
    }
    secondsLeft = duration - (((Date.now() - StartTime) / 1000) | 0);
    hours = (secondsLeft / 3600) | 0;
    minutes = (secondsLeft / 60) % 60 | 0;
    seconds = (secondsLeft % 60) | 0;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = hours + ":" + minutes + ":" + seconds;
    var timePassedPercent = (duration - secondsLeft) / duration;
    $('.circle span').css('transform', 'scaleY(' + timePassedPercent + ')');

    if (secondsLeft <= 0) {
        clearInterval(sessionIntervalId);
        alarm.play();
        if (isBreak === false) {
            isBreak = true;
            $('#title').text("Break");
            startTimer(Date.now());
        } else {
            isBreak = false;
            $('#title').text("Session");
            startTimer(Date.now());
        }
    }
}

function startTimer(time) {
    StartTime = time;
    sessionIntervalId = setInterval(printTimer, 1000);
}