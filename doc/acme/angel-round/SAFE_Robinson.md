$ amount = "$50,000"

$ ymd = "September 27, 2015"

$ valuationCap = "$2,000,000"

$ discount = "8%"

$ company = {
	"fullName" : "Acme Inc.133"
	"nea" : null
}

$ investor = {
	"fullName" : "Roberta Robinson"
}

$ test = "HEllo"

$ def = [../../com/ycombinator/safe/sec/defined_terms.md] => {
	"Company" : "Willem"
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

