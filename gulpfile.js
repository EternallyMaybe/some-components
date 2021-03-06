import { lstatSync } from 'fs';

require('shelljs/global');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const buffer = require('vinyl-buffer');
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

/*
 * 转移第三方模块到static目录
 */
const spritesPath = path.join(__dirname, 'src/assets/sprites');

let spritesArr = [];

(function(dir)　{
    let filesList = [];
    fs.readdir(dir).forEach(name => {
        const spritesFile = path.join(spritesPath, `${name}`);
        const stats = fs.lstatSync(spritesFile);
        if(stats.isFile() && /png$/.test(name)) {
            fileList.push(spritesFile);
        } else if (stats.isDirectory() && fs.readdirSync(spritesFile).length) {
            const gulpTask = `sprites:${name}`;
            spritesArr.push(gulpTask);
            gulp.task(gulpTask, () => {
                let spritesData = gulp.src(path.join(spritesFile, '*.png'))
                    .pipe(spritesmith({
                        imgName: `${name}_icon.png`,
                        imgPath: `${name}_icon.png`,
                        cssName: `_${name}_icon.scss`,
                    }));
                spritesData.css
                    .pipe(gulp.dest(path.join(__dirname, 'src/assets/css')));
                spritesData.img
                    .pipe(buffer())
                    .pipe(imagemin())
                    .pipe(gulp.dest(path.join(__dirname, './static/img/')))
            });
        }
    });
    if (filesList.length) {
        spritesArr.push('sprites:app');
        gulp.task('sprites:app', () => {
            let spritesData = gulp.src(filesList)
                .pipe(spritesmith({
                    imgName: `app_icon.png`,
                    imgPath: `/img/app_icon.png`,
                    cssName: `_app_icon.scss`,
                }));
            spritesData.css
                .pipe(gulp.dest(path.join(__dirname, 'src/assets/css')));
            spritesData.img
                .pipe(buffer())
                .pipe(imagemin())
                .pipe(gulp.dest(path.join(__dirname, './static/img/')))
        });
    }
})(spritesPath);

gulp.task('sprites', spritesArr);

/**
 * scss:single 不依赖图片的合并
 */
gulp.task('scss:single', () => {
    gulp.src(path.resolve(spritesPath, '../css/*.scss'))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(path.join(__dirname, 'static/css')));
})

gulp.task('watch:scss', () => {
    gulp.watch('src/assets/css/*.scss', ['scss:single']);
})

gulp.task('scss', ['sprites'], () => {
    gulp.src(path.resolve(spritesPath, '../css/*.scss'))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(path.join(__dirname, 'static/css')));
})

gulp.task('img', () => {
    gulp.src(path.join(__dirname, 'src/assets/img/*.png'))
        .pipe(buffer())
        .pipe(imagemin({
            optimizationLevel: 7,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.join(__dirname, './static/img/')));
    gulp.src(path.join(__dirname, 'src/assets/img/*.jpg'))
        .pipe(buffer())
        .pipe(gulp.dest(path.join(__dirname, './static/img/')))
})
