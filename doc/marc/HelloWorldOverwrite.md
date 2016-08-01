//This is the form calling the contract template and filling out the name of the party

$ person = [./MarcDangeard.md]

$ content = [./HelloWorld.md] => {
	"person" : person
}

{{content}}