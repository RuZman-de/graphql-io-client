/*
**  GraphQL-IO -- GraphQL Network Communication Framework
**  Copyright (c) 2016-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module: true */
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean")
    grunt.loadNpmTasks("grunt-browserify")
    grunt.loadNpmTasks("grunt-eslint")
    grunt.loadNpmTasks("grunt-babel")
    grunt.loadNpmTasks("grunt-tslint")
    grunt.initConfig({
        eslint: {
            options: {
                configFile: "eslint.yaml"
            },
            "gruntfile": [ "Gruntfile.js" ],
            "graphql-io-client": [ "src/**/*.js" ]
        },
        tslint: {
            "graphql-io-client": {
                options: {
                    configuration: "tslint.json"
                },
                src: "./src/graphql-io.d.ts"
            }
        },
        browserify: {
            "graphql-io-client-browser": {
                files: {
                    "lib/browser/graphql-io.js": [ "src/graphql-io.js" ]
                },
                options: {
                    transform: [
                        [ "global-replaceify", {
                            global: true,
                            replacements: {
                                "Promise": "(require(\"es6-promise\").Promise)"
                            }
                        } ],
                        [ "babelify", {
                            presets: [
                                [ "@babel/preset-env", {
                                    "targets": {
                                        "browsers": "last 2 versions, > 1%, ie 11"
                                    }
                                } ]
                            ],
                            plugins: [ [ "@babel/plugin-transform-runtime", {
                                "corejs":      2,
                                "helpers":     true,
                                "regenerator": true
                            } ] ]
                        } ],
                        "browserify-shim",
                        [ "uglifyify", { sourceMap: false, global: true } ]
                    ],
                    plugin: [
                        [ "browserify-derequire" ],
                        [ "browserify-header" ]
                    ],
                    browserifyOptions: {
                        standalone: "GraphQLClient",
                        debug: false
                    }
                }
            }
        },
        babel: {
            "graphql-io-client-node": {
                files: [
                    {
                        expand: true,
                        cwd:    "src/",
                        src:    [ "*.js" ],
                        dest:   "lib/node/"
                    }
                ],
                options: {
                    sourceMap: false,
                    presets: [
                        [ "@babel/preset-env", {
                            "targets": {
                                "node": "8.0.0"
                            }
                        } ]
                    ],
                    plugins: [
                        [ "@babel/plugin-transform-runtime", {
                            "corejs":      2,
                            "helpers":     true,
                            "regenerator": false
                        } ]
                    ]
                }
            }
        },
        clean: {
            clean:     [ "lib" ],
            distclean: [ "node_modules" ]
        }
    })
    grunt.registerTask("default", [ "eslint", "tslint", "browserify", "babel" ])
}

