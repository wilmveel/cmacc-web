$ party1 = [./MarcDangeard.md]

$ party2 = [./JamesHazard.md]

$ intro = [./intro.md]

$ who = [./who.md] => {
	"party1" : party1,
	"party2" : party2
}

$ what = [./what.md]

$ general = [./general_clauses.md]

$ misc = general.clause1

$ closing = [./closing.md] => {
	"party1" : party1,
	"party2" : party2
}

{{intro}}

1. {{who}}

2. {{what}}

3. {{general.clause1}}

{{closing}}