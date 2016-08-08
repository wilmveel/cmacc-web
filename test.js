var test1 = {
    vars : "ld"
};

var test2 = {
    vars : {
        "test" : "Wor"
    }

};

var test3 = {
    file : "./Object.md",
};

var obj = {
    vars : {
        "hel" : test2.test,
        "lo" : test1
    }

};

var test4 = {
    file : "./Object.md",
    vars : {
        "obj": obj
    }

};

module.exports = "1 - Hello Wor{{test1}}\n\n2 - Hello {{test2.test}}ld\n\n3 - {{test3}}\n\n4 - {{test4}}\n"