$ amount = "$50,000"

$ ymd = "September 27, 2015"

$ valuationCap = "$2,000,000"

$ discount = "10%"

$ company = {
	"fullName" : "Acme Inc."
	"nea" : null
}

$ investor = {
	"fullName" : "Roberta Robinson"
}

$ test = "HEllo"

$ def = [../../com/ycombinator/safe/sec/defined_terms.md] => {
	"Capital_Stock" : "<span class=\"definedterm\">Capital Stock123</span>"
	"Company" : "Willem"
	"Valuation_Cap" : "<span class=\"definedterm\">Valuation Cap123456</span>"
}

$ event = [../../com/ycombinator/safe/sec/event.md] => {
	"def" : def
	"event_equity" : test
}

$ ycombinator = [../../com/ycombinator/safe/form/cap_discount.md] => {
	"amount" : amount
	"ymd" : ymd
	"discount" : discount
	"valuationCap" : valuationCap
	"company" : company
	"investor" : investor
	"def" : def
}

{{ycombinator}}

