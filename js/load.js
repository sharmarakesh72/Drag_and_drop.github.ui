class Load {
    static imagesToLoad(number) {
        if (!Load.numberOfImages) {
            Load.numberOfImages = 0;
        }
        Load.numberOfImages += number;

        Load.addPercentage();

        if (Load.isLoaded()) {
            Load.hide();
        }
    }

    static imageLoaded() {
        if (!Load.numberOfImagesLoaded) {
            Load.numberOfImagesLoaded = 0;
        }
        Load.numberOfImagesLoaded++;

        Load.addPercentage();

        if (Load.isLoaded()) {
            Load.hide();
        }
    }

    static isLoaded() {
        return Load.numberOfImages === Load.numberOfImagesLoaded;
    }

    static addPercentage() {
        var percentageToShow = parseInt((Load.numberOfImagesLoaded / Load.numberOfImages) * 100);
        if (percentageToShow > 0) {
            percentageToShow += '%';
            if (Load.progressBar) {
                Load.progressBar.children().css('width', percentageToShow);
            }
            else {
                this.percentageToShow = percentageToShow;
            }
        }
    }

    static preloadLoad() {
        Load.load = $('<div>', {id: 'load'});

        Load.progressBar = $('<div>', {id: 'load-progress'}).append($('<div>', {id: 'load-progress-bar'}));

        Load.addPercentage();

        Load.load.append($('<div>', {class: "loading"}).append($('<p>', {text: Locale.get('game', '_loading_game')})).append(Load.progressBar));
        Load.show();
    }

    static getLoad() {
        return Load.load;
    }

    static hide() {
        Load.load.css("display", "none");
    }

    static show() {
        Load.load.css("display", "block");
    }
}
