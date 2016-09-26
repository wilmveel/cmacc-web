function resolve(obj) {
    if (obj && obj.$$text$$) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {

            if (obj[keys[i]] && obj[keys[i]]) {

                // replace vars in vars
                var vars = Object.keys(obj[keys[i]]);
                for (var j = 0; j < vars.length; j++) {
                    if (typeof obj[keys[i]][vars[j]] === 'string') {
                        obj[keys[i]][vars[j]] = replaceVars(obj[keys[i]][vars[j]], obj[keys[i]]);
                    }
                }

                obj[keys[i]] = resolve(obj[keys[i]]);

            }

            // replace vars in text
            obj.$$text$$ = replaceVars(obj.$$text$$, obj);

        }
        return obj.$$text$$;
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
    var cur = ast;

    spl.forEach(function (str) {

        if (cur && cur[str])
            return cur = cur[str];

        return cur = null
    });

    if (!cur)
        cur = '!!' + qry + '!!';

    return cur;

}

module.exports = resolve;
