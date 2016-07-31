$ party1 = [./MarcDangeard.md]

$ party2 = [./WillemVeelenturf.md]

$ content = [./draft1.md] => {
	"misc" : misc,
	"party2" : party2
}

$ intro = [./intro.md]

$ who = [./who.md] => {
	"party1" : party1,
	"party2" : party2
}

$ misc = [./general_clauses.md]

$ closing = [./closing.md] => {
	"party1" : party1,
	"party2" : party2
}

{{intro}}

1. {{who}}

2. {{misc.clause2}}

{{closing}}
