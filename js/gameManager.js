class GameManager {
    static set(className, gameAreaId, version, withoutDropdown = false, withoutSnackbar = false, preload = true) {
        var setUp = function () {
            $("#" + gameAreaId).empty();
            GameManager.game = new className(gameAreaId, version);
            if (!withoutDropdown)
                Dropdown.setDropdown();
            if (!withoutSnackbar) {
                Snackbar.setSnackbar();
                Snackbar.show("info", '_start_header', '_start');
            }
        };

        GameManager.loadVariables(className, version);
        //Preload
        if (preload) {
            Locale.setLanguage();
            Load.preloadLoad();
            GameManager.loadImages(className);
        }

        //Load only when height of object where game is embedded is set - moodle specific
        var resourceObject = window.top.document.getElementById('resourceobject');
        if (resourceObject) {
            if (!resourceObject.style.height) {
                var observer = new MutationObserver(function (e) {
                    if (e[0].target.style.height) {
                        setUp();
                        this.disconnect();
                    }
                });
                observer.observe(resourceObject, {
                    attributes: true,
                    childList: false,
                    characterData: true,
                    subtree: false
                });
            }
            else {
                setUp();
            }

            // For moodle
            resourceObject.style.border = '0px';
        }
        else {
            setUp();
        }
    }

    static loadVariables(className, version) {
        $.each(className.versions[version], function (i, obj) {
            className[i] = obj;
        });
    }

    static get() {
        return GameManager.game;
    }

    static loadImages(className) {
        GameManager.images.forEach(function (entry) {
            var img = new Image;
            img.addEventListener('load', function () {
                Load.imageLoaded();
            });
            img.src = Game.folder + entry;
            img.style.display = "none";
            $('body').append(img);
        });

        var numberOfImagesToLoad = className.loadImages();
        Load.imagesToLoad(parseInt(GameManager.images.length) + parseInt(numberOfImagesToLoad));
    }
}

