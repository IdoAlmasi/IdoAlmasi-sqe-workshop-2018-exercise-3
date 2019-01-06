import {parseCode} from './code-analyzer';
import * as escodegen from 'escodegen';

let commands = {'VariableDeclaration' : varDeclarationHandler ,
    'AssignmentExpression':assignmentExpressionHandler , 'UpdateExpression': updateHandler ,
    'BinaryExpression': binaryExpressionHandler , 'LogicalExpression': binaryExpressionHandler,
    'ReturnStatement':returnHandler};

let symbolTable = {};

function extractFunctionArgs(parsedCode , args) {
    let functionArgs = [];
    let functionParams = parsedCode.body[0].params;
    if(args!=='') {
        let parsedArgs = parseCode(args);
        if(parsedArgs.body[0].expression.type === 'SequenceExpression')
            functionArgs = parsedArgs.body[0].expression.expressions;
        else
            functionArgs = [parsedArgs.body[0].expression];
    }
    for(let i=0; i<functionArgs.length; i++)
        symbolTable[functionParams[i].name] = functionArgs[i];
}

function symbolicSubstitution(flowStruct ,parsedCode ,args , colorAndShapeType){
    symbolTable = {};
    extractFunctionArgs(parsedCode , args);
    mapFlowNodes(flowStruct , flowStruct[0].normal , colorAndShapeType);
}

function mapFlowNodes(flowStruct , flowNode , colorAndShapeType) {
    if(!flowNode || flowNode.type==='exit')
        return;
    colorAndShapeType[findNodeId(flowNode , flowStruct)][0] = 'green';
    if(!flowNode.astNode)
        mapFlowNodes(flowStruct , flowNode.normal , colorAndShapeType);
    else {
        let substituted = JSON.parse(JSON.stringify(flowNode.astNode));
        symbolSub(substituted);
        mapFlowNodes(flowStruct , determineNextNode(substituted , flowNode) , colorAndShapeType);
    }
}

function determineNextNode(subFlowNode , flowNode) {
    if(flowNode.true && flowNode.false) {
        if (eval(escodegen.generate(subFlowNode)))
            return flowNode.true;
        else
            return flowNode.false;
    }
    return flowNode.normal;
}

function symbolSub(astNode) {
    let func = commands[astNode.type];
    func !== undefined ? commands[astNode.type](astNode) : null;
}
function varDeclarationHandler(astNode) {
    let declarations = astNode.declarations;
    declarations.map(createVarDeclRow);
}

function createVarDeclRow(x){
    if(!x.init){
        symbolTable[x.id.name] = null;
    }
    else if(isIdentifier(x.init)) {
        symbolTable[x.id.name] = symbolTable[x.init.name];
        x.init = symbolTable[x.id.name];
    }
    else if(isMemberExpression(x.init))
        symbolTable[x.id.name] = symbolTable[x.init.object.name].elements[getArrayLocation(x.init)];
    else{
        symbolSub(x.init);
        symbolTable[x.id.name] = x.init;
    }
}

function assignmentExpressionHandler(astNode) {
    if(isIdentifier(astNode.left)){
        leftIdentifierAssignmentHandler(astNode);
    } else{ //left is member expression
        if(isIdentifier(astNode.right))
            astNode.right = symbolTable[astNode.right.name];
        else if(isMemberExpression(astNode.right))
            astNode.right = symbolTable[astNode.right.object.name].elements[getArrayLocation(astNode.right)];
        else
            symbolSub(astNode.right);
        symbolTable[astNode.left.object.name].elements[getArrayLocation(astNode.left)] = astNode.right;
    }
}

function leftIdentifierAssignmentHandler(astNode) {
    if (isIdentifier(astNode.right)) {
        symbolTable[astNode.left.name] = symbolTable[astNode.right.name];
        astNode.right = symbolTable[astNode.left.name];
    } else if (isMemberExpression(astNode.right))
        symbolTable[astNode.left.name] = symbolTable[astNode.right.object.name].elements[getArrayLocation(astNode.right)];
    else {
        symbolSub(astNode.right);
        symbolTable[astNode.left.name] = astNode.right;
    }
}

function getArrayLocation(memberExp) {
    if(isIdentifier(memberExp.property))
        return eval(escodegen.generate(symbolTable[memberExp.property.name]));
    else if(isLiteral(memberExp.property))
        return eval(escodegen.generate(memberExp.property));
    else{
        symbolSub(memberExp.property);
        return eval(escodegen.generate(memberExp.property));    
    }

}

function isLiteral(x) {
    return x.type==='Literal';
}

function updateHandler(astNode){
    symbolTable[astNode.argument.name] = {
        'type': 'BinaryExpression',
        'operator': determineOperator(astNode.operator),
        'left': symbolTable[astNode.argument.name],
        'right': {
            'type': 'Literal',
            'value': 1,
            'raw': '1'
        }
    };
}

function determineOperator(op) {
    return op.charAt(0);
}

/*function memberExpressionHandler(parsedCode){
    if(isIdentifier(parsedCode.property))
        parsedCode.property = symbolTable[parsedCode.property.name];
    else
        symbolSub(parsedCode.property);
}*/

function binaryExpressionHandler(astNode){
    if(isIdentifier(astNode.left))
        astNode.left = symbolTable[astNode.left.name];
    else if(isMemberExpression(astNode.left))
        astNode.left = symbolTable[astNode.left.object.name].elements[getArrayLocation(astNode.left)];
    else
        symbolSub(astNode.left);

    if(isIdentifier(astNode.right))
        astNode.right = symbolTable[astNode.right.name];
    else if(isMemberExpression(astNode.right))
        astNode.right = symbolTable[astNode.right.object.name].elements[getArrayLocation(astNode.right)];
    else
        symbolSub(astNode.right);
}

function returnHandler(astNode){
    if(isIdentifier(astNode.argument))
        astNode.argument = symbolTable[astNode.argument.name];
    else
        symbolSub(astNode.argument);
}

function isIdentifier(x){
    return x.type === 'Identifier';
}

function isMemberExpression(x) {
    return x.type === 'MemberExpression';
}

function findNodeId(node , flowStruct){
    for(let i=0; i<flowStruct[2].length; i++){
        if(flowStruct[2][i]===node)
            return i;
    }
}

export{symbolicSubstitution};
