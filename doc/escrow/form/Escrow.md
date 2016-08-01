$ delivery = {
    "disputeNoticeWithindays" : null,
    "deliveryClaimDelay" : null,
    "deliveryPaymentTimeSpan" = null,
}

$ order = {
    "YMD" : null,
    "disputeNoticeWithindays" : null,
    "deliveryClaimDelay" : null,
    "deliveryPaymentTimeSpan" = null,
    "escrowFee" : null
}

$ signature = {
    "YMD" : null,
    "disputeNoticeWithindays" : null,
    "deliveryClaimDelay" : null,
    "deliveryPaymentTimeSpan" = null,
    "escrowFee" : null
}

$ purchaser = [../id/_Party.md]

$ escrow = [../id/_Party.md]

$ seller = [../id/_Party.md]

$ NEAPurchaser = [./NEA_Person.md] => {"party" : purchaser}
$ NEAEscrow = [./NEA_Person.md] => {"party" : escrow}
$ NEASeller = [./NEA_Person.md] => {"party" : seller}

$ secDeposit = [../sec/Deposit.md]
$ secPickup = [../sec/Pickup.md] => {"timeMax":timeMax}
$ secRelease = [../sec/Release.md]
$ secCancellation = [../sec/Cancellation.md]
$ secClaim = [../sec/Claim.md]
$ secRelianceByEscrow = [../sec/RelianceByEscrow.md]
$ secIndemnEscrow = [../sec/IndemnEscrow.md]
$ secAgentSubmitDispute = [../sec/AgentSubmitDispute.md]
$ secAgentFee = [../sec/AgentFee.md] => {"fee" : deal.escrowFee}
$ secArbitratorFee = [../sec/ArbitratorFee.md] => {"fee" : deal.escrowFee}
$ secSuccessor = [../sec/Successor.md]
$ secAgentLimitLiab = [../sec/AgentLimitLiab.md]
$ secArbitration = [../sec/Arbitration.md] => {
    "DisputeNoticeWithindays" : deal.disputeNoticeWithindays
    "ARBSeatCity" : "123"
    "ARBOrg" : "123"
    "ARBCourtCountyState" : "123"
}
$ secLaw = [../sec/Law.md]
$ secNotice = [../sec/Notice.md]
$ secTechTrumps = [../sec/TechTrumps.md]

ESCROW AGREEMENT

This escrow agreement ("Escrow Agreement") is made and entered into on {{deal.YMD}} by and among:

- {{NEAPurchaser}} ("Purchaser"),
- {{NEAEscrow}} ("Escrow Agent"),
- {{NEASeller}} ("Seller"),

NOW, THEREFORE, in consideration of the mutual premises and conditions contained herein, the Purchaser, the Seller and the Escrow Agent do hereby agree as follows:

1. {{secDeposit}}
2. {{secPickup}}
3. {{secRelease}}
4. {{secCancellation}}
5. {{secRelianceByEscrow}}
6. {{secIndemnEscrow}}
7. {{secAgentSubmitDispute}}
8. {{secAgentFee}}
9. {{secArbitratorFee}}
10. {{secAgentLimitLiab}}
11. {{secArbitration}}
12. {{secLaw}}
13. {{secNotice}}
14. {{secTechTrumps}}

IN WITNESS WHEREOF, the undersigned being all the parties to this Escrow Agreement have hereunto set their hands.