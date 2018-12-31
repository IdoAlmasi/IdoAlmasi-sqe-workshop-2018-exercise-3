import * as esprima from 'esprima';
import * as esgraph from 'esgraph';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

function createGraph(codeToParse) {
    let parsedCode = parseCode(codeToParse);
    let flowStruct = esgraph(parsedCode.body[0].body , { omitExceptions: true });
    //createMergePoints(flowStruct);
    createMergePoints(flowStruct);
    let dotStruct = esgraph.dot(flowStruct, {counter: 0, source: parsedCode.body[0].body});
    return dotStruct;

}

function createMergePoints(flowStruct){ //maybe need to update the next and prev fields of the nodes
    flowStruct[2].map(node =>{
        if(node.prev.length>1){
            let mergePoint = {astNode: undefined , next:[node], normal: node , parent: undefined , prev:node.prev , type:determineType(node)};
            node.prev.map(x=> {
                if(x.normal)
                    x.normal = mergePoint;
                else if(nodeInTrueValue(x , node))
                    x.true = mergePoint;
                else if(nodeInFalseValue(x , node))
                    x.false = mergePoint;
                updateNextField(x , node , mergePoint);

            });
            node.prev = [mergePoint];
            flowStruct[2].push(mergePoint);
        }
    });
}

function determineType(node) {
    if(node.parent.type==='WhileStatement')
        return 'While';
    else
        return 'If';
}

function updateNextField(x , node , mergePoint) {
    for(let i=0; i<x.next.length; i++){
        if(x.next[i]===node)
            x.next[i] = mergePoint;
    }
}

function nodeInTrueValue(x , node) {
    return x.true && x.true === node;
}

function nodeInFalseValue(x , node) {
    return x.false && x.false === node;
}

export {parseCode , createGraph};
