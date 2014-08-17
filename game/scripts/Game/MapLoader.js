// Generated by CoffeeScript 1.7.1
(function() {
  var app, _ref;

  window.app = (_ref = window.app) != null ? _ref : {};

  app = window.app;

  app.MapLoader = (function() {
    function MapLoader(envCtx, canvas) {
      this.envCtx = envCtx;
      this.canvas = canvas;
      this.envCtx.eventAggregator.subscribe('load-level', ((function(_this) {
        return function(palnet) {
          return _this.load(palnet);
        };
      })(this)), this);
      this.envCtx.eventAggregator.subscribe('restart-level', ((function(_this) {
        return function(palnet) {
          return _this.restart(palnet);
        };
      })(this)), this);
    }

    MapLoader.prototype.restart = function(planet) {
      this.load(planet);
      return this.envCtx.eventAggregator.publish('level-restarted');
    };

    MapLoader.prototype.cleanMap = function() {
      var obj, row, _i, _len, _ref1, _results;
      if (this.envCtx.map == null) {
        return;
      }
      _ref1 = this.envCtx.map;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        row = _ref1[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
            obj = row[_j];
            if (obj != null) {
              this.envCtx.eventAggregator.unsubscribe(obj);
              this.envCtx.unregisterRandomCalls(obj);
              this.envCtx.map[obj.y][obj.x] = null;
              _results1.push(delete	obj);
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    MapLoader.prototype.load = function(planet) {
      var char, char2, char3, i, line, lines, maxWidth, o, obj, toInit, x, y, _i, _j, _k, _l, _len, _len1, _len2, _ref1;
      this.cleanMap();
      lines = planet.Map.split('\n');
      if (lines[0] === "") {
        lines = lines.slice(1, lines.length - 1);
      }
      maxWidth = 0;
      for (y = _i = 0, _len = lines.length; _i < _len; y = ++_i) {
        line = lines[y];
        if ((line.length - 1) / 3 > maxWidth) {
          maxWidth = line.length / 3;
        }
      }
      this.envCtx.initMap(maxWidth, lines.length);
      toInit = [];
      this.canvas.attr('width', maxWidth * 32);
      this.canvas.attr('height', lines.length * 32);
      for (y = _j = 0, _len1 = lines.length; _j < _len1; y = ++_j) {
        line = lines[y];
        if (line === "") {
          continue;
        }
        for (i = _k = 0, _ref1 = line.length / 3; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
          x = i;
          char = line[i * 3];
          char2 = line[i * 3 + 1];
          char3 = line[i * 3 + 2];
          obj = null;
          switch (char) {
            case 'w':
              obj = new app.Wall(this.envCtx, x, y);
              break;
            case 'R':
              obj = new app.Robbo(this.envCtx, x, y);
              break;
            case 'b':
              obj = new app.Bolt(this.envCtx, x, y);
              break;
            case '#':
              if (char2 === 'o') {
                obj = new app.ContainerWithWheels(this.envCtx, x, y);
              } else {
                obj = new app.Container(this.envCtx, x, y);
              }
              break;
            case 's':
              obj = new app.Ship(this.envCtx, x, y);
              break;
            case 'X':
              obj = new app.Bomb(this.envCtx, x, y);
              break;
            case 'k':
              obj = new app.Key(this.envCtx, x, y);
              break;
            case '+':
              obj = new app.Rubble(this.envCtx, x, y);
              break;
            case 'd':
              obj = new app.Door(this.envCtx, x, y);
              break;
            case 'a':
              obj = new app.Ammo(this.envCtx, x, y);
              break;
            case '|':
              obj = new app.LaserBeam(this.envCtx, x, y, [0, 1]);
              toInit.push(obj);
              break;
            case '-':
              obj = new app.LaserBeam(this.envCtx, x, y, [1, 0]);
              toInit.push(obj);
              break;
            case 'L':
              if (char3 === ' ' || char3 === '.') {
                obj = new app.Laser(this.envCtx, x, y, this.getDirection(char2));
              } else if (char3 === 'r') {
                obj = new app.RotatingLaser(this.envCtx, x, y);
              } else if (char3 === 's') {
                obj = new app.StableBeamLaser(this.envCtx, x, y, this.getDirection(char2));
              }
              break;
            case 'B':
              if (char3 === ' ' || char3 === '.') {
                obj = new app.Bat(this.envCtx, x, y, this.getOrientation(char2));
              } else {
                obj = new app.FiringBat(this.envCtx, x, y, this.getOrientation(char2), this.getDirection(char3));
              }
              break;
            case 'E':
              if (char2 === 'a') {
                obj = new app.Ant(this.envCtx, x, y);
              } else if (char2 === 'c') {
                obj = new app.Coala(this.envCtx, x, y);
              } else if (char2 === 'e') {
                obj = new app.Eyes(this.envCtx, x, y);
              }
              toInit.push(obj);
              break;
            case 'p':
              obj = toInit.push(obj);
              break;
            case 'M':
              obj = new app.Magnet(this.envCtx, x, y, this.getDirection(char2));
              break;
            case 'l':
              obj = new app.MovingLaser(this.envCtx, x, y, this.getOrientation(char2), this.getDirection(char3));
              break;
            case '@':
              obj = new app.Blaster(this.envCtx, x, y, this.getDirection(char2));
              break;
            case '0':
              obj = new app.Nothing(this.envCtx, x, y);
              break;
            case '*':
              obj = new app.Blink(this.envCtx, x, y);
              toInit.push(obj);
              break;
            case 'T':
              obj = new app.Teleport(this.envCtx, x, y, parseInt(char2), parseInt(char3));
              toInit.push(obj);
              break;
            case '?':
              obj = new app.QuestionMark(this.envCtx, x, y);
              break;
            case '&':
              if (char2 === '&') {
                obj = new app.MightyLive(this.envCtx, x, y);
              } else {
                obj = new app.Live(this.envCtx, x, y);
              }
              break;
            case '%':
              obj = new app.IonStorm(this.envCtx, x, y, this.getOrientation(char2));
              toInit.push(obj);
          }
          this.envCtx.setObjAt(x, y, obj);
        }
      }
      for (_l = 0, _len2 = toInit.length; _l < _len2; _l++) {
        o = toInit[_l];
        o.init();
      }
      this.envCtx.eventAggregator.publish('level-loaded');
    };

    MapLoader.prototype.getDirection = function(char) {
      switch (char) {
        case '>':
          return 'right';
        case 'v':
          return 'down';
        case '<':
          return 'left';
        case '^':
          return 'up';
      }
    };

    MapLoader.prototype.getOrientation = function(char) {
      switch (char) {
        case '|':
          return 'vertical';
        case '-':
          return 'horizontal';
      }
    };

    return MapLoader;

  })();

}).call(this);

//# sourceMappingURL=MapLoader.map
