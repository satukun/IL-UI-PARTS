    var project = require('../project.json');
    exports.func = function() {
        for (var name in project) {
            if (project[name] === true) {
                work = name;
            }
        }
        var dir = {
            "src": "_src",
            "dist": "_dist",
            "deploy": "deploy"
        }
        var develop = {
            "data": '_src/_develop/' + work + '/'
        }
        var path = {
            "html": [dir.src + "/**/*.html", "!" + dir.src + "/**/*min.html"],
            "scss": dir.src + "/_develop/" + work + "/**/*.scss",
            "ejs": dir.src + "/_develop/" + work + "/**/*.ejs",
            "ejsbase": dir.src + "/_common/**/*.ejs",
            "css": dir.src + "/deploy/" + work + "/**/*.css",
            "js": dir.src + "/_develop/" + work + "/**/*.js",
            "jsdep": dir.src + "/deploy/" + work + "/**/*.js",
            "img": [dir.src + "/_develop/" + work + "/**/*.jpg", dir.src + "/_develop/" + work + "/**/*.gif", dir.src + "/_develop/" + work + "/**/*.png", "!" + dir.src + "/_develop/" + work + "/**/sprites/*.png"],
            "sprites": dir.src + "/_develop/" + work + "/**/sprites/*.png"
        }
        return {
            "work": work,
            "dir": dir,
            "develop": develop,
            "path": path
        };
    };