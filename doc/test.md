$ test1 = "ld"

$ test2 = {
    "test" : "Wor"
}

$ test3 = [./Object.md]

$ obj = {
    "hel" : test1,
    "lo" : test2.test
}

$ test4 = [./Object.md] => {
    "obj": obj
}

{{test3}}

{{test4}}
