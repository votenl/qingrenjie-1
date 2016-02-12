'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');

var PassDoor = React.createClass({
  getInitialState: function() {
    console.log('getInitialState');
    return {
      taijiClassName: 'taiji',
      doorLeftClassName: 'doorLeft',
      doorRightClassName: 'doorRight',
      firebase: new Firebase("https://amber-inferno-3476.firebaseio.com/")
    };
  },
  componentDidMount: function() {
    console.log('componentDidMount');
  },
  onClick: function() {
    console.log('onClick');
    if (!this.state.isOpened) {
      this.askPass(function() { // 检查口令，成功则回调
        this.state.taijiClassName = 'taiji rotating';
        this.setState(this.state);
        var task = setInterval(function() {

          this.state.taijiClassName = 'hide';
          this.state.doorLeftClassName = 'doorLeft openDoorLeft';
          this.state.doorRightClassName = 'doorRight openDoorRight';
          this.setState(this.state);
          var anim = document.querySelector('.openDoorRight');
          anim.addEventListener('webkitAnimationEnd', function() {
            this.state.doorLeftClassName = 'hide'
            this.state.doorRightClassName = 'hide'
            this.setState(this.state);
          }.bind(this));
          window.clearInterval(task);
        }.bind(this), 8000);
      }.bind(this));
    }
  },
  askPass: function(success) {
    var pass = prompt('确认你是否是仙女宝宝', "请报暗号：");
    var firebase = this.state.firebase;
    firebase.once('value', function(snapshot) {
      var value = snapshot.val();
      console.log(value);
      console.log(value.password);
      console.log(pass);
      if (pass == value.password) {
        success();
      };
    }.bind(this));
  },
  render: function() {
    console.log('render');
    console.log(this.state);

    return <div className="door" onClick={this.onClick}>
            <div className={this.state.doorLeftClassName}></div>
            <div className={this.state.doorRightClassName}></div>
            <img className={this.state.taijiClassName}></img>
           </div>;
  }
});

var Content = React.createClass({
  getInitialState: function() {
    return {
      currentContent: '',
      content: 'hello world',
      charIndex: -1,
      stringLength: 0,
      spanStyle: 'blink'
    };
  },
  componentDidMount: function() {
    this.writeContent();
  },
  componentWillUnmount: function() {
    window.clearInterval(this.state.interval);
  },
  writeContent: function() {
    var charIndex = this.state.charIndex;
    var stringLength = this.state.stringLength;
    var content = this.state.content;
    var initString = this.state.currentContent;
    if (charIndex == -1) {
      charIndex = 0;
      stringLength = content.length;
      this.state.stringLength = stringLength;
    }
    console.log("the content = " + content);
    console.log("the current content = " + this.state.currentContent);
    console.log('the length = ' + stringLength);

    var theChar = content.charAt(charIndex);
    var nextFourChars = content.substr(charIndex, 4);
    if (nextFourChars == '<BR>' || nextFourChars == '<br>') {
      theChar = '<BR>';
      charIndex += 3;
    }
    initString = initString + theChar;
    this.state.currentContent = initString;

    charIndex = charIndex / 1 + 1;
    this.state.charIndex = charIndex;
    if (charIndex % 2 == 1) {
      this.state.spanStyle = 'hide';
    } else {
      this.state.spanStyle = 'blink';
    }

    if (charIndex <= stringLength) {
      this.state.interval = setInterval(function() {
        this.writeContent();
        window.clearInterval(this.state.interval);
      }.bind(this), 150);
    } else {
      this.blinkSpan();
    }

    this.setState(this.state)
  },
  blinkSpan: function() {
    if (this.state.spanStyle == 'blink') {
      this.state.spanStyle = 'hide';
    } else {
      this.state.spanStyle = 'blink';
    }
    this.setState(this.state);
    this.state.interval = setInterval(function() {
      this.blinkSpan();
      window.clearInterval(this.state.interval);
    }.bind(this), 500);
  },
  render: function() {
    return <div className='typeText'>{this.state.currentContent}<span className={this.state.spanStyle}>_</span></div>
  }
});

ReactDOM.render(
  <Content/>,
  document.getElementById('content')
);