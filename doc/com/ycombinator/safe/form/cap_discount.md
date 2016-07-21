$ amount = null

$ ymd = null

$ discount = null

$ valuationCap = null

$ company = null

$ investor = null

$ def = [../sec/defined_terms.md]

$ intro = [../sec/intro.md] => {
    "valuationCap" : valuationCap,
    "amount" : amount,
    "discount" : discount,
    "company" : company,
    "investor" : investor,
    "def" : def
}

$ event = [../sec/event.md] => {
    "def" : def
}

$ definitions_capitalStock = [../sec/definitions/capitalStock.md] => {
    "def" : def
}

$ definitions_changeOfControl = [../sec/definitions/changeOfControl.md] => {"def" : def}
$ definitions_companyCapitalization = [../sec/definitions/companyCapitalization.md] => {"def" : def}
$ definitions_conversionPrice = [../sec/definitions/conversionPrice.md] => {"def" : def}
$ definitions_discountPrice = [../sec/definitions/discountPrice.md] => {"def" : def}
$ definitions_distribution = [../sec/definitions/distribution.md] => {"def" : def}
$ definitions_dissolutionEvent = [../sec/definitions/dissolutionEvent.md] => {"def" : def}

$ representations_company = [../sec/representations/company.md] => {"def" : def}
$ representations_investor = [../sec/representations/investor.md] => {"def" : def}

$ sign_company = [../sec/sign/company.md] => {
    "ymd" : ymd,
    "company" : company,
    "def" : def
}

$ sign_investor = [../sec/sign/investor.md] => {
    "ymd" : ymd,
    "investor" : investor,
    "def" : def
}

$ miscellaneous = [../sec/miscellaneous.md] => {"def" : def}

{{intro}}

1. {{event}}

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