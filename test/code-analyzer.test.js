import assert from 'assert';
import {createGraph, parseCode} from '../src/js/code-analyzer';

describe('CFG Creation', () => {
    it('while class example', () => {
        assert.equal(createGraph('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}' , '1 , 2 , 3')
            ,
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let a = x + 1;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'let b = a + y;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'let c = 0;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'a < z"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'c = a + b"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n6 [label="6\n' +
            'a++"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="7\n' +
            'return z;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n8 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n9 [label="NULL"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n1 -> n8 [color="red", label="exception"]\n' +
            'n2 -> n3 []\n' +
            'n2 -> n8 [color="red", label="exception"]\n' +
            'n3 -> n9 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n4 -> n8 [color="red", label="exception"]\n' +
            'n5 -> n6 []\n' +
            'n5 -> n8 [color="red", label="exception"]\n' +
            'n6 -> n9 []\n' +
            'n7 -> n8 []\n' +
            'n9 -> n4 []\n' +
            '\n'
        );
    });

    it('if class example', () => {
        assert.equal(createGraph('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n' , '1 , 2 , 3')
            ,
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let a = x + 1;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'let b = a + y;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'let c = 0;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'b < z"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'c = c + 5"style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n6 [label="6\n' +
            'return c;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="7\n' +
            'b < z * 2"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n8 [label="8\n' +
            'c = c + x + 5"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n9 [label="9\n' +
            'c = c + z + 5"style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n10 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n11 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n1 -> n10 [color="red", label="exception"]\n' +
            'n2 -> n3 []\n' +
            'n2 -> n10 [color="red", label="exception"]\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n4 -> n10 [color="red", label="exception"]\n' +
            'n5 -> n11 []\n' +
            'n5 -> n10 [color="red", label="exception"]\n' +
            'n6 -> n10 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n7 -> n10 [color="red", label="exception"]\n' +
            'n8 -> n11 []\n' +
            'n8 -> n10 [color="red", label="exception"]\n' +
            'n9 -> n11 []\n' +
            'n9 -> n10 [color="red", label="exception"]\n' +
            'n11 -> n6 []\n' +
            '\n'
        );
    });

    it('simple arrays example #1', () => {
        assert.equal(createGraph('function foo(){\n' +
            ' let M = [1 , 2 , 3];\n' +
            ' let x = M[1];\n' +
            ' let y = 1;\n' +
            ' if(x===2)\n' +
            '  y=2;\n' +
            ' return y;\n' +
            '}' , ''),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let M = [\n' +
            '    1,\n' +
            '    2,\n' +
            '    3\n' +
            '];"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'let x = M[1];"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'let y = 1;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'x === 2"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'y = 2"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n6 [label="6\n' +
            'return y;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n8 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n2 -> n7 [color="red", label="exception"]\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n4 -> n7 [color="red", label="exception"]\n' +
            'n5 -> n8 []\n' +
            'n5 -> n7 [color="red", label="exception"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n6 []\n' +
            '\n'
        );
    });

    it('simple arrays example #2', () => {
        assert.equal(createGraph('function foo(arr){\n' +
            ' arr[0] = 9;\n' +
            ' if((arr[0] + arr[1])>12)\n' +
            '  arr[2] = arr[0];\n' +
            'if(arr[2] === arr[0])\n' +
            '  arr[2] = arr[0] + arr[1];\n' +
            ' return arr;\n' +
            '}' , '[1 , 4 , 3]'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'arr[0] = 9"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'arr[0] + arr[1] > 12"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'arr[2] = arr[0]"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'arr[2] === arr[0]"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'arr[2] = arr[0] + arr[1]"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n6 [label="6\n' +
            'return arr;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n8 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n9 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n1 -> n7 [color="red", label="exception"]\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n8 [label="false"]\n' +
            'n2 -> n7 [color="red", label="exception"]\n' +
            'n3 -> n8 []\n' +
            'n3 -> n7 [color="red", label="exception"]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n9 [label="false"]\n' +
            'n4 -> n7 [color="red", label="exception"]\n' +
            'n5 -> n9 []\n' +
            'n5 -> n7 [color="red", label="exception"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n4 []\n' +
            'n9 -> n6 []\n' +
            '\n'
        );
    });

    it('simple arrays example #3', () => {
        assert.equal(createGraph('function foo(a , b){\n' +
            'let x = a;\n' +
            'let y = b[0] + b[1];\n' +
            'y = b[0] + b[1];\n' +
            'if(y-a > b[2] + b[3])\n' +
            ' x = 9;\n' +
            'return x;\n' +
            '}' , '10 , [1 , 2 , 3 , 4]'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let x = a;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'let y = b[0] + b[1];"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'y = b[0] + b[1]"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'y - a > b[2] + b[3]"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'x = 9"style= "filled", shape = "diamond" , fillcolor = "white"]\n' +
            'n6 [label="6\n' +
            'return x;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n8 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n2 -> n7 [color="red", label="exception"]\n' +
            'n3 -> n4 []\n' +
            'n3 -> n7 [color="red", label="exception"]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n4 -> n7 [color="red", label="exception"]\n' +
            'n5 -> n8 []\n' +
            'n5 -> n7 [color="red", label="exception"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n6 []\n' +
            '\n'
        );
    });

    it('simple arrays example #4', () => {
        assert.equal(createGraph('function foo(a , b){\n' +
            'let x;\n' +
            'x = a[0];\n' +
            'b = a;\n' +
            '\n' +
            'if(b[1]+x === a[0]*2)\n' +
            ' x = x+5;\n' +
            'return x;\n' +
            '}' , '[1 , 1 , 100] , 49'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let x;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'x = a[0]"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'b = a"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'b[1] + x === a[0] * 2"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'x = x + 5"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n6 [label="6\n' +
            'return x;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n8 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n2 -> n7 [color="red", label="exception"]\n' +
            'n3 -> n4 []\n' +
            'n3 -> n7 [color="red", label="exception"]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n4 -> n7 [color="red", label="exception"]\n' +
            'n5 -> n8 []\n' +
            'n5 -> n7 [color="red", label="exception"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n6 []\n' +
            '\n'
        );
    });

    it('sort array example #1', () => {
        assert.equal(createGraph('function SortArray(arr1){\n' +
            'let i = 0;\n' +
            'let j = 0;\n' +
            '\twhile(i< 2-1){\n' +
            '                i=0;\n' +
            '\t\twhile(j< 2-(i+1)){\n' +
            '                       j=0;\n' +
            '\t\t\tif(arr1[j]>arr1[j+1]){\n' +
            '\t\t\t\tlet temp=arr1[j];\n' +
            '\t\t\t\tarr1[j]=arr1[j+1];\n' +
            '\t\t\t\tarr1[j+1]=temp;\n' +
            '\t\t\t}\n' +
            '                 j++;\n' +
            '\t\t}\n' +
            '         i++;\n' +
            '\t}\n' +
            '\treturn arr1;\n' +
            '}' , '[4 , 2]'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let i = 0;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'let j = 0;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'i < 2 - 1"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'i = 0"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'j < 2 - (i + 1)"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n6 [label="6\n' +
            'j = 0"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="7\n' +
            'arr1[j] > arr1[j + 1]"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n8 [label="8\n' +
            'let temp = arr1[j];"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n9 [label="9\n' +
            'arr1[j] = arr1[j + 1]"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n10 [label="10\n' +
            'arr1[j + 1] = temp"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n11 [label="11\n' +
            'j++"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n12 [label="12\n' +
            'i++"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n13 [label="13\n' +
            'return arr1;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n14 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n15 [label="NULL"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n16 [label="NULL"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n17 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n15 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n13 [label="false"]\n' +
            'n3 -> n14 [color="red", label="exception"]\n' +
            'n4 -> n16 []\n' +
            'n4 -> n14 [color="red", label="exception"]\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n12 [label="false"]\n' +
            'n5 -> n14 [color="red", label="exception"]\n' +
            'n6 -> n7 []\n' +
            'n6 -> n14 [color="red", label="exception"]\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n17 [label="false"]\n' +
            'n7 -> n14 [color="red", label="exception"]\n' +
            'n8 -> n9 []\n' +
            'n8 -> n14 [color="red", label="exception"]\n' +
            'n9 -> n10 []\n' +
            'n9 -> n14 [color="red", label="exception"]\n' +
            'n10 -> n17 []\n' +
            'n10 -> n14 [color="red", label="exception"]\n' +
            'n11 -> n16 []\n' +
            'n12 -> n15 []\n' +
            'n13 -> n14 []\n' +
            'n15 -> n3 []\n' +
            'n16 -> n5 []\n' +
            'n17 -> n11 []\n' +
            '\n'
        );
    });

    it('sort array example #2', () => {
        assert.equal(createGraph('function SortArray(arr1){\n' +
            'let i = 0;\n' +
            'let j = 0;\n' +
            '\twhile(i< 2-1){\n' +
            '                i=0;\n' +
            '\t\twhile(j< 2-(i+1)){\n' +
            '                       j=0;\n' +
            '\t\t\tif(arr1[j]>arr1[j+1]){\n' +
            '\t\t\t\tlet temp=arr1[j];\n' +
            '\t\t\t\tarr1[j]=arr1[j+1];\n' +
            '\t\t\t\tarr1[j+1]=temp;\n' +
            '\t\t\t}\n' +
            '                 j++;\n' +
            '\t\t}\n' +
            '         i++;\n' +
            '\t}\n' +
            '\treturn arr1;\n' +
            '}' , '[2 , 4]'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let i = 0;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'let j = 0;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'i < 2 - 1"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'i = 0"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'j < 2 - (i + 1)"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n6 [label="6\n' +
            'j = 0"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n7 [label="7\n' +
            'arr1[j] > arr1[j + 1]"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n8 [label="8\n' +
            'let temp = arr1[j];"style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n9 [label="9\n' +
            'arr1[j] = arr1[j + 1]"style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n10 [label="10\n' +
            'arr1[j + 1] = temp"style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n11 [label="11\n' +
            'j++"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n12 [label="12\n' +
            'i++"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n13 [label="13\n' +
            'return arr1;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n14 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n15 [label="NULL"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n16 [label="NULL"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n17 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n15 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n13 [label="false"]\n' +
            'n3 -> n14 [color="red", label="exception"]\n' +
            'n4 -> n16 []\n' +
            'n4 -> n14 [color="red", label="exception"]\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n12 [label="false"]\n' +
            'n5 -> n14 [color="red", label="exception"]\n' +
            'n6 -> n7 []\n' +
            'n6 -> n14 [color="red", label="exception"]\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n17 [label="false"]\n' +
            'n7 -> n14 [color="red", label="exception"]\n' +
            'n8 -> n9 []\n' +
            'n8 -> n14 [color="red", label="exception"]\n' +
            'n9 -> n10 []\n' +
            'n9 -> n14 [color="red", label="exception"]\n' +
            'n10 -> n17 []\n' +
            'n10 -> n14 [color="red", label="exception"]\n' +
            'n11 -> n16 []\n' +
            'n12 -> n15 []\n' +
            'n13 -> n14 []\n' +
            'n15 -> n3 []\n' +
            'n16 -> n5 []\n' +
            'n17 -> n11 []\n' +
            '\n'
        );
    });

    it('simple logical expr example', () => {
        assert.equal(createGraph('function foo(x, y){ \n' +
            '   let c;\n' +
            '    if (x&&y) {\n' +
            '        c = 5;\n' +
            '    } else if (x||y) {\n' +
            '        c = 6;\n' +
            '    }\n' +
            '    return c;\n' +
            '}\n' , 'true , false'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let c;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'x && y"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'c = 5"style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n4 [label="4\n' +
            'return c;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n5 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n6 [label="6\n' +
            'x || y"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n7 [label="7\n' +
            'c = 6"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n8 [label=" "style= "filled", shape = "circle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n6 [label="false"]\n' +
            'n3 -> n8 []\n' +
            'n3 -> n5 [color="red", label="exception"]\n' +
            'n4 -> n5 []\n' +
            'n6 -> n7 [label="true"]\n' +
            'n6 -> n8 [label="false"]\n' +
            'n7 -> n8 []\n' +
            'n7 -> n5 [color="red", label="exception"]\n' +
            'n8 -> n4 []\n' +
            '\n'
        );
    });

    it('simple function with multiple declarations', () => {
        assert.equal(createGraph('function foo(a , b){\n' +
            'let x = a;\n' +
            'let y = x;\n' +
            'let z = y;\n' +
            'b = z+z;\n' +
            'if(z === a && b===2*a)\n' +
            'return \'yay!\'\n' +
            '}' , '4 , true'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let x = a;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'let y = x;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'let z = y;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'b = z + z"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n5 [label="5\n' +
            'z === a && b === 2 * a"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n6 [label="6\n' +
            'return \'yay!\';"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n7 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n4 -> n7 [color="red", label="exception"]\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n7 [label="false"]\n' +
            'n5 -> n7 [color="red", label="exception"]\n' +
            'n6 -> n7 []\n' +
            '\n'
        );
    });

    it('simple function with wile statement', () => {
        assert.equal(createGraph('function foo(a , b){\n' +
            'let x = 2*a;\n' +
            'while(x > b){\n' +
            'x = x-1;\n' +
            '}\n' +
            'return 7;\n' +
            '}' , '2 , 3'),
        'n0 [label="entry",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n1 [label="1\n' +
            'let x = 2 * a;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n2 [label="2\n' +
            'x > b"style= "filled", shape = "diamond" , fillcolor = "green"]\n' +
            'n3 [label="3\n' +
            'x = x - 1"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n4 [label="4\n' +
            'return 7;"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n5 [label="exit",style= "filled", shape = "rectangle" , fillcolor = "white"]\n' +
            'n6 [label="NULL"style= "filled", shape = "rectangle" , fillcolor = "green"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n6 []\n' +
            'n1 -> n5 [color="red", label="exception"]\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n4 [label="false"]\n' +
            'n2 -> n5 [color="red", label="exception"]\n' +
            'n3 -> n6 []\n' +
            'n3 -> n5 [color="red", label="exception"]\n' +
            'n4 -> n5 []\n' +
            'n6 -> n2 []\n' +
            '\n'
        );
    });


});
