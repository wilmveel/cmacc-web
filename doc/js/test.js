var test1 = "World!";

var test2 = {
    "test": "Wor"
};

var test3 = {
    "file": "../../doc/js/object.js",
    "vars": {
        "firstName": "Test"
    }
};

var person = {
    "firstName": "Jane",
    "lastName": "Do"
};

var test4 = {
    "file": "../../doc/js/object.js",
    "vars": {
        "firstName": person.firstName,
        "lastName": person.lastName
    }

};

module.exports = [
    {
        "text": "Hello " + test1,
        "type": "p"
    }, {
        "text": "Hello " + test2.test + "ld",
        "type": "p"
    }, {
        "text": test3,
        "type": "p"
    }, {
        "text": test4,
        "type": "p"
    }
];
