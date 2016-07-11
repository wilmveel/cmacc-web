$ name = "Willem"

@ geo1 = [u/geo.md] => {
    "geo" : {
       "adr" : "Amsterdamsestraatweg 346",
       "country" : "NLD",
       "city": "Utrecht",
       "st": null,
       "state": "LALA",
       "flower": null,
       "zipList": null,
       "nation": null
    }
}

@ geo2 = [u/geo.md] => {
    "geo" : {
       "adr" : "Amsterdamsestraatweg 643",
       "country" : "GER",
       "city": "Mun",
       "st": null,
       "state": "JOLO",
       "flower": null,
       "zipList": null,
       "nation": null
    }
}

@ geoSimple = [u/geo_simple.md] => {
   "name": "Willem Veelenturf123",
   "adr" : "Amsterdamsestraatweg 64334"
}

#  My name is {{name}}

#  My name is {{geo1.geo.adr}}

{{geoSimple}}

<table width="100%">
    <tr>
        <td>{{geo1}}</td>
        <td>{{geo2}}</td>
        <td>{{geo1}}</td>
    </tr>
</table>