$ test1 = "ld"

$ test2 = {
    "test" : "Wor"
}

$ test3 = [../../doc/Object.md]

$ obj = {
    "hel" : test2.test,
    "lo" : test1
}

$ test4 = [../../doc/Object.md] => {
    "obj": obj
}

1 - Hello Wor{{test1}}

2 - Hello {{test2.test}}ld

3 - {{test3}}

4 - {{test4}}
