// Generated by CoffeeScript 1.7.1
(function() {
  var app, _ref;

  window.app = (_ref = window.app) != null ? _ref : {};

  app = window.app;

  app.GamesOptions = (function() {
    function GamesOptions(gameDesigner, games, eventCtx) {
      this.gameDesigner = gameDesigner;
      this.games = games;
      this.eventCtx = eventCtx;
      $('.color').colorpicker();
      this.eventCtx.subscribe('map-updated', (function(_this) {
        return function(map) {
          return _this.onMapUpdated(map);
        };
      })(this));
      this.$saveGame = $('.save-game');
      this.setupGameOptions();
      this.setupPlanetOptions();
      this.setupActions();
      this.$games = this.gameDesigner.find('.games');
      this.$planets = this.gameDesigner.find('.planets');
      this.$games.change((function(_this) {
        return function() {
          return _this.onGameChanged();
        };
      })(this));
      this.$planets.change((function(_this) {
        return function() {
          _this.onPlanetChanged();
          return _this.publishSelectedPlanetChanged();
        };
      })(this));
      this.onGamesChanged();
      this.gameDesigner.find('.toggle-rawmap').click((function(_this) {
        return function() {
          return $('.map').toggle({
            easing: 'blind'
          });
        };
      })(this));
      this.gameDesigner.find('.toggle-options').click((function(_this) {
        return function() {
          return $('.options-panel').toggle({
            easing: 'blind'
          });
        };
      })(this));
      this.publishSelectedPlanetChanged();
      this.disableSave();
      this.setupServerPing();
      $('.color').colorpicker().on('changeColor', (function(_this) {
        return function(e) {
          return _this.onColorChange(e);
        };
      })(this));
      return;
    }

    GamesOptions.prototype.onMapUpdated = function(map) {
      return this.updatePlanet(function(planet) {
        return planet.map = map;
      });
    };

    GamesOptions.prototype.publishSelectedPlanetChanged = function() {
      return this.eventCtx.publish('selected-planet-changed', this.selectedPlanet());
    };

    GamesOptions.prototype.setupActions = function() {
      this.$saveGame.click((function(_this) {
        return function() {
          return _this.saveGame();
        };
      })(this));
      $('.new-game').click((function(_this) {
        return function() {
          return _this.newGame();
        };
      })(this));
      $('.new-planet').click((function(_this) {
        return function() {
          return _this.newPlanet();
        };
      })(this));
      $('.test-planet').click((function(_this) {
        return function() {
          return _this.testPlanet();
        };
      })(this));
      $('.remove-planet').click((function(_this) {
        return function() {
          return _this.removePlanet();
        };
      })(this));
      $('.remove-game').click((function(_this) {
        return function() {
          return _this.removeGame();
        };
      })(this));
      $('.clear-planet').click((function(_this) {
        return function() {
          return _this.eventCtx.publish('clear-planet');
        };
      })(this));
      return $('.random-maze').click((function(_this) {
        return function() {
          return _this.eventCtx.publish('random-maze-next-step');
        };
      })(this));
    };

    GamesOptions.prototype.saveGame = function() {
      $('.save-game').text('Saving...');
      this.processMaps(this.games);
      this.upateSizes();
      $.ajax({
        url: app.ConstructorConfig.serverAddress + "/api/robbo",
        data: {
          games: this.games
        },
        type: "POST",
        success: function() {
          return setTimeout((function() {
            return $('.save-game').text('Save game');
          }), 200);
        },
        error: function() {
          alert("Error. Coudn't save game.");
          return $('.save-game').text('Save game');
        }
      });
    };

    GamesOptions.prototype.processMaps = function() {
      var gameIndex, mapProcessing, planet, planetIndex, _i, _j, _ref1, _ref2;
      mapProcessing = new app.MapProcessing();
      for (gameIndex = _i = 0, _ref1 = this.games.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; gameIndex = 0 <= _ref1 ? ++_i : --_i) {
        for (planetIndex = _j = 0, _ref2 = this.games[gameIndex].planets.length - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; planetIndex = 0 <= _ref2 ? ++_j : --_j) {
          planet = this.games[gameIndex].planets[planetIndex];
          this.games[gameIndex].planets[planetIndex].map = mapProcessing.preSaveProcessing(planet.map);
        }
      }
    };

    GamesOptions.prototype.upateSizes = function() {
      var game, planet, _i, _j, _len, _len1, _ref1, _ref2;
      _ref1 = this.games;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        game = _ref1[_i];
        _ref2 = game.planets;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          planet = _ref2[_j];
          planet.width = app.MapLoader.getWidth(planet.map);
          planet.height = app.MapLoader.getHeight(planet.map);
        }
      }
    };

    GamesOptions.prototype.removeGame = function() {
      var i;
      if (this.games.length === 1) {
        alert("Don't remove all games.");
        return;
      }
      i = this.games.firstIndexOf((function(_this) {
        return function(g) {
          return g.index.toString() === _this.$games.val();
        };
      })(this));
      this.games.splice(i, 1);
      return this.onGamesChanged();
    };

    GamesOptions.prototype.newGame = function() {
      var game, maxIndex;
      maxIndex = this.games.max((function(_this) {
        return function(g) {
          return parseInt(g.index);
        };
      })(this));
      game = {
        name: "Game " + (this.games.length + 1),
        startingNumberOfLives: 9,
        planets: [this.createPlanet(1)],
        index: maxIndex + 1
      };
      this.games.push(game);
      this.onGamesChanged();
      this.$games.find('option:last').attr("selected", "selected");
      return this.onGameChanged();
    };

    GamesOptions.prototype.newPlanet = function() {
      this.updateGame((function(_this) {
        return function(game) {
          return game.planets.push(_this.createPlanet(game.planets.length + 1));
        };
      })(this));
      return this.onPlanetsChanged();
    };

    GamesOptions.prototype.removePlanet = function() {
      if (this.selectedGame().planets.length === 1) {
        alert("Don't remove all planets.");
        return;
      }
      this.updateGame((function(_this) {
        return function(game) {
          var i;
          i = game.planets.firstIndexOf(function(p) {
            return p.index.toString() === _this.$planets.val();
          });
          game.planets.splice(i, 1);
          _this.onPlanetsChanged();
        };
      })(this));
    };

    GamesOptions.prototype.testPlanet = function() {
      return window.open("robbo.html?game=" + (this.selectedGame().index) + "&planet=" + (this.selectedPlanet().index), "_blank");
    };

    GamesOptions.prototype.setupGameOptions = function() {
      this.$gameName = $('.game-name');
      this.$lives = $('.lives');
      this.$gameName.change((function(_this) {
        return function() {
          return _this.updateGame(function(game) {
            return game.name = _this.$gameName.val();
          });
        };
      })(this));
      return this.$lives.change((function(_this) {
        return function() {
          return _this.updateGame(function(game) {
            return game.startingNumberOfLives = _this.$lives.val();
          });
        };
      })(this));
    };

    GamesOptions.prototype.setupPlanetOptions = function() {
      this.$width = $('.width');
      this.$height = $('.height');
      this.$bolts = $('.bolts');
      this.$planetName = $('.planet-name');
      this.$width.change((function(_this) {
        return function() {
          _this.updatePlanet(function(planet) {
            return planet.width = _this.$width.val();
          });
          return _this.eventCtx.publish('map-width-changed', parseInt(_this.$width.val()));
        };
      })(this));
      this.$height.change((function(_this) {
        return function() {
          _this.updatePlanet(function(planet) {
            return planet.height = _this.$height.val();
          });
          return _this.eventCtx.publish('map-height-changed', parseInt(_this.$height.val()));
        };
      })(this));
      this.$bolts.change((function(_this) {
        return function() {
          return _this.updatePlanet(function(planet) {
            return planet.boltsToBeCollected = _this.$bolts.val();
          });
        };
      })(this));
      return this.$planetName.change((function(_this) {
        return function() {
          return _this.updatePlanet(function(planet) {
            return planet.name = _this.$planetName.val();
          });
        };
      })(this));
    };

    GamesOptions.prototype.updatePlanet = function(func) {
      var game, planet, _i, _j, _len, _len1, _ref1, _ref2;
      _ref1 = this.games;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        game = _ref1[_i];
        if (game.index.toString() === this.$games.val()) {
          _ref2 = game.planets;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            planet = _ref2[_j];
            if (planet.index.toString() === this.$planets.val()) {
              func(planet);
            }
          }
        }
      }
    };

    GamesOptions.prototype.updateGame = function(func) {
      var game, _i, _len, _ref1;
      _ref1 = this.games;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        game = _ref1[_i];
        if (game.index.toString() === this.$games.val()) {
          func(game);
        }
      }
    };

    GamesOptions.prototype.onGamesChanged = function() {
      var game, _i, _len, _ref1;
      this.$games.find('option').remove();
      _ref1 = this.games;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        game = _ref1[_i];
        this.$games.append($('<option />').attr('value', game.index).text(game.name));
      }
      this.onGameChanged();
    };

    GamesOptions.prototype.onPlanetsChanged = function() {
      var planet, _i, _len, _ref1;
      this.$planets.find('option').remove();
      _ref1 = this.selectedGame().planets;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        planet = _ref1[_i];
        this.$planets.append($('<option />').attr('value', planet.index).text(planet.name));
      }
      this.$planets.find('option').attr("selected", null);
      this.$planets.find('option:last').attr("selected", "selected");
      return this.onPlanetChanged();
    };

    GamesOptions.prototype.onGameChanged = function() {
      var game;
      game = this.selectedGame();
      this.$gameName.val(game.name);
      this.$lives.val(game.startingNumberOfLives);
      return this.onPlanetsChanged();
    };

    GamesOptions.prototype.onPlanetChanged = function() {
      var planet;
      planet = this.selectedPlanet();
      this.$width.val(planet.width);
      this.$height.val(planet.height);
      this.$bolts.val(planet.boltsToBeCollected);
      this.$planetName.val(planet.name);
      this.updateColors(planet);
      this.publishSelectedPlanetChanged();
    };

    GamesOptions.prototype.updateColors = function(planet) {
      var color, i, _i, _len, _ref1;
      this.stopColorUpdates = true;
      $('[data-color-for="background"]').colorpicker('setValue', planet.background.toRgbaString());
      new app.ColorManager(null, planet.background, planet.transparent, planet.colors);
      $('[data-color-for="transparent"]').colorpicker('setValue', planet.transparent.toRgbaString());
      _ref1 = planet.colors;
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        color = _ref1[i];
        $("[data-color-for=\"" + (i + 1) + "\"]").colorpicker('setValue', color.toRgbaString());
      }
      this.eventCtx.publish('background-changed', planet.background);
      new app.ColorManager(null, planet.background, planet.transparent, planet.colors);
      return this.stopColorUpdates = false;
    };

    GamesOptions.prototype.onColorChange = function(e) {
      var color, colorFor, colorVal, index;
      if ((this.stopColorUpdates != null) && this.stopColorUpdates) {
        return;
      }
      colorFor = $(e.target).data('color-for');
      colorVal = $(e.target).find('input').val();
      color = colorVal.rgbaToArray();
      if (colorFor === "background") {
        this.updatePlanet(function(p) {
          return p.background = color;
        });
        $('#constructionyard').css("background-color", colorVal);
        return;
      } else if (colorFor === "transparent") {
        this.updatePlanet(function(p) {
          p.transparent = color;
          return app.ColorTranslation[0].to = color;
        });
      } else {
        index = parseInt(colorFor);
        this.updatePlanet(function(p) {
          app.ColorTranslation[index].to = color;
          return p.colors[index - 1] = color;
        });
      }
      return this.eventCtx.publish('colors-changed');
    };

    GamesOptions.prototype.selectedGame = function() {
      return this.games.single((function(_this) {
        return function(g) {
          return g.index.toString() === _this.$games.val();
        };
      })(this));
    };

    GamesOptions.prototype.selectedPlanet = function() {
      return this.selectedGame().planets.single((function(_this) {
        return function(p) {
          return p.index.toString() === _this.$planets.val();
        };
      })(this));
    };

    GamesOptions.prototype.createPlanet = function(index) {
      return {
        boltsToBeCollected: 5,
        name: "Planet " + index,
        index: index,
        width: 16,
        height: 32,
        map: this.generateEmptyMap(32, 16),
        background: [83, 148, 83, 255],
        transparent: [255, 0, 0, 0],
        colors: [[162, 114, 64, 255], [28, 39, 129, 255], [138, 144, 191, 255], [152, 152, 152, 255]]
      };
    };

    GamesOptions.prototype.generateEmptyMap = function(h, w) {
      var map, x, y, _i, _j, _ref1, _ref2;
      map = "";
      for (y = _i = 0, _ref1 = h - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; y = 0 <= _ref1 ? ++_i : --_i) {
        for (x = _j = 0, _ref2 = w - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; x = 0 <= _ref2 ? ++_j : --_j) {
          map += "_..";
        }
        map += "\n";
      }
      return map;
    };

    GamesOptions.prototype.setupServerPing = function() {
      this.pingServer();
      return setInterval(((function(_this) {
        return function() {
          return _this.pingServer();
        };
      })(this)), 3000);
    };

    GamesOptions.prototype.pingServer = function() {
      try {
        return $.ajax({
          type: "GET",
          async: true,
          url: app.ConstructorConfig.serverAddress + '/api/robbo',
          error: (function(_this) {
            return function() {
              return _this.disableSave();
            };
          })(this),
          success: (function(_this) {
            return function() {
              return _this.enableSave();
            };
          })(this)
        });
      } catch (_error) {
        return this.$saveGame.attr('disbled', 'disbled');
      }
    };

    GamesOptions.prototype.disableSave = function() {
      this.$saveGame.attr('disabled', 'disabled');
      this.$saveGame.text("connecting...");
      this.$saveGame.removeClass('btn-primary');
      return this.$saveGame.addClass('btn-warning');
    };

    GamesOptions.prototype.enableSave = function() {
      this.$saveGame.removeAttr('disabled');
      this.$saveGame.text("Save game");
      this.$saveGame.addClass('btn-primary');
      return this.$saveGame.removeClass('btn-warning');
    };

    return GamesOptions;

  })();

}).call(this);
