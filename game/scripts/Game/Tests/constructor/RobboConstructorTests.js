// Generated by CoffeeScript 1.7.1
(function() {
  var app, givenConstructor, _ref;

  window.app = (_ref = window.app) != null ? _ref : {};

  app = window.app;

  module('RobboConstructor tests');

  givenConstructor = function() {
    return new app.RobboConstructor(app.TestUniverse, $('.game-designer').clone());
  };

  test("Load universe data when created", function() {
    var constructor;
    constructor = givenConstructor();
    ok(constructor.games().length > 0, "RobboConstructor loads games");
    ok(constructor.planets().length > 0, "RobboConstructor loads planets");
  });

  test("Simplified access to selected game and planet", function() {
    var constructor, n1;
    constructor = givenConstructor();
    ok(constructor.game() != null, "Allows easy access to selected game");
    ok(constructor.planet() != null, "Allows easy access to selected planet");
    n1 = constructor.planet().name();
    constructor.planetId(1);
    ok(constructor.planet() != null, "Allows easy access to selected planet after selected planet changes");
    notEqual(n1, constructor.planet().name(), "Name of newly selected planet is different then the first planet");
  });

  test("Planet is updated on main list of games when edited from 'planet' property", function() {
    var constructor, newPlanetName, planet;
    constructor = givenConstructor();
    newPlanetName = "my planet";
    constructor.planet().name(newPlanetName);
    planet = constructor.games()[0].planets()[0];
    equal(planet.name(), newPlanetName, "Changing name of the planet on 'planet' property changes original planet in games collection");
  });

  test("Changing game", function() {
    var constructor, n1;
    constructor = givenConstructor();
    n1 = constructor.game().name();
    constructor.planetId(1);
    constructor.gameId(1);
    equal(constructor.planetId(), 0, "When changing game sets current planet to first one");
    notEqual(n1, constructor.game().name(), "When changing game current game name changes");
  });

}).call(this);
