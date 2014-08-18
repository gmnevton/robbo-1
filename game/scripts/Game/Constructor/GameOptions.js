// Generated by CoffeeScript 1.7.1
(function() {
  var app, _ref;

  window.app = (_ref = window.app) != null ? _ref : {};

  app = window.app;

  app.GameDesigner = (function() {
    function GameDesigner() {
      this.gameName = ko.observable("game");
      this.planetName = ko.observable("planet");
      this.lives = ko.observable(9);
      this.bolts = ko.observable(5);
      this.width = ko.observable(16);
      this.height = ko.observable(32);
      ko.applyBindings(this, $('.game-designer')[0]);
    }

    GameDesigner.prototype.saveGame = function() {
      return alert('save');
    };

    GameDesigner.prototype.newGame = function() {
      return alert('new');
    };

    GameDesigner.prototype.newPlanet = function() {
      return alert('newp');
    };

    GameDesigner.prototype.testPlanet = function() {
      return window.open("robbo.html?game=" + (app.GameLoader.currentGame()) + "&planet=" + (app.GameLoader.currentPlanet()), "_blank");
    };

    GameDesigner.prototype.load = function() {
      var game, planet;
      game = app.Universe.Games[$('.games').val()];
      planet = game.Planets[$('.planets').val()];
      this.width(app.MapLoader.getWidth(planet.Map));
      this.width(app.MapLoader.getHeight(planet.Map));
      this.planetName(planet.Name);
      this.gameName(game.Name);
      this.bolts(planet.BoltsToBeCollected);
      return this.lives(game.StartingNumberOfLives);
    };

    return GameDesigner;

  })();

}).call(this);

//# sourceMappingURL=GameOptions.map
