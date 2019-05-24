import React, { Component } from 'react';
import './App.css';
import accurateInterval from './timer';

class Container extends Component {
  render() {
    return (
      <div>
        <div id={this.props.titleId}>{this.props.title}</div>
        <button id={this.props.decrementId} value="-" onClick={this.props.onClick}> - </button>
        <div id={this.props.lengthId}>{this.props.length}</div>
        <button id={this.props.incrementId} value="+" onClick={this.props.onClick}> + </button>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timerState: "stopped",
      timer: 1500,
      intervalID: ""
    };
  }

  setBreakLength = (e) => {
    let currentLength = this.state.breakLength;
    if (this.state.timerState === "running") return;
    if (this.state.timerLabel === "Session") {
      if (e.currentTarget.value === "-" && currentLength !== 1) {
        this.setState({ breakLength: currentLength - 1 });
      } else if (e.currentTarget.value === "+" && currentLength !== 60) {
        this.setState({ breakLength: currentLength + 1 });
      }
    } else {
      if (e.currentTarget.value === "-" && currentLength !== 1) {
        this.setState({ 
          breakLength: currentLength - 1,
          timer: (currentLength * 60) - 60
        });
      } else if (e.currentTarget.value === "+" && currentLength !== 60) {
        this.setState({ 
          breakLength: currentLength + 1,
          timer: (currentLength * 60) + 60
        });
      }
    }
  }

  setSessionLength = (e) => {
    let currentLength = this.state.sessionLength;
    if (this.state.timerState === "running") return;
    if (this.state.timerLabel === "Break") {
      if (e.currentTarget.value === "-" && currentLength !== 1) {
        this.setState({ sessionLength: currentLength - 1 });
      } else if (e.currentTarget.value === "+" && currentLength !== 60) {
        this.setState({ sessionLength: currentLength + 1 });
      }
    } else {
      if (e.currentTarget.value === "-" && currentLength !== 1) {
        this.setState({ 
          sessionLength: currentLength - 1,
          timer: (currentLength * 60) - 60
        });
      } else if (e.currentTarget.value === "+" && currentLength !== 60) {
        this.setState({ 
          sessionLength: currentLength + 1,
          timer: (currentLength * 60) + 60 
        });
      }
    }
  }

  timerDisplay = () => {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - (minutes * 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  timerControl = () => {
    let control = this.state.timerState;
    return control === "stopped" ? (
      this.beginCountdown(),
      this.setState({timerState: "running"})
    ) : (
      this.setState({timerState: "stopped"}),
      this.state.intervalID && this.state.intervalID.cancel()
    );
  }

  beginCountdown = () => {
    this.setState({
      intervalID: accurateInterval( () => {
        this.timerCountdown();
        this.phaseControl();
      }, 1000)
    });
  }

  timerCountdown = () => {
    this.setState({timer: this.state.timer - 1});
  }
      
  switchTimer = (timeLeft, label) => {
    this.setState({
      timer: timeLeft,
      timerLabel: label
    });
  }

  phaseControl = () => {
    let timer = this.state.timer;
    this.buzzer(timer);
    if (timer < 0) {
      return this.state.timerLabel === "Session" ? (
        this.state.intervalID && this.state.intervalID.cancel(),
        this.beginCountdown(),
        this.switchTimer(this.state.breakLength * 60, "Break")
        ) : (
        this.state.intervalID && this.state.intervalID.cancel(),
        this.beginCountdown(),
        this.switchTimer(this.state.sessionLength * 60, "Session")
        );
      }
  }

  buzzer = (timer) => {
    if (timer === 0) {
      this.audioBeep.play();
    }
  }
  
  reset = () => {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timerState: "stopped",
      timer: 1500,
      intervalID: ""
    });
    this.state.intervalID && this.state.intervalID.cancel();
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
      
  render() {
    return (
      <React.Fragment>
      <div className="App">
        <h1>Pomodoro Clock</h1>
        <Container
          titleId="break-label"
          lengthId="break-length"
          title="Break Length"
          decrementId="break-decrement"
          incrementId="break-increment"
          length={this.state.breakLength}
          onClick={this.setBreakLength}
        /><br/>
        
        <Container
          titleId="session-label"
          lengthId="session-length"
          title="Session Length"
          decrementId="session-decrement"
          incrementId="session-increment"
          length={this.state.sessionLength}
          onClick={this.setSessionLength}
        /><br/>
        
        <div id="timer-label">
          {this.state.timerLabel}
        </div>
        <div id="time-left">
          <h1>{this.timerDisplay()}</h1>
        </div>
        <button id="start_stop" onClick={this.timerControl}> start/stop </button>
        <button id="reset" onClick={this.reset}> reset </button>
      </div>

      <audio 
        id="beep"
        preload="auto" 
        src="https://goo.gl/65cBl1"
        ref={ (audio) => {this.audioBeep = audio;} } 
      />

    </React.Fragment>
    );
  }
}

export default App;
