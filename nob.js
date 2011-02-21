var nob = function(elem, opt) {
  this.value = 0;
  this.max = 127;
  this.maxAngle = 120;
  this.min = 0;
  this.minAngle = -120;
  this.step = 1;
  this.previous = null;
  this.callback = null;

  var diameter = 40;
  var theme = 'nob_theme';

  if (opt != undefined) {
    /*
     * diameter: diameter of nob
     * default: default value
     * min: minimum value
     * max: maximum value
     * step: amount of value step
     * minAngle: nob angle on minimum value
     * maxAngle: nob angle on maximum value
     * theme: css class name to use as nob theme
     */
    if (typeof opt.diameter == 'number' && opt.diameter >= 30 && opt.diameter <= 100) {
      diameter = opt.diameter;
    }
    if (typeof opt.min == 'number' && typeof opt.max == 'number' && opt.min < opt.max) {
      this.min = Math.floor(opt.min);
      this.max = Math.floor(opt.max);
    }
    if (typeof opt.default == 'number' && opt.default >= opt.min && opt.default <= opt.max) {
      this.value = Math.floor(opt.default);
    } else {
      this.value = this.min;
    }
    if (typeof opt.step == 'number' && opt.step <= (Math.abs(this.min) + Math.abs(this.max))) {
      this.step = Math.floor(opt.step);
    }
    if (typeof opt.minAngle == 'number' && typeof opt.maxAngle == 'number' &&
        opt.minAngle >= -180 && opt.maxAngle < 360 && opt.minAngle < opt.maxAngle) {
      this.maxAngle = Math.floor(opt.maxAngle);
      this.minAngle = Math.floor(opt.minAngle);
    }
    if (opt.theme) theme = opt.theme;
  }

  var sdw = document.createElement('div');
  sdw.classList.add('overlay');
  sdw.style.width = Math.floor(diameter)+'px';
  sdw.style.height = Math.floor(diameter)+'px';
  sdw.style.borderRadius = Math.floor(diameter / 2)+'px';
  sdw.draggable = true;
  elem.appendChild(sdw);

  var nob = document.createElement('div');
  nob.classList.add('nob');
  nob.classList.add(theme);
  nob.style.width = Math.floor(diameter - 2)+'px';
  nob.style.height = Math.floor(diameter - 2)+'px';
  nob.style.borderRadius = Math.floor(diameter / 2)+'px';
  sdw.appendChild(nob);
  this.nob = nob;

  var ind = document.createElement('div');
  ind.classList.add('indicator');
  ind.style.height = Math.floor(diameter * 0.375)+'px';
  ind.style.left = Math.floor(((diameter - 2) / 2) - 3)+'px';
  ind.style.top = '-1px';
  ind.style.webkitTransformOrigin = '3px '+Math.floor(diameter / 2)+'px';
  nob.appendChild(ind);

  this.update(this.value);
  var self = this;
  sdw.ondragstart = function(e) {
    self.previous = e.y;
    window.onmousemove = function(e) {
      var offset = self.previous - e.y;
      if (e.shiftKey) {
        offset = offset < 0 ? -self.step : offset > 0 ? +self.step : 0;
      } else {
        var valueRange = Math.abs(self.min) + Math.abs(self.max);
        offset = Math.floor(valueRange * offset / 100);
      }
      self.update(self.value + offset);
      self.previous = e.y;
    };
    window.onmouseup = function() {
      self.previous = null;
      window.onmousemove = null;
      window.onmouseup = null;
    };
    e.preventDefault();
  };
};
nob.prototype = {
  update: function(value) {
    this.value = value < this.min ? this.min : value > this.max ? this.max : value;
    if (this.callback != null) this.callback(this.value);

    var amount = this.value - this.min;
    var valueRange = Math.abs(this.min) + Math.abs(this.max);
    var angleRange = Math.abs(this.minAngle) + Math.abs(this.maxAngle);
    var deg = Math.floor(amount / valueRange * angleRange );
    this.nob.style.webkitTransform = 'rotate('+(this.minAngle+deg)+'deg)';
  },
  bind: function(func) {
    if (typeof func == 'function') this.callback = func;
  },
  bindInput: function(elem) {
    if (elem.value) {
      this.callback = function(value) {
        elem.value = value;
      }
    }
  },
  unbind: function() {
    this.callback = null;
  }
};
