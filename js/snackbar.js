class Snackbar {
    static showMessage(type, header, message, localized = false, ...words) {
        var snackbar_body = document.getElementById("snackbar-body");
        Snackbar.message = message;
        if (!localized) {
            message = Locale.get('game', message, ...words);
            header = Locale.get('game', header);
        }

        if (type === 'success') {
            $("#johnny").attr('src', Game.folder + '/johnny-welcome.png');
        }
        else if (type === 'info') {
            $("#johnny").attr('src', Game.folder + '/johnny-welcome-info.png');
        }
        else {
            $("#johnny").attr('src', Game.folder + '/johnny-welcome-sad.png');
        }
        snackbar_body.innerHTML = "<h3 style='color: #FF9C04; width: 100%'>" + header + "</h3><p>" + (message === undefined ? '' : message) + "</p>";
    }

    static setSnackbar() {
        var modal = GameManager.get().getGameArea().find('#modal');

        modal.append($('<div>', {id: "snackbar"})
            .append($('<span>', {class: 'close'})
                .append('&times;'))
            .append($('<span>', {id: 'snackbar-body'})))
            .append($('<img>', {id: "johnny", src: Game.folder + '/johnny-welcome.png'}))
            .append($('<img>', {id: "comment", src: Game.folder + '/message.svg'}));

        modal = modal[0];

        // Get the <span> element that closes the modal
        var span = modal.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = Snackbar.hide;

        GameManager.get().addLocaleCallback(function () {
            $('#snackbar-body p').text(Locale.get('game', Snackbar.message));
        });
    }

    static addCallback(callback = function () {
    }) {
        if (!Snackbar.callbacks) {
            Snackbar.callbacks = [];
        }
        Snackbar.callbacks.push(callback);
    }

    static show(type, header, message, localized, ...words) {
        Snackbar.showMessage(type, header, message, localized, ...words);
        var modal = GameManager.get().getGameArea().find('#modal')[0];
        modal.style.display = 'block';
    }

    static hide() {
        var modal = GameManager.get().getGameArea().find('#modal')[0];
        modal.style.display = "none";
        if (Snackbar.callbacks) {
            Snackbar.callbacks.forEach(function (callback) {
                callback();
            });
        }
    }

    static isVisible() {
        return GameManager.get().getGameArea().find('#modal').css('display') === 'block';
    }

    static removeCallbacks() {
        Snackbar.callbacks = [];
    }
}
