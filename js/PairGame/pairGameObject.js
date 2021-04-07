class PairGameObject extends GameObject {
    constructor(val, name, id, game) {
        super(game);
        this.id = id;
        this.val = game.getFolder() + val;
        this.name = name;
        this.image = this.createImage(id, this.val);
        this.title = this.createTitle(id, this.name);
        this.loadLocale();
        this.matched = false;
    }

    createImage(id, src) {
        return $("<div>", {id: src, class: "image draggable left yes-drop dropzone"}).append($("<img>", {
            src: src,
            alt: src
        }));
    }

    createTitle(id, text) {
        return $("<div>", {id: text, class: "title draggable right yes-drop dropzone"}).append($("<div>"));
    }

    attach(item) {
        if (item === 'image') {
            this.getGame().getGameArea().append(this.image);
        }
        if (item === 'title') {
            this.getGame().getGameArea().append(this.title);
        }
    }

    markAsMatched() {
        if (++this.getGame().matched == this.getGame().gameObjects.length) {
            clearInterval(this.getGame().timeInterval);
            Snackbar.show("success", '_success');
        }
        this.getGame().addScore();
        this.title.remove();
        this.image.append(this.title.children("div"));
        this.image.removeClass('dragged-in');
        this.image.removeClass('dropzone');
        this.image.removeClass('yes-drop');
    }

    loadLocale() {
        super.loadLocale();
        this.title.children('div').text(Locale.get('title', this.name));
        this.image.children('div').text(Locale.get('title', this.name));
    }
}
