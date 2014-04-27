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
};

Crafty.c('TileBoard', {
    init: function() {
        var draggable = Crafty.e('DraggableTiles');
        var tiles = Crafty.e('TileMap');
        draggable.bind('TileDragStart', function(e) {
            console.log('TileDragStart: {x: ' + e.x + ', ' + 'y: ' + e.y + '}');
        });
        draggable.bind('TileDragEnd', function(e) {
            console.log(
                'TileDragEnd: ' +
                    '{x: ' + e.x + ', ' +
                    'y: ' + e.y + ', ' +
                    'direction:' + e.direction + '}'
            );
        });
        draggable.bind('TileDragging', function(e) {
            console.log(
                'TileDragging!: ' +
                    '{direction: ' + e.direction + ', ' +
                    'delta: ' + e.delta + ', ' +
                    'index: ' + e.index + '}'
            );
        });
    },
});

Crafty.c('DraggableTiles', {
    init: function() {
        this.requires('2D, DragEvent');
        var boardWidth = tileWidth * tilePixelWidth;
        var boardHeight = tileHeight * tilePixelHeight;
        this.attr({x: 0, y: 0, w: boardWidth, h: boardHeight});
        this._moving = false;
        this._direction = null;
        this._start = null;
        this.bind('DragStart', function(e) {
            if (this._moving === true) {
                console.log("We shouldn't start dragging when we are already dragging!");
                return;
            }
            this._start = this._tileConvert(e);
            this.trigger('TileDragStart', this._start);
            this._moving = true;
        });
        this.bind('DragEnd', function(e) {
            if (this._moving === false) {
                console.log("We shouldn't stop dragging when we haven't started!");
                return;
            }
            var oldDirection = this._direction;
            this.trigger('TileDragEnd', conj(
                this._tileConvert(e), 'direction', oldDirection));
            this._moving = false;
            this._direction = null;
            this._start = null;
        });
        this.bind('Dragging', function(e) {
            if (this._moving === false) {
                console.log("We shouldn't stop dragging when we haven't started!");
                return;
            }
            if (this._direction === null) {
                this._direction = this._findDirection(e);
            }

            this.trigger('TileDragging', this._createDraggingEvent(e));
        });
    },

    _tileConvert: function(m) {
        return {x: m.x / tilePixelWidth, y: m.y / tilePixelHeight};
    },

    _findDirection: function(m) {
        var delta = this._tileDelta(m);
        if (delta.x === 0 && delta.y === 0) {
            console.log('We are trying to set a direction for a nonmovement.');
        }
        if (Math.abs(delta.x) >= Math.abs(delta.y)) {
            return 'horizontal';
        } else {
            return 'vertical';
        }
    },

    _createDraggingEvent: function(m) {
        var delta = this._tileDelta(m);
        if (this._direction === 'horizontal') {
            return {
                direction: this._direction,
                delta: delta.x,
                index: Math.floor(this._start.y)
            };
        } else {
            return {
                direction: this._direction,
                delta: delta.y,
                index: Math.floor(this._start.x)};
        }
    },

    _tileDelta: function(m) {
        var nLoc = this._tileConvert(m);
        return {
            x: this._start.x - nLoc.x,
            y: this._start.y - nLoc.y
        };
    }

});






Crafty.c('Tile', {
    init: function() {
        this.requires('2D, Canvas, Grid, Color');
        this.color(randomColor());
        this.attr({
            w: tilePixelWidth,
            h: tilePixelHeight
        });
    },

    create: function(x, y) {
        this.attr({
            x: x * tilePixelWidth,
            y: y * tilePixelHeight
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
        this.bind('MouseUp', function(e) {
            if (this._pressed === false) {
                console.log("We shouldn't be releasing when we aren't pressed!");
                return;
            }
            this._pressed = false;
            this.trigger('DragEnd', e);
        });
        this.bind('MouseMove', function(e) {
            if (this._pressed === false) return;

            this.trigger('Dragging', e);
        });
    }
});

Crafty.c('TileMap', {
    init: function() {
        this._makeMap();
    },

    _makeMap: function() {
        this._map = [];
        for (var x = 0; x < tilePixelWidth; ++x) {
            for (var y = 0; y < tilePixelHeight; ++y) {
                if (y === 0) {
                    this._map[x] = [];
                }
                this._map[x][y] = Crafty.e('Tile').create(x, y);
            }
        }
    }
});



var randomColor = function() {
    var random255 = function() {
        return Math.floor(Math.random() * 255);
    };
    var r = random255();
    var g = random255();
    var b = random255();
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
};

var conj = function(obj, k, v) {
    var props = {};
    props[k] = {value: v};
    return Object.create(obj, props);
};
