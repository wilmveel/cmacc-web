function render(obj) {
    console.log(obj);
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
