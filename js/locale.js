class Locale {

    static get(domain, locale, ...words) {
        locale = Locale.locales[Locale.current][domain][locale];
        for (var i in words) {
            var word = words[i];
            locale = locale.replace(/%s/, word);
        }
        return locale;
    }

    static getLanguage() {
        return Locale.current;
    }

    static setLanguage(lang) {
        if (!lang) {
            //lang = window.top.document.getElementsByTagName('html')[0].getAttribute('lang') || 'pl';
            lang = 'pl';
        }
        Locale.current = lang;
    }

    static getLanguages() {
        return Object.keys(Locale.locales);
    }
}

Locale.locales = {};
