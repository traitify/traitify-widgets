var fs = require('fs');
var js = fs.readFileSync('./build/bundle.js', 'utf8');
var css = fs.readFileSync('./build/style.css', 'utf8');

var css = css.replace(/\'/g, '"').replace(/\n/g, '');

var output = `${js}\n; document.write('<style>${css}</style>');`;

fs.writeFileSync('./build/taco.js', output);
