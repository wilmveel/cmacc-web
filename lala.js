var mergeJson = require("merge-json");

var obj1 = {
    "obj": {
        "hello": "Hello"
    }
};

var obj2 = {
    "obj": {
        "hello": "Hello"
    }
};

mergeJson.merge(obj1, null)