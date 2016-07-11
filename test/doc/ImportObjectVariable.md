$ hel = "Hel"

$ lo = {
    "test" : "lo"
}

@ text = [./Object.md] => {
    "obj": {
        "hel" : hel,
        "lo" : lo.test
    }
}

{{text}}