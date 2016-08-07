function resolve(node) {
    if (node.length > 0) {
        for (var i = 0; i < node.length; i++) {
            node[i] = resolve(node[i]);
        }
    } else {
        return resolveObj(node);
    }
    return node;
}

function resolveObj(obj){
    if (obj.text && obj.text.text) {
        return resolve(obj.text);
    } else if (obj.vars) {
        var vars = Object.keys(obj.vars);
        for (var i = 0; i < vars.length; i++) {
            obj.text = obj.text.replace('{{' + vars[i] + '}}', obj.vars[vars[i]]);
        }
    }
    return obj;
}

module.exports = resolve;