// Generated by CoffeeScript 1.7.1
(function() {
  var app, _ref;

  window.app = (_ref = window.app) != null ? _ref : {};

  app = window.app;

  app.Game = (function() {
    function Game(gameBoard, game, planetsList) {
      this.gameBoard = gameBoard;
      this.disableScrolling();
      this.levelManager = new app.LevelManger(this.gameBoard, game, planetsList);
      this.levelManager.startGame();
      this.timeDelayedMethodCall = new app.TimeDelayedMethodCall();
      this.watchCoordinates();
      this.setupMinimap();
    }

    Game.prototype.setupMinimap = function() {
      var callback;
      callback = (function(_this) {
        return function() {
          var minimap, minimap2D;
          minimap = $('.minimap').attr('width', _this.canvas().width() * 0.2).attr('height', _this.canvas().height() * 0.2).css('background-color', _this.canvas().css('background-color'));
          minimap2D = minimap.get(0).getContext('2d');
          minimap2D.scale(0.2, 0.2);
          minimap2D.drawImage(_this.canvas()[0], 0, 0);
          return _this.timeDelayedMethodCall.delay(1000, function() {
            return callback();
          });
        };
      })(this);
      return callback();
    };

    Game.prototype.canvas = function() {
      return this.gameBoard.find('canvas');
    };

    Game.prototype.watchCoordinates = function() {
      return this.canvas().mousemove((function(_this) {
        return function(e) {
          var x, y;
          x = Math.floor((e.pageX - _this.canvas().offset().left) / 32.0);
          y = Math.floor((e.pageY - _this.canvas().offset().top) / 32.0);
          if (x < 10) {
            x = ' ' + x;
          }
          if (y < 10) {
            y = ' ' + y;
          }
          return $('.coordinates').text("[" + x + "," + y + "]");
        };
      })(this));
    };

    Game.prototype.redraw = function() {
      var obj, x, y, _i, _j, _ref1, _ref2;
      for (x = _i = 0, _ref1 = this.envCtx.width - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; x = 0 <= _ref1 ? ++_i : --_i) {
        for (y = _j = 0, _ref2 = this.envCtx.height - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; y = 0 <= _ref2 ? ++_j : --_j) {
          obj = this.envCtx.getObjAt(x, y);
          if (obj != null) {
            this.envCtx.objChangedState(obj);
          }
        }
      }
      app.ColorTranslation.isChanged = false;
    };

    Game.prototype.disableScrolling = function() {
      var ar;
      ar = [33, 34, 35, 36, 37, 38, 39, 40];
      return $(document).keydown(function(e) {
        var key;
        key = e.which;
        if ($.inArray(key, ar) > -1) {
          e.preventDefault();
          return false;
        }
        return true;
      });
    };

    return Game;

  })();

}).call(this);

//# sourceMappingURL=Game.map