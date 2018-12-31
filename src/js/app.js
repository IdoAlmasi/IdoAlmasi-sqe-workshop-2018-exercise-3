import $ from 'jquery';
import {createGraph, parseCode} from './code-analyzer';
import Viz from 'viz.js';
import {Module , render} from 'viz.js/full.render.js';
import {symbolicSubstitution} from './symbolic-substitution';
import * as escodegen from 'escodegen';

function renderDot(dot){
    let graphElement = document.getElementById('graph');
    let viz = new Viz({ Module, render});
    viz.renderSVGElement(dot)
        .then(function(element) {
            graphElement.innerHTML = '';
            graphElement.append(element);
        });
}

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let args = $('#parameterInput').val();
        symbolicSubstitution(parsedCode , args);
        $('#cfg').val(escodegen.generate(parsedCode));
        /*let cfg = createGraph(codeToParse);
        $('#cfg').val('digraph G {' + cfg + '}');
        renderDot('digraph G {' + cfg + '}');*/

        /* let parsedCode = parseCode(codeToParse);
         let substitutedJson = symbolicSubstitution(parsedCode);
         let tmp = genCode(substitutedJson);
         let withUpdatedLocs = parseCode(tmp);
         let generatedCode = genCode(withUpdatedLocs);
         $('#parsedCode').val(generatedCode);
         let functionCode = getFunctionCode(withUpdatedLocs);
         let inputVector = extractInputVector(parseCode($('#inputVectorPlaceholder').val()));
         let evalResults = evalCode(functionCode, inputVector);
         paintStatements(generatedCode, evalResults);
         //$('#inputVectorPlaceholder').val(JSON.stringify(evalResults));
         */

    });
});
