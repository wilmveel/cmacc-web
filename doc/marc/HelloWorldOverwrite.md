//This is the form calling the contract template and filling out the name of the party

$ content = [./HelloWorld.md] => {
	"person.name" : "Pierre",
	"person.city" : "London"
}

{{content}}