// Generated by CoffeeScript 1.7.1
(function() {
  var $, Editor, app, _ref;

  window.app = (_ref = window.app) != null ? _ref : {};

  app = window.app;

  $ = jQuery;

  Editor = (function() {
    function Editor() {
      this.designer = new app.GameDesigner();
      $('.planets').change((function(_this) {
        return function() {
          return _this.load();
        };
      })(this));
      new app.ColorManager($('#constructionyard'), function() {});
      this.canvas = $('#constructionyard');
      this.cursorCanvas = $('#currentcell');
      this.toolCanvas = $('#currenttool');
      this.scrollPane = $('.scroll-panel');
      this.widthField = $('.width');
      this.heightField = $('.height');
      this.mapField = $(".map");
      app.GameLoader.loadGamesConfig();
      this.widthField.change((function(_this) {
        return function() {
          return _this.setWidth(_this.widthField.val());
        };
      })(this));
      this.heightField.change((function(_this) {
        return function() {
          return _this.setHeight(_this.heightField.val());
        };
      })(this));
      this.assets = app.AssetLoader;
      this.setHeight(this.heightField.val());
      this.setWidth(this.widthField.val());
      this.initMap();
      this.cursorCanvas.mousemove((function(_this) {
        return function(e) {
          return _this.onMouseMoveInCanvas(e);
        };
      })(this));
      this.cursorCtx = this.cursorCanvas.get(0).getContext('2d');
      this.toolCtx = this.toolCanvas.get(0).getContext('2d');
      this.mainCtx = this.canvas.get(0).getContext('2d');
      this.setupDocumentEvents();
      this.setupMouseWheel();
      this.setupToolbar();
      this.setupClick();
      this.load();
    }

    Editor.prototype.testPlanet = function() {};

    Editor.prototype.onMouseMoveInCanvas = function(e) {
      this.x = Math.floor((e.pageX - this.cursorCanvas.offset().left) / 32.0);
      this.y = Math.floor((e.pageY - this.cursorCanvas.offset().top) / 32.0);
      this.cursorCtx.lineWidth = 1;
      this.cursorCtx.strokeStyle = 'white';
      this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width(), this.cursorCanvas.height());
      this.cursorCtx.strokeRect(this.x * 32, this.y * 32, 32, 32);
      this.drawToolIcon();
      if (this.isLeftDown) {
        this.drawCurrentToolOnCanvas(this.x, this.y);
      }
      if (this.isRightDown) {
        return this.removeTail();
      }
    };

    Editor.prototype.load = function() {
      var game, lines, map, planet;
      this.designer.load();
      game = app.Universe.Games[$('.games').val()];
      planet = game.Planets[$('.planets').val()];
      map = planet.Map.replace(new RegExp(' ', 'g'), ".");
      lines = map.split('\n');
      if (lines[0] === "") {
        lines = lines.slice(1, lines.length - 1);
      }
      map = lines.join('\n');
      this.mapField.val(lines.join('\n'));
      this.mapField.attr("cols", lines[0].length);
      return this.map = map;
    };

    Editor.prototype.initMap = function() {
      var x, y, _i, _j, _ref1, _ref2;
      this.map = '';
      for (x = _i = 0, _ref1 = this.height - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; x = 0 <= _ref1 ? ++_i : --_i) {
        for (y = _j = 0, _ref2 = this.width - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; y = 0 <= _ref2 ? ++_j : --_j) {
          this.map += "_..";
        }
        this.map += "\n";
      }
      return this.mapField.val(this.map);
    };

    Editor.prototype.drawCurrentToolOnCanvas = function(x, y) {
      var asset;
      if (this.selectedTool == null) {
        return;
      }
      asset = this.assets.getAsset(this.selectedToolIcon);
      this.mainCtx.putImageData(asset, x * 32, y * 32);
      return this.updateMap(x, y, this.selectedMapSign);
    };

    Editor.prototype.updateMap = function(x, y, sign) {
      var begin, e, end, line, lines;
      try {
        lines = this.map.split("\n");
        line = lines[y];
        begin = line.substring(0, x * 3);
        end = line.substring((x + 1) * 3);
        line = begin + sign + end;
        lines[y] = line;
        this.map = lines.join("\n");
        return this.mapField.val(this.map);
      } catch (_error) {
        e = _error;
        return console.write(x + " " + y + " " + e);
      }
    };

    Editor.prototype.drawToolIcon = function() {
      var asset;
      if (this.selectedTool == null) {
        return;
      }
      this.toolCtx.clearRect(0, 0, this.toolCanvas.width(), this.toolCanvas.height());
      asset = this.assets.getAsset(this.selectedToolIcon);
      return this.toolCtx.putImageData(asset, this.x * 32, this.y * 32);
    };

    Editor.prototype.setHeight = function(val) {
      this.height = val;
      this.canvas.attr('height', val * 32);
      this.toolCanvas.attr('height', val * 32);
      return this.cursorCanvas.attr('height', val * 32);
    };

    Editor.prototype.setWidth = function(val) {
      var w;
      this.width = val;
      this.canvas.attr('width', val * 32);
      this.toolCanvas.attr('width', val * 32);
      this.cursorCanvas.attr('width', val * 32);
      w = (val * 32) + 20;
      if (w > 800) {
        w = 800;
      }
      return this.scrollPane.css('width', w + 'px');
    };

    Editor.prototype.setupDocumentEvents = function() {
      this.isLeftDown = false;
      this.isRightDown = false;
      $('body').attr('onContextMenu', 'return false');
      $(document).mousedown((function(_this) {
        return function(e) {
          if (event.which === 1) {
            _this.isLeftDown = true;
          }
          if (event.which === 3) {
            return _this.isRightDown = true;
          }
        };
      })(this));
      return $(document).mouseup((function(_this) {
        return function(e) {
          if (event.which === 1) {
            _this.isLeftDown = false;
          }
          if (event.which === 3) {
            return _this.isRightDown = false;
          }
        };
      })(this));
    };

    Editor.prototype.setupToolbar = function() {
      return $('.tool').click((function(_this) {
        return function(e, item) {
          $('.tool').removeClass('selected');
          $(e.target).parent().addClass('selected');
          _this.selectedTool = $(e.target);
          _this.selectedMapSign = $(e.target).data('map');
          return _this.selectedToolIcon = _this.selectedTool.data('tool-icon');
        };
      })(this));
    };

    Editor.prototype.setupMouseWheel = function() {
      return $('.editor').mousewheel((function(_this) {
        return function(e, delta) {
          var editor;
          editor = _this;
          $('.tool').each(function(i, e) {
            var curr, imgs;
            imgs = $(this).find('img');
            if (imgs.size() === 1) {
              return;
            }
            curr = -1;
            imgs.each(function(j, img) {
              if ($(img).hasClass('curr')) {
                return curr = j;
              }
            });
            if (delta < 0) {
              curr++;
            } else {
              curr--;
            }
            if (curr < 0) {
              curr = imgs.size() - 1;
            }
            if (curr === imgs.size()) {
              curr = 0;
            }
            imgs.removeClass('curr');
            $(imgs[curr]).addClass('curr');
            if ($(e).hasClass('selected')) {
              editor.selectedTool = $(imgs[curr]);
              editor.selectedToolIcon = $(imgs[curr]).data('tool-icon');
              return editor.selectedMapSign = $(imgs[curr]).data('map');
            }
          });
          _this.drawToolIcon(_this.x, _this.y);
          return false;
        };
      })(this));
    };

    Editor.prototype.setupClick = function() {
      this.cursorCanvas.mousedown((function(_this) {
        return function(e) {
          if (event.which === 1) {
            return _this.drawCurrentToolOnCanvas(_this.x, _this.y);
          } else if (event.which === 3) {
            if (_this.selectedTool != null) {
              return _this.deselectTool();
            } else {
              return _this.removeTail(_this.x, _this.y);
            }
          }
        };
      })(this));
      this.cursorCanvas.mouseout(function(e) {
        var leftDown, rightDown;
        leftDown = false;
        return rightDown = false;
      });
    };

    Editor.prototype.deselectTool = function() {
      this.toolCtx.clearRect(0, 0, this.toolCanvas.width(), this.toolCanvas.height());
      $('.tool.selected').removeClass('selected');
      this.selectedTool = null;
      return this.selectedToolIcon = null;
    };

    Editor.prototype.removeTail = function(x, y) {
      if (this.selectedTool == null) {
        this.mainCtx.clearRect(this.x * 32, this.y * 32, 32, 32);
        return this.updateMap(x, y, "_..");
      }
    };

    return Editor;

  })();

  $(function() {
    return new Editor();
  });

}).call(this);

//# sourceMappingURL=Editor.map
