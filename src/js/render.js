var path = require('path');

function render(ast) {
    var doc = '';
    if (ast.length > 0) {
        for (var i = 0; i < ast.length; i++) {
            doc += render(ast[i]);
        }
    } else {
        doc += renderObj(ast);
    }
    return doc;
}

function renderObj(obj) {
    var text = '';
    if (obj.text && obj.text.text) {
        text += render(obj.text);
    } else if(obj.type === 'p') {
        text += obj.text + '\n\n';
    } else if (obj.type === 'title') {
        text += obj.text + '\n===\n';
    } else {
        text += obj.text;
    }

    return text;
}

module.exports = render;