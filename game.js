var tilePixelWidth = 64;
var tilePixelHeight = 64;
var tileWidth = 15;
var tileHeight = 8;

var startGame = function() {
    var gameWidth = tileWidth * tilePixelWidth;
    var gameHeight = tileHeight * tilePixelHeight;
    Crafty.init(gameWidth, gameHeight);
    Crafty.background('green');
    makeMap();
}

var makeMap = function() {
    for (var x = 0; x < tilePixelWidth; ++x) {
        for (var y = 0; y < tilePixelHeight; ++y) {
            Crafty.e('Tile').create(x, y);
        }
    }
};

Crafty.c('Tile', {
    init: function() {
        this.requires('2D, Canvas, Grid, Color');
        this.color(randomColor());
        this.attr({
            w: tilePixelWidth,
            h: tilePixelHeight,
        })
    },

    create: function(x, y) {
        this.attr({
            x: x * tilePixelWidth,
            y: y * tilePixelHeight,
        });
        return this;
    }
});

var randomColor = function() {
    var random255 = function() {
        return Math.floor(Math.random() * 255);
    }
    var r = random255();
    var g = random255();
    var b = random255();
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
}
