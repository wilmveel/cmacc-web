var assert = require('assert');
var path = require('path');

describe('parse', function () {

    var cmacc = require('../../src/cmacc');

    var root = path.join(__dirname);

    describe('Variable.md', function () {
        it('should return variable hello World', function (done) {
            var file = path.join(root, 'Variable.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    hello1: "World1"
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('VariableNull.md', function () {
        it('should return variable hello World', function (done) {
            var file = path.join(root, 'VariableNull.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    hello1: null
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('VariableEmpty.md', function () {
        it('should return variable hello World', function (done) {
            var file = path.join(root, 'VariableEmpty.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    hello1: null
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('Object.md', function () {
        it('should return object hello world', function (done) {
            var file = path.join(root, 'Object.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    obj1: {
                        hello1: "World1"
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportVariable.md', function () {
        it('should return object and overwrite', function (done) {
            var file = path.join(root, 'ImportVariable.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    obj2: {
                        hello1: "World1"
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportObject.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObject.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    obj2: {
                        obj1: {
                            hello1: "World1"
                        }
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportVariableOverwrite.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportVariableOverwrite.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    obj2: {
                        hello1: "World2"
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportObjectOverwrite.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectOverwrite.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    obj2: {
                        obj1: {
                            hello1: "World2"
                        }
                    }

                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportObjectSubstitutionVariable.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectSubstitutionVariable.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    hello3: 'World3',
                    obj2: {
                        hello1: 'World3'
                    }
                };
                assert.deepEqual(json, result);

                done();
            });
        });
    });

    describe('ImportObjectSubstitutionObject.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectSubstitutionObject.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    "obj3": {
                        "hello3": "World3"
                    },
                    "obj2": {
                        "hello1": {
                            "hello3": "World3"
                        }
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportObjectSubstitutionImport.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectSubstitutionImport.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    "obj2": {
                        "obj1": {
                            "hello1": "World1"
                        },
                        "hello1": {
                            "hello1": "World1"
                        }
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportObjectSubstitutionImportDouble.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectSubstitutionImportDouble.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    "obj3": {
                        "obj2": {
                            "obj1": {
                                "hello1": "World3"
                            }
                        }
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('ImportObjectSubstitutionImportDoubleObject.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectSubstitutionImportDoubleObject.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    "obj4": {
                        "hello4": "World4"
                    },
                    "obj3": {
                        "obj2": {
                            "obj1": {
                                "hello1": {
                                    "hello4": "World4"
                                }
                            }
                        }
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });

    describe('NullImportObjectOverwrite.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'NullImportObjectOverwrite.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(JSON.stringify(json, null, 4));
                var result = {
                    "obj2": {
                        "obj1": {
                            "hello1": "World2"
                        }
                    }
                };
                assert.deepEqual(json, result);
                done();
            });
        });
    });
});