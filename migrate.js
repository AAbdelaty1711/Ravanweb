const fs = require('fs');
const html = fs.readFileSync('oldlandingpage.html', 'utf-8');

const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
  fs.writeFileSync('app/landing.css', cssMatch[1].trim());
  console.log('CSS extracted to app/landing.css');
}

const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (jsMatch) {
  fs.writeFileSync('landing-script.js', jsMatch[1].trim());
  console.log('JS extracted to landing-script.js');
}

const bodyMatch = html.match(/<body>([\s\S]*?)<script>/);
if (bodyMatch) {
  fs.writeFileSync('landing-body.html', bodyMatch[1].trim());
  console.log('Body extracted to landing-body.html');
}
