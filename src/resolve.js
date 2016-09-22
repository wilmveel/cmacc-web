function resolve(obj) {
    if (obj && obj.text && obj.vars) {
        var keys = Object.keys(obj.vars);
        for (var i = 0; i < keys.length; i++) {

            if (obj.vars[keys[i]] && obj.vars[keys[i]].vars) {

                // replace vars in vars
                var vars = Object.keys(obj.vars[keys[i]].vars);
                for (var j = 0; j < vars.length; j++) {
                    if (typeof obj.vars[keys[i]].vars[vars[j]] === 'string') {
                        obj.vars[keys[i]].vars[vars[j]] = replaceVars(obj.vars[keys[i]].vars[vars[j]], obj.vars[keys[i]]);
                    }
                }

                obj.vars[keys[i]] = resolve(obj.vars[keys[i]]);

            }

            // replace vars in text
            obj.text = replaceVars(obj.text, obj);

        }
        return obj.text;
    }
    return obj;
}

function replaceVars(str, obj) {

    return str.replace(/{{\w+.\w+}}/g, function (x) {
        var qry = x.slice(2, -2);
        var val = findInAst(qry, obj);
        return resolve(val);
    });

}

function findInAst(qry, ast) {

    var spl = qry.split('.');
    var cur = ast.vars;

    spl.forEach(function (str) {

        if (cur && cur[str])
            return cur = cur[str];

        if (cur && cur.vars && cur.vars[str])
            return cur = cur.vars[str];

        return cur = null
    });

    if (!cur)
        cur = '!!' + qry + '!!';

    return cur;

}

module.exports = resolve;
