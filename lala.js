var mergeJson = require("merge-json");

var obj1 = {
    "obj": {
        "hello": null
    }
};

var obj2 = {
    "obj": {
        "hello": 123
    }
};

var res = mergeJson.merge(obj1, obj2);

console.log(res)