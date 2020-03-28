"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stopThresholdDefault = 0.3;
var bounceDeceleration = 0.04;
var bounceAcceleration = 0.11;
window.addEventListener('touchmove', function () {});

var Impetus = function Impetus(_ref) {
  var _ref$source = _ref.source,
      sourceEl = _ref$source === void 0 ? document : _ref$source,
      updateCallback = _ref.update,
      _ref$multiplier = _ref.multiplier,
      multiplier = _ref$multiplier === void 0 ? 1 : _ref$multiplier,
      _ref$friction = _ref.friction,
      friction = _ref$friction === void 0 ? 0.92 : _ref$friction,
      initialValues = _ref.initialValues,
      boundX = _ref.boundX,
      boundY = _ref.boundY,
      _ref$bounce = _ref.bounce,
      bounce = _ref$bounce === void 0 ? true : _ref$bounce;

  _classCallCheck(this, Impetus);

  var boundXmin, boundXmax, boundYmin, boundYmax, pointerLastX, pointerLastY, pointerCurrentX, pointerCurrentY, pointerId, decVelX, decVelY;
  var targetX = 0;
  var targetY = 0;
  var stopThreshold = stopThresholdDefault * multiplier;
  var ticking = false;
  var pointerActive = false;
  var paused = false;
  var decelerating = false;
  var trackingPoints = [];

  (function init() {
    sourceEl = typeof sourceEl === 'string' ? document.querySelector(sourceEl) : sourceEl;

    if (!sourceEl) {
      throw new Error('IMPETUS: source not found.');
    }

    if (!updateCallback) {
      throw new Error('IMPETUS: update function not defined.');
    }

    if (initialValues) {
      if (initialValues[0]) {
        targetX = initialValues[0];
      }

      if (initialValues[1]) {
        targetY = initialValues[1];
      }

      callUpdateCallback();
    }

    if (boundX) {
      boundXmin = boundX[0];
      boundXmax = boundX[1];
    }

    if (boundY) {
      boundYmin = boundY[0];
      boundYmax = boundY[1];
    }

    sourceEl.addEventListener('touchstart', onDown);
    sourceEl.addEventListener('mousedown', onDown);
  })();

  this.destroy = function () {
    sourceEl.removeEventListener('touchstart', onDown);
    sourceEl.removeEventListener('mousedown', onDown);
    cleanUpRuntimeEvents();
    return null;
  };

  this.pause = function () {
    cleanUpRuntimeEvents();
    pointerActive = false;
    paused = true;
  };

  this.resume = function () {
    paused = false;
  };

  this.setValues = function (x, y) {
    if (typeof x === 'number') {
      targetX = x;
    }

    if (typeof y === 'number') {
      targetY = y;
    }
  };

  this.setMultiplier = function (val) {
    multiplier = val;
    stopThreshold = stopThresholdDefault * multiplier;
  };

  this.setBoundX = function (boundX) {
    boundXmin = boundX[0];
    boundXmax = boundX[1];
  };

  this.setBoundY = function (boundY) {
    boundYmin = boundY[0];
    boundYmax = boundY[1];
  };

  function cleanUpRuntimeEvents() {
    document.removeEventListener('touchmove', onMove, getPassiveSupported() ? {
      passive: false
    } : false);
    document.removeEventListener('touchend', onUp);
    document.removeEventListener('touchcancel', stopTracking);
    document.removeEventListener('mousemove', onMove, getPassiveSupported() ? {
      passive: false
    } : false);
    document.removeEventListener('mouseup', onUp);
  }

  function addRuntimeEvents() {
    cleanUpRuntimeEvents();
    document.addEventListener('touchmove', onMove, getPassiveSupported() ? {
      passive: false
    } : false);
    document.addEventListener('touchend', onUp);
    document.addEventListener('touchcancel', stopTracking);
    document.addEventListener('mousemove', onMove, getPassiveSupported() ? {
      passive: false
    } : false);
    document.addEventListener('mouseup', onUp);
  }

  function callUpdateCallback() {
    updateCallback.call(sourceEl, targetX, targetY);
  }

  function normalizeEvent(ev) {
    if (ev.type === 'touchmove' || ev.type === 'touchstart' || ev.type === 'touchend') {
      var touch = ev.targetTouches[0] || ev.changedTouches[0];
      return {
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier
      };
    } else {
      return {
        x: ev.clientX,
        y: ev.clientY,
        id: null
      };
    }
  }

  function onDown(ev) {
    var event = normalizeEvent(ev);

    if (!pointerActive && !paused) {
      pointerActive = true;
      decelerating = false;
      pointerId = event.id;
      pointerLastX = pointerCurrentX = event.x;
      pointerLastY = pointerCurrentY = event.y;
      trackingPoints = [];
      addTrackingPoint(pointerLastX, pointerLastY);
      addRuntimeEvents();
    }
  }

  function onMove(ev) {
    ev.preventDefault();
    var event = normalizeEvent(ev);

    if (pointerActive && event.id === pointerId) {
      pointerCurrentX = event.x;
      pointerCurrentY = event.y;
      addTrackingPoint(pointerLastX, pointerLastY);
      requestTick();
    }
  }

  function onUp(ev) {
    var event = normalizeEvent(ev);

    if (pointerActive && event.id === pointerId) {
      stopTracking();
    }
  }

  function stopTracking() {
    pointerActive = false;
    addTrackingPoint(pointerLastX, pointerLastY);
    startDecelAnim();
    cleanUpRuntimeEvents();
  }

  function addTrackingPoint(x, y) {
    var time = Date.now();

    while (trackingPoints.length > 0) {
      if (time - trackingPoints[0].time <= 100) {
        break;
      }

      trackingPoints.shift();
    }

    trackingPoints.push({
      x: x,
      y: y,
      time: time
    });
  }

  function updateAndRender() {
    var pointerChangeX = pointerCurrentX - pointerLastX;
    var pointerChangeY = pointerCurrentY - pointerLastY;
    targetX += pointerChangeX * multiplier;
    targetY += pointerChangeY * multiplier;

    if (bounce) {
      var diff = checkBounds();

      if (diff.x !== 0) {
        targetX -= pointerChangeX * dragOutOfBoundsMultiplier(diff.x) * multiplier;
      }

      if (diff.y !== 0) {
        targetY -= pointerChangeY * dragOutOfBoundsMultiplier(diff.y) * multiplier;
      }
    } else {
      checkBounds(true);
    }

    callUpdateCallback();
    pointerLastX = pointerCurrentX;
    pointerLastY = pointerCurrentY;
    ticking = false;
  }

  function dragOutOfBoundsMultiplier(val) {
    return 0.000005 * Math.pow(val, 2) + 0.0001 * val + 0.55;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimFrame(updateAndRender);
    }

    ticking = true;
  }

  function checkBounds(restrict) {
    var xDiff = 0;
    var yDiff = 0;

    if (boundXmin !== undefined && targetX < boundXmin) {
      xDiff = boundXmin - targetX;
    } else if (boundXmax !== undefined && targetX > boundXmax) {
      xDiff = boundXmax - targetX;
    }

    if (boundYmin !== undefined && targetY < boundYmin) {
      yDiff = boundYmin - targetY;
    } else if (boundYmax !== undefined && targetY > boundYmax) {
      yDiff = boundYmax - targetY;
    }

    if (restrict) {
      if (xDiff !== 0) {
        targetX = xDiff > 0 ? boundXmin : boundXmax;
      }

      if (yDiff !== 0) {
        targetY = yDiff > 0 ? boundYmin : boundYmax;
      }
    }

    return {
      x: xDiff,
      y: yDiff,
      inBounds: xDiff === 0 && yDiff === 0
    };
  }

  function startDecelAnim() {
    var firstPoint = trackingPoints[0];
    var lastPoint = trackingPoints[trackingPoints.length - 1];
    var xOffset = lastPoint.x - firstPoint.x;
    var yOffset = lastPoint.y - firstPoint.y;
    var timeOffset = lastPoint.time - firstPoint.time;
    var D = timeOffset / 15 / multiplier;
    decVelX = xOffset / D || 0;
    decVelY = yOffset / D || 0;
    var diff = checkBounds();

    if (Math.abs(decVelX) > 1 || Math.abs(decVelY) > 1 || !diff.inBounds) {
      decelerating = true;
      requestAnimFrame(stepDecelAnim);
    }
  }

  function stepDecelAnim() {
    if (!decelerating) {
      return;
    }

    decVelX *= friction;
    decVelY *= friction;
    targetX += decVelX;
    targetY += decVelY;
    var diff = checkBounds();

    if (Math.abs(decVelX) > stopThreshold || Math.abs(decVelY) > stopThreshold || !diff.inBounds) {
      if (bounce) {
        var reboundAdjust = 2.5;

        if (diff.x !== 0) {
          if (diff.x * decVelX <= 0) {
            decVelX += diff.x * bounceDeceleration;
          } else {
            var adjust = diff.x > 0 ? reboundAdjust : -reboundAdjust;
            decVelX = (diff.x + adjust) * bounceAcceleration;
          }
        }

        if (diff.y !== 0) {
          if (diff.y * decVelY <= 0) {
            decVelY += diff.y * bounceDeceleration;
          } else {
            var _adjust = diff.y > 0 ? reboundAdjust : -reboundAdjust;

            decVelY = (diff.y + _adjust) * bounceAcceleration;
          }
        }
      } else {
        if (diff.x !== 0) {
          if (diff.x > 0) {
            targetX = boundXmin;
          } else {
            targetX = boundXmax;
          }

          decVelX = 0;
        }

        if (diff.y !== 0) {
          if (diff.y > 0) {
            targetY = boundYmin;
          } else {
            targetY = boundYmax;
          }

          decVelY = 0;
        }
      }

      callUpdateCallback();
      requestAnimFrame(stepDecelAnim);
    } else {
      decelerating = false;
    }
  }
};

exports["default"] = Impetus;

var requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

function getPassiveSupported() {
  var passiveSupported = false;

  try {
    var options = Object.defineProperty({}, "passive", {
      get: function get() {
        passiveSupported = true;
      }
    });
    window.addEventListener("test", null, options);
  } catch (err) {}

  getPassiveSupported = function getPassiveSupported() {
    return passiveSupported;
  };

  return passiveSupported;
}