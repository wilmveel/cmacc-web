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
	"sign_party1" : party1.name,
	"sign_party2" : party2.name
}


{{intro}}

1. {{who}}

2. {{what}}

3. {{misc.clause1}}

{{closing}}