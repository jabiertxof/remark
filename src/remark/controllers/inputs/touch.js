exports.register = function (events, options) {
  addTouchEventListeners(events, options);
};
 
exports.unregister = function (events) {
  removeTouchEventListeners(events);
};

function addTouchEventListeners (events, options) {
  var touch
    , startX
    , endX
    , startY
    , endY
    ;

  if (options.touch === false) {
    return;
  }
  var getHeight = function () {
    var ratio = window.devicePixelRatio || 1;
    //var w = screen.width * ratio;
    return screen.height * ratio;
  }
  var isTap = function () {
    return Math.abs(startX - endX) < 10;
  };
  
  var isTop = function () {
    return Math.abs(startY - endY) > 10 && startY == 0;
  };
  
  var isBottom = function () {
    return Math.abs(startY - endY) > 10 && startY == getHeight();
  };

  var handleTap = function () {
    events.emit('tap', endX);
  };

  var handleSwipe = function () {
    if (startX > endX) {
      events.emit('gotoNextSlide');
    }
    else {
      events.emit('gotoPreviousSlide');
    }
  };

  events.on('touchstart', function (event) {
    touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  events.on('touchend', function (event) {
    if (event.target.nodeName.toUpperCase() === 'A') {
      return;
    }

    touch = event.changedTouches[0];
    endX = touch.clientX;
    endY = touch.clientY;
    
    if (isTop()) {
      events.emit('togglePresenterMode');
    } else if(isBottom()) {
      events.emit('createClone');
    } else if (isTap()) {
      handleTap();
    }
    else {
      handleSwipe();
    }
  });

  events.on('touchmove', function (event) {
    event.preventDefault();
  });
}

function removeTouchEventListeners(events) {
  events.removeAllListeners("touchstart");
  events.removeAllListeners("touchend");
  events.removeAllListeners("touchmove");
}
