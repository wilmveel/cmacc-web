$ purchaser = [./id/Roberta_Robinson.md]

$ order = {
    "description" : "eighteen cases of grape preserves",
    "price" : "$650.00",
    "pickupTimeMax" : "2014-08-15",
    "escrowSignYMD" : "2014-08-13",
    "escrowEffectiveYMD" : "2014-08-13"
}
    
$ parties = [./Step_1_Parties.md] => {
    "purchaser" : purchaser,
    "order" : order
}

{{parties}}