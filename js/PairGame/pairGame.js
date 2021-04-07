class PairGame extends Game {
    constructor(gameAreaId, version, className) {
        super(gameAreaId, version, className);

        this.zIndex = 0;
        this.matched = 0;

        this.horizontalOffset = PairGame.horizontalOffset;
        this.verticalOffset = PairGame.verticalOffset;

        Snackbar.addCallback(function () {
            GameManager.get().setTimer();
            GameManager.get().setScores();
        });

        for (var i in PairGame.sources) {
            var entry = PairGame.sources[i];
            if (entry.fileName.match(/\.(jpe?g|png|gif)$/)) {
                this.gameObjects.push(new PairGameObject(entry.fileName, entry.title, i, this));
            }
        }

        var shuffle = function (array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        var numberOfImages = this.gameObjects.length;

        var imageObject = this.gameObjects[0];

        this.maxHeight = Math.floor(this.getGameArea().outerHeight(true) / this.verticalOffset);
        this.offset = (this.getGameArea().outerHeight(true) - ((Math.floor(this.maxHeight) - 1) * this.verticalOffset + imageObject.image.outerHeight(true))) / 2;
        this.maxHeight = Math.ceil(numberOfImages / Math.ceil(numberOfImages / this.maxHeight));


        shuffle(this.gameObjects);
        for (var i in this.gameObjects) {
            entry = this.gameObjects[i];
            entry.attach('image');
            this.move(entry.image, i);
        }
        shuffle(this.gameObjects);
        for (var i in this.gameObjects) {
            entry = this.gameObjects[i];
            entry.attach('title');
            this.move(entry.title, i);
        }
    }

    move(item, i) {
        i = parseInt(i);
        var sign = item.hasClass('right') ? -1 : 1;
        var x = sign * Math.ceil(((i + 1) / this.maxHeight) - 1) * this.horizontalOffset;
        var y = this.offset + Math.ceil(((i + 1) % (this.maxHeight + 0.0001)) - 1) * Math.max(this.verticalOffset, this.getGameArea().outerHeight(true) / (this.maxHeight + 1));
        // translate the element
        item.css('transform', 'translate(' + x + 'px, ' + y + 'px)');
        item.css('webkitTransform', item.css('transform'));

        // update the posiion attributes
        item.attr('data-x', x);
        item.attr('data-y', y);
    }

    static loadImages() {
        for (var i in PairGame.sources) {
            var entry = PairGame.sources[i];
            if (entry.fileName.match(/\.(jpe?g|png|gif)$/)) {
                var img = new Image;
                img.addEventListener('load', function () {
                    Load.imageLoaded();
                });
                img.src = Game.folder + entry.fileName;
                img.style.display = "none";
                $('body').append(img);
            }
        }
        return PairGame.sources.length;
    }

    setTimer() {
        if (!this.timeInterval) {
            var start = new Date;
            var timer = $('<div>', {class: 'timer left'}).append('0:00');
            this.getGameArea().append(timer);

            this.timeInterval = setInterval(function () {
                var time = parseInt((new Date - start) / 1000);
                timer.text(parseInt(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + time % 60);
            }, 1000);
        }
    }

    addScore() {
        this.scores.text(this.matched);
    }

    setScores() {
        if (!this.scores) {
            this.scores = $('<div>', {class: 'scores right'}).append('0');
            this.getGameArea().append(this.scores);
        }
    }

    getZIndex() {
        return ++this.zIndex;
    }

    match(element1, element2) {
        for (var i = 0; i < this.gameObjects.length; i++) {
            var entry = this.gameObjects[i];
            if ((entry.image[0] === element1 && entry.title[0] === element2) || (entry.image[0] === element2 && entry.title[0] === element1)) {
                entry.markAsMatched();
                return true;
            }
        }
        return false;
    }
}
