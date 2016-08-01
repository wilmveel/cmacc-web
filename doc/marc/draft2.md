$ party1 = [./MarcDangeard.md]

$ party2 = [./WillemVeelenturf.md]

$ content = [./draft1.md] => {
	"intro" : intro,
	"who" : who,
	"what" : what,
	"misc" : misc,
	"closing" : closing
}

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

{{content}}