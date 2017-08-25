const fs = require('fs');
const path = require('path');
const uglify = require('rollup-plugin-uglify');
const uglifyjs = require('uglify-js');

fs.writeFileSync(path.resolve(process.cwd(), './dist/xcookie.html'),
    fs.readFileSync(path.resolve(process.cwd(), './src/xcookie.html'), 'utf8').replace(
        '/* xcookie.js */',
        uglifyjs.minify(fs.readFileSync(path.resolve(process.cwd(), './src/xcookie.js'), 'utf8'), {
            mangle: {
                reserved: ['HostWhitelist', 'CookieWhitelist'],
                ie8: true
            }
        }).code
    )
);

module.exports = {
    input: 'src/index.js',
    name: 'iframexcookie',
    output: {
        file: 'dist/xcookie.js',
        format: 'umd'
    },
    plugins: [
        uglify({
            // mangle: false,
            ie8: true
        })
    ]
};
