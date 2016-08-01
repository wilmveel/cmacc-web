$ deal = {
    "disputeNoticeWithindays" : "5 days",
    "deliveryClaimDelay" : "24 hours",
    "deliveryPaymentTimeSpan" = "48 hours"
    "escrowFee" : "$1.50"
}

$ seller = [./id/Gerrys_Grapes_llc.md]

$ escrow = [./id/Safe_Hands_inc.md]

$ shipper = [./id/Fabulous_Express_inc.md]

$ arbitrator = [./id/Solomon_Shirley.md]

$ purchaser = [./id/_Party.md]

$ form = [./form/Escrow.md] => {
    "deal": deal,
    "seller" : seller,
    "escrow" : escrow,
    "shipper" : shipper,
    "arbitrator" : arbitrator,
    "purchaser" : purchaser,
}

{{form}}