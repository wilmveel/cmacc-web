function resolve(obj){
    if (obj && obj.text && obj.vars) {
        var keys = Object.keys(obj.vars);
        for (var i = 0; i < keys.length; i++) {
            if (obj.vars[keys[i]].vars) {
                obj.vars[keys[i]] = resolve(obj.vars[keys[i]]);
            }
            obj.text = obj.text.replace(/{{\w+.\w+}}/g, function(x) {
                return resolve(eval('obj.vars.' + x.slice(2, -2)));
            });
        }
        return obj.text;
    }
    return obj;
}

module.exports = resolve;
