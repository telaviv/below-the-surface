var tilePixelWidth = 64;
var tilePixelHeight = 64;
var tileWidth = 15;
var tileHeight = 8;
var boardWidth = tilePixelWidth * tileWidth;
var boardHeight = tileHeight * tilePixelHeight;

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
            tiles.drag(e);
        });
    }
});

Crafty.c('DraggableTiles', {
    init: function() {
        this.requires('2D, DragEvent');
        this.attr({x: 0, y: 0, w: boardWidth, h: boardHeight});
        this._moving = false;
        this._direction = null;
        this._start = null;
        this.bind('DragStart', function(e) {
            if (this._moving === true) {
                console.log("We shouldn't start dragging when we are already dragging!");
                return;
            }
            this._start = e;
            this.trigger('TileDragStart', this._tileConvert(e));
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


    _findDirection: function(m) {
        var delta = this._movementDelta(m);
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
        var delta = this._movementDelta(m);
        if (this._direction === 'horizontal') {
            return {
                direction: this._direction,
                delta: delta.x,
                index: Math.floor(this._start.y / tilePixelHeight)
            };
        } else {
            return {
                direction: this._direction,
                delta: delta.y,
                index: Math.floor(this._start.x / tilePixelWidth)
            };
        }
    },

    _movementDelta: function(m) {
        return {
            x: this._start.x - m.x,
            y: this._start.y - m.y
        };
    },

    _tileConvert: function(m) {
        return {x: m.x / tilePixelWidth, y: m.y / tilePixelHeight};
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
        for (var x = 0; x < tileWidth; ++x) {
            for (var y = 0; y < tileHeight; ++y) {
                if (y === 0) {
                    this._map[x] = [];
                }
                this._map[x][y] = Crafty.e('Tile').create(x, y);
            }
        }
    },

    drag: function(dragArgs) {
        if (dragArgs.direction === 'horizontal') {
            for(var x = 0; x < tileWidth; ++x) {
                this._map[x][dragArgs.index].x = this._horizontalPos(x, dragArgs.delta);
            }
        } else {
            for(var y = 0; y < tileHeight; ++y) {
                this._map[dragArgs.index][y].y = this._verticalPos(y, dragArgs.delta);
            }
        }
    },

    _horizontalPos: function(index, delta) {
        var halfWidth = tilePixelWidth / 2;
        var pos = tilePixelWidth * index - delta;
        if (pos < -halfWidth) {
            pos += boardWidth;
        } else if (pos > (boardWidth - halfWidth)) {
            pos -= boardWidth;
        }
        return pos;
    },

    _verticalPos: function(index, delta) {
        var halfHeight = tilePixelHeight / 2;
        var pos = tilePixelHeight * index - delta;
        if (pos < -halfHeight) {
            pos += boardHeight;
        } else if (pos > (boardHeight - halfHeight)) {
            pos -= boardHeight;
        }
        return pos;
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
