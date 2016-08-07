var person = {
    "firstName": "John",
    "lastName": "Doe"
};

module.exports = {
    "text": "Hello {{firstName}} {{lastName}}",
    "type": "title",
    "vars": {
        "firstName": person.firstName,
        "lastName": person.lastName
    }
    
};
