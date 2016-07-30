$ party1 = [./MarcDangeard.md]

$ party2 = [./JamesHazard.md]

$ intro = [./intro.md]

$ who = [./who.md] => {
	"party1" : party1,
	"party2" : party2
}

$ what = [./what.md]

$ misc = [./general_clauses.md]

$ closing = [./closing.md] => {
	"party1" : party1,
	"party2" : party2
}

{{intro}}

1. {{who}}

2. {{what}}

3. {{misc.clause1}}

{{closing}}