var tilePixelWidth = 64;
var tilePixelHeight = 64;
var tileWidth = 15;
var tileHeight = 8;

var startGame = function() {
    var gameWidth = tileWidth * tilePixelWidth;
    var gameHeight = tileHeight * tilePixelHeight;
    Crafty.init(gameWidth, gameHeight);
    Crafty.background('green');
    Crafty.e('TileBoard');
}

Crafty.c('TileBoard', {
    init: function() {
        this.requires('2D, DragEvent');
        var boardWidth = tileWidth * tilePixelWidth;
        var boardHeight = tileHeight * tilePixelHeight;
        this.attr({x: 0, y: 0, w: boardWidth, h: boardHeight});
        this._makeMap();
        this.bind('DragStart', function(e) {
            console.log('Drag Started!\n' + e);
        });
    },

    _makeMap: function() {
        for (var x = 0; x < tilePixelWidth; ++x) {
            for (var y = 0; y < tilePixelHeight; ++y) {
                Crafty.e('Tile').create(x, y);
            }
        }
    },
});

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

Crafty.c('DragEvent', {
    init: function() {
        this._pressed = false;
        this.requires('Mouse');
        this.bind('MouseDown', function(e) {
            if (this._pressed === true) {
                console.log("We shouldn't be pressing when we are pressed!");
                return;
            }
            this._pressed = true;
            this.trigger('DragStart', e);
        });
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
