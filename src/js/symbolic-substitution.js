import {parseCode} from './code-analyzer';

let commands = {'VariableDeclaration' : varDeclarationHandler , 'FunctionDeclaration': functionHandler ,
    'WhileStatement': whileHandler , 'IfStatement': ifHandler , 'BlockStatement': blockHandler ,
    'ExpressionStatement': expressionHandler, 'AssignmentExpression':assignmentExpressionHandler ,
    'BinaryExpression': binaryExpressionHandler , 'MemberExpression': memberExpressionHandler  ,
    'ReturnStatement':returnHandler};

let symbolTable = {};
let functionArgs = {};

function extractFunctionArgs(args) {
    functionArgs = [];
    if(args!=='') {
        let parsedCode = parseCode(args);
        if(parsedCode.body[0].expression.type === 'SequenceExpression')
            functionArgs = parsedCode.body[0].expression.expressions;
        else
            functionArgs = [parsedCode.body[0].expression];
    }
}

function symbolicSubstitution(parsedCode , args){
    symbolTable = {};
    extractFunctionArgs(args);
    symbolSub(parsedCode.body[0]);
}

function symbolSub(parsedCode) {
    let func = commands[parsedCode.type];
    func !== undefined ? commands[parsedCode.type](parsedCode) : null;
}
function varDeclarationHandler(parsedCode) {
    let declarations = parsedCode.declarations;
    declarations.map(createVarDeclRow);
}

function createVarDeclRow(x){
    if(!x.init){
        symbolTable[x.id.name] = null;
    }
    else if(!isIdentifier(x.init)) {
        symbolSub(x.init);
        symbolTable[x.id.name] = x.init;
    }
    else{
        symbolTable[x.id.name] = symbolTable[x.init.name];
        x.init = symbolTable[x.id.name];
    }
}

function functionHandler(parsedCode) {
    let functionParams = parsedCode.params.map(x=>x.name);
    for(let i=0; i<functionParams.length; i++)
        symbolTable[functionParams[i]] = functionArgs[i];
    symbolSub(parsedCode.body);
}

function expressionHandler(parsedCode) {
    if(parsedCode.expression.type === 'AssignmentExpression')
        return assignmentExpressionHandler(parsedCode.expression);
    else if(parsedCode.expression.type === 'UpdateExpression'){
        updateToAssignment(parsedCode);
        return assignmentExpressionHandler(parsedCode.expression);
    }
}

function updateToAssignment(parsedCode) {
    parsedCode.expression = {
        'type': 'AssignmentExpression',
        'operator': '=',
        'left': parsedCode.expression.argument,
        'right': {
            'type': 'BinaryExpression',
            'operator': determineUpdateOperator(parsedCode.expression.operator),
            'left': parsedCode.expression.argument,
            'right': {
                'type': 'Literal',
                'value': 1,
                'raw': '1'
            }
        }
    };
}

function determineUpdateOperator(operator) {
    if(operator==='++')
        return '+'
    else if (operator==='--')
        return '-';
}

function assignmentExpressionHandler(parsedCode) { //Todo: Handle member expression assignments
    if(isIdentifier(parsedCode.left)){
        if (isIdentifier(parsedCode.right)) {
            symbolTable[parsedCode.left.name] = symbolTable[parsedCode.right.name];
            parsedCode.right = symbolTable[parsedCode.left.name];
        }
        else {
            symbolSub(parsedCode.right);
            symbolTable[parsedCode.left.name] = parsedCode.right;
        }
    }
    else{
        if(isIdentifier(parsedCode.right)) {
            symbolSub(parsedCode.left);
            parsedCode.right = symbolTable[parsedCode.right.name];
        }
        else{
            symbolSub(parsedCode.left);
            symbolSub(parsedCode.right);
        }
    }
}

function memberExpressionHandler(parsedCode){
    if(isIdentifier(parsedCode.property))
        parsedCode.property = symbolTable[parsedCode.property.name];
    else
        symbolSub(parsedCode.property);
}

function binaryExpressionHandler(parsedCode){
    if(isIdentifier(parsedCode.left))
        parsedCode.left = symbolTable[parsedCode.left.name];
    else
        symbolSub(parsedCode.left);

    if(isIdentifier(parsedCode.right))
        parsedCode.right = symbolTable[parsedCode.right.name];
    else
        symbolSub(parsedCode.right);
}

function whileHandler(parsedCode) {
    symbolSub(parsedCode.test);
    symbolSub(parsedCode.body);
}

function ifHandler(parsedCode) {
    symbolSub(parsedCode.test);
    symbolSub(parsedCode.consequent);
    if(parsedCode.alternate!==null)
        symbolSub(parsedCode.alternate);
}

function blockHandler(parsedCode){
    let blockBody = parsedCode.body;
    blockBody.map(symbolSub);
}

function returnHandler(parsedCode){
    if(isIdentifier(parsedCode.argument))
        parsedCode.argument = symbolTable[parsedCode.argument.name];
    else
        symbolSub(parsedCode.argument);
}

function isIdentifier(x){
    return x.type === 'Identifier';
}

export{symbolicSubstitution};
