function resolve(obj){
    if (obj && obj.text && obj.vars) {
        var keys = Object.keys(obj.vars);
        for (var i = 0; i < keys.length; i++) {
            if (obj.vars[keys[i]].vars) {
                obj.vars[keys[i]] = resolve(obj.vars[keys[i]]);
            }
            obj.text = obj.text.replace(/{{\w+.\w+}}/g, function(x) {
                var qry = x.slice(2, -2);
                var val = findInAst(qry, obj);

                if(!val)
                    val = '!!' + qry + '!!';

                return resolve(val);
            });
        }
        return obj.text;
    }
    return obj;
}

function findInAst(qry, ast){

    var spl = qry.split('.');
    var cur = ast.vars;

    spl.forEach(function(str){

        if(cur[str])
            return cur = cur[str];
        if (cur.vars[str])
            return cur = cur.vars[str];

        return cur = null
    });

    return cur;

}

module.exports = resolve;
