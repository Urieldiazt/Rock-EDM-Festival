const {src , dest, watch, parallel} = require("gulp");

//Dependencias de css
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const tercer = require('gulp-terser-js');

//Dependencias de imagenes
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin');
const imgenvif = require('gulp-avif');
const webp = require('gulp-webp');


function css(done) {
   
    src('src/scss/**/*.scss') // Identificar el archivo de SASS
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())// Compilar
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'));//Almacenar en disco duro

    done(); // callback que avisa a gulp cunado llegamos al final
}

function imagenes(done){
    const opciones = {
        optimizationLevel:3 
    };

    src('src/img/**/*.{png,jpg}') //Identifica formatos de imagne png,jpg
    .pipe(cache(imagemin(opciones))) //Opcion de calidad de la imagen
    .pipe(dest('build/img')); //Almacena en el disco duro

    done();
}

function versionWebp(done){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}') //Identifica formatos de imagne png,jpg
    .pipe(webp(opciones)) //Opcion de calidad de la imagen
    .pipe(dest('build/img')); //Almacena en el disco duro

    done();
}


function versionAvit(done){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}') //Identifica formatos de imagne png,jpg
    .pipe(imgenvif(opciones)) //Opcion de calidad de la imagen
    .pipe(dest('build/img')); //Almacena en el disco duro

    done();
}

function javascript(done){
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(tercer())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))

    done();
}

function dev(done){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done(); // callback que avisa a gulp cunado llegamos al final
}

exports.css = css; 
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvit = versionAvit;
exports.dev = parallel(css, imagenes, versionWebp, versionAvit,javascript, dev);