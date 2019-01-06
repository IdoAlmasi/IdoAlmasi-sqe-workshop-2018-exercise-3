import $ from 'jquery';
import {createGraph} from './code-analyzer';
import Viz from 'viz.js';
import {Module , render} from 'viz.js/full.render.js';

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
        let args = $('#parameterInput').val();
        let cfg = createGraph(codeToParse , args);
        $('#cfg').val('digraph G {' + cfg + '}');
        renderDot('digraph G {' + cfg + '}');
    });
});
