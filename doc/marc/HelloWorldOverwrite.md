//This is the form calling the contract template and filling out the name of the party

$ person = {
    "name" : "Willem",
    "city" : "Utrecht"
}

$ content = [./HelloWorld.md] => {
	"person" : person
}

{{content}}