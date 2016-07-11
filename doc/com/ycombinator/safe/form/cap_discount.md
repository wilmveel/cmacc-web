$ amount = null

$ ymd = null

$ discount = null

$ valuationCap = null

$ company = null

$ investor = null

@ def = [../sec/defined_terms.md]

@ intro = [../sec/intro.md] => {
    "valuationCap" : valuationCap,
    "amount" : amount,
    "discount" : discount,
    "company" : company,
    "investor" : investor
}

@ event_equity = [../sec/event/equity.md]
@ event_liquidity = [../sec/event/liquidity.md]
@ event_dissolution = [../sec/event/dissolution.md]
@ event_termination = [../sec/event/termination.md]

@ definitions_capitalStock = [../sec/definitions/capitalStock.md]
@ definitions_changeOfControl = [../sec/definitions/changeOfControl.md]
@ definitions_companyCapitalization = [../sec/definitions/companyCapitalization.md]
@ definitions_conversionPrice = [../sec/definitions/conversionPrice.md]
@ definitions_discountPrice = [../sec/definitions/discountPrice.md]
@ definitions_distribution = [../sec/definitions/distribution.md]
@ definitions_dissolutionEvent = [../sec/definitions/dissolutionEvent.md]

@ representations_company = [../sec/representations/company.md]
@ representations_investor = [../sec/representations/investor.md]

@ sign_company = [../sec/sign/company.md] => {
    "ymd" : ymd,
    "company" : company
}

@ sign_investor = [../sec/sign/investor.md] => {
    "ymd" : ymd,
    "investor" : investor
}

@ miscellaneous = [../sec/miscellaneous.md]

{{intro}}

1. **Events**
    1. **{{def.Equity_Financing}}**  
        {{event_equity}}  
    2. **{{def.Liquidity_Event}}**  
        {{event_liquidity}}  
    3. **{{def.Equity_Financing}}**  
        {{event_dissolution}}**  
    4. **{{def.Equity_Financing}}**  
        {{event_termination}}

2. **Definitions**
    > {{definitions_capitalStock}}  
    > {{definitions_changeOfControl}}  
    > {{definitions_companyCapitalization}}  
    > {{definitions_conversionPrice}}  
    > {{definitions_discountPrice}}  
    > {{definitions_distribution}}  
    > {{definitions_dissolutionEvent}}

3. **{{def.Company}} Representations**  
    {{representations_company}}
    
4. **{{def.Investor}} Representations**  
    {{representations_investor}}

5. **Miscellaneous**

    {{miscellaneous}}

IN WITNESS WHEREOF, the undersigned have caused this instrument to be duly executed and delivered.

{{sign_company}}
 
{{sign_investor}}