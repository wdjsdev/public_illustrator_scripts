//Custom Rounded Rectangle Generator
//The built in roundedRectangle() method only allows for changing
//"verticalRadius" and "horizontalRadius".. But if you use different
//values for these, the corners are not truly round... they'll be asymptotic
//and the values given will apply to both left and right sides or top and bottom
//so you can't change the corners individually
//This customRoundedRectangle() function allows for each corner to have a separate
//corner radius that is truly rounded and maintains the integrity of the rectangle's existing side

//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//github: https://www.github.com/wdjsdev
//this project on github: https://github.com/wdjsdev/public_illustrator_scripts/blob/master/custom_rounded_rectangle.js
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//Adobe Discussion Forum Post that initiated this: https://community.adobe.com/t5/illustrator-discussions/rounded-rectangle/td-p/13076613

//*******//

//Did you find this useful? Would you like to buy me a cup (or a pot) of coffee to say thanks?
//paypal.me/illustratordev
//<3

//Do you have some work to do, but you have more money than time/skill?
//Send me an email or a dm! I'll see what we can do to help each other..

//*******//

//arguments:
//[y] optional: y (top) coordinate of the rectangle (Number, in points)
//default value: 0

//[x] optional: x (left) coordinate of the rectangle  (Number, in points)
//default value: 0

//[width] optional: width of the rectangle (Number, in points)
//default value: 100

//[height] optional: height of the rectangle (Number, in points)
//default value: 100

//[radii] optional: array of 4 numbers or number (in points)
//array of radii clockwise from top left corner
//default value: [10,10,10,10]

//if only one number is given, it is applied to all corners

//[parent] optional: the parent container object inside which to create the rectangle 
//default value: app.activeDocument
function customRoundedRectangle ( y, x, width, height, radii, parent )
{


    //verify open document//
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    if ( !app.documents.length )
    {
        alert( "Please open a document and try again." );
        return;
    }

    ///////////////////////////////////////////////////////////////////////////
    //sanitize inputs//
    ///////////////////////////////////////////////////////////////////////////

    var errorInputs = [];
    if ( radii && radii.constructor.toString().match( /array/i ) )
    {
        if ( radii.length == 1 )
        {
            //user probably just wanted to use one value for all corners
            //but used an array with one element instead of just a number
            //no problem. just use that value for all corners
            radii = [ radii[ 0 ], radii[ 0 ], radii[ 0 ], radii[ 0 ] ];
        }
        else if ( radii.length !== 4 )
        {
            //user gave an array with more or less than 4 elements
            $.writeln( "You must provide 4 radii values or a single number for all radii." );
            return;
        }
    }
    else if ( typeof radii == "number" )
    {
        //user just gave one number for all radii
        //use that number for all corners
        radii = [ radii, radii, radii, radii ];
    }

    //set some default values for any argument that is not provided:

    if ( !parent || parent.toString().match( /document/i ) )
    {
        parent = app.activeDocument.layers[ 0 ];
    }
    parent.locked = false;
    parent.visible = true;
    parent.hidden = false;
    y = y || 0;
    x = x || 0;
    width = width || 100;
    height = height || 100;
    radii = radii || [ 10, 10, 10, 10 ];

    typeof y == "number" ? y : errorInputs.push( "y" );
    typeof x == "number" ? x : errorInputs.push( "x" );
    typeof width == "number" ? width : errorInputs.push( "width" );
    typeof height == "number" ? height : errorInputs.push( "height" );

    //make sure the parent is a group/layer/docdument
    if ( !parent.typename.match( /group|layer|doc/i ) )
    {
        $.writeln( "Can't make a rounded rectangle within a parent that isn't a group, layer, or document." );
        return;
    }

    if ( errorInputs.length )
    {
        var errorString = "The following arguments were not valid:\n";
        errorInputs.forEach( function ( arg )
        {
            errorString += arg + ", ";
        } )
        errorString += "\n Please ensure these arguments are numbers (int or float)."
        alert( errorString );
        return;
    }

    ///////////////////////////////////////////////////////////////////////////
    //finished sanitizing inputs//
    ///////////////////////////////////////////////////////////////////////////

    //this is the function call that actually
    //does the work. I wrapped the logic in a function
    //to avoid variable scope issues and accessing
    //Array.forEach before it was defined.
    //But i still want the function logic to be at the
    //top of the file so it's easier to read and
    //the dependencies at the bottom and out of the way. 
    return makeRect( y, x, width, height, radii, parent );

}













///////////////////////////////////////////////////////////////////////////
//dependencies:
///////////////////////////////////////////////////////////////////////////


function makeRect ( y, x, width, height, radii, parent )
{
    var doc = app.activeDocument;
    var swatches = doc.swatches;
    var resultingShape = null;

    //make a temp sandbox layer to hold the rectangle
    //and make for easy identification of the resulting rectangle
    //at the end, we'll move it inside the parent
    var sandboxLayer = doc.layers.add();

    //draw the base rectangle
    //for now, use whatever fill/stroke is currently selected
    //todo: make appearance customizable
    //more arguments?? i don't love it...
    //maybe an "options" object? then the user/dev could have a list of preset options to easily pass in
    //should support plain fill/stroke and graphic styles
    var rect = sandboxLayer.pathItems.rectangle( y, x, width, height );
    var rectData = { width: rect.width, height: rect.height, l: rect.left, t: rect.top, r: rect.left + rect.width, b: rect.top - rect.height };
    var cp = sandboxLayer.compoundPathItems.add();
    //create an ellipse for each radius
    radii.forEach( function ( radius, i )
    {
        if ( radius === 0 )
        {
            //don't make an ellipse for this.. this corner should remain as is.
            return;
        }
        var diameter = radius * 2;
        var ellipse = cp.pathItems.ellipse( y, x, diameter, diameter );

        //ellipse has been created to size, now move it to the correct corner
        switch ( i )
        {
            case 0:
                //this is the top left.. no need to move anything
                break;
            case 1:
                //this is the top right corner
                ellipse.left = rectData.r - diameter;
                break;
            case 2:
                //this is the bottom right corner
                ellipse.left = rectData.r - diameter;
                ellipse.top = rectData.b + diameter;
                break;
            case 3:
                //this is the bottom left corner
                ellipse.top -= rectData.height - diameter;
        }
    } );

    //load pathfinder actions into actions panel
    createAction( "pathfinder", getActionString() );

    doc.selection = null;
    cp.selected = rect.selected = true;
    app.doScript( "divide", "pathfinder" );

    //look for the "corner"s of the rectangle...
    //the part that's outside our desired radius
    afc( doc.selection[ 0 ], "pageItems" ).forEach( function ( item )
    {
        var area = Math.abs( item.area );
        var calcArea = item.width * item.height;
        if ( area < ( calcArea * .6 ) )
        {
            item.remove();
        }
    } );

    //all that's left should be the base rectangle and
    //the ellipses for the corner radii. unite them all
    //together into a single pathItem.
    app.doScript( "unite", "pathfinder" );

    //remove pathfinder actions from actions panel
    removeAction( "pathfinder" );


    resultingShape = sandboxLayer.pageItems[ 0 ];
    resultingShape.moveToBeginning( parent );

    sandboxLayer.remove();
    return resultingShape;
}


//array from container
//get all elements of the type "crit" inside the container
//and return as a standard javascript array
function afc ( container, crit )
{
    var result = [];
    var items;
    if ( !crit || crit === "any" )
    {
        items = container.pageItems;
    } else
    {
        items = container[ crit ];
    }
    for ( var x = 0; x < items.length; x++ )
    {
        result.push( items[ x ] )
    }
    return result;
}

//Array.forEach() prototype for easily looping arrays
//this helps eliminate scope issues because variables
//remain contained inside the function block. almost
//kind of imitating "let" in modern javascript.
//Plus, you don't need to worry about pre-declaring
//variables outside the loop to prevent mrap/parm errors.
//args:
//callback: the function to call for each element
//startPos: the index to start at (defaults to 0)
//inc: the increment to move by (defaults to 1)
Array.prototype.forEach = function ( callback, startPos, inc )
{
    if ( !inc ) inc = 1;
    if ( !startPos ) startPos = 0;
    for ( var i = startPos; i < this.length; i += inc )
        callback( this[ i ], i, this );
};


//create and load a new action
function createAction ( name, actionString )
{
    var documentsPath = "~/Documents/Adobe_Script_Helpers/";
    var dest = Folder( documentsPath );
    if ( !dest.exists )
    {
        dest.create();
    }

    var actionFile = new File( decodeURI( dest + "/" + name + ".aia" ) );

    actionFile.open( "width" );
    actionFile.write( actionString );
    actionFile.close();

    //load the action
    app.loadAction( actionFile );
}


//remove all instances of an action with a given name
function removeAction ( actionName )
{
    var localValid = true;

    while ( localValid )
    {
        try
        {
            app.unloadAction( actionName, "" );
        }
        catch ( e )
        {
            localValid = false;
        }
    }
}


function getActionString ()
{
    //pathfinder action string. this will create an
    //action set containing all of the pathfinder options.
    //this is much more reliable than app.executeMenuCommand()
    //which uses "live pathfinder" effects which don't always work
    //and need to be expanded.
    var pathfinderActionString = [
        "/version 3",
        "/name [ 10",
        "	7061746866696e646572",
        "]",
        "/isOpen 1",
        "/actionCount 10",
        "/action-1 {",
        "	/name [ 5",
        "		756e697465",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 0",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 3",
        "				416464",
        "			]",
        "			/value 0",
        "		}",
        "	}",
        "}",
        "/action-2 {",
        "	/name [ 11",
        "		6d696e75735f66726f6e74",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 0",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 8",
        "				5375627472616374",
        "			]",
        "			/value 3",
        "		}",
        "	}",
        "}",
        "/action-3 {",
        "	/name [ 9",
        "		696e74657273656374",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 0",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 9",
        "				496e74657273656374",
        "			]",
        "			/value 1",
        "		}",
        "	}",
        "}",
        "/action-4 {",
        "	/name [ 7",
        "		6578636c756465",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 1",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 7",
        "				4578636c756465",
        "			]",
        "			/value 2",
        "		}",
        "	}",
        "}",
        "/action-5 {",
        "	/name [ 6",
        "		646976696465",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 1",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 6",
        "				446976696465",
        "			]",
        "			/value 5",
        "		}",
        "	}",
        "}",
        "/action-6 {",
        "	/name [ 4",
        "		7472696d",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 1",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 4",
        "				5472696d",
        "			]",
        "			/value 7",
        "		}",
        "	}",
        "}",
        "/action-7 {",
        "	/name [ 5",
        "		6d65726765",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 1",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 5",
        "				4d65726765",
        "			]",
        "			/value 8",
        "		}",
        "	}",
        "}",
        "/action-8 {",
        "	/name [ 4",
        "		63726f70",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 1",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 4",
        "				43726f70",
        "			]",
        "			/value 9",
        "		}",
        "	}",
        "}",
        "/action-9 {",
        "	/name [ 7",
        "		6f75746c696e65",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 1",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 7",
        "				4f75746c696e65",
        "			]",
        "			/value 6",
        "		}",
        "	}",
        "}",
        "/action-10 {",
        "	/name [ 10",
        "		6d696e75735f6261636b",
        "	]",
        "	/keyIndex 0",
        "	/colorIndex 0",
        "	/isOpen 1",
        "	/eventCount 1",
        "	/event-1 {",
        "		/useRulersIn1stQuadrant 0",
        "		/internalName (ai_plugin_pathfinder)",
        "		/localizedName [ 10",
        "			5061746866696e646572",
        "		]",
        "		/isOpen 0",
        "		/isOn 1",
        "		/hasDialog 0",
        "		/parameterCount 1",
        "		/parameter-1 {",
        "			/key 1851878757",
        "			/showInPalette 4294967295",
        "			/type (enumerated)",
        "			/name [ 10",
        "				4d696e7573204261636b",
        "			]",
        "			/value 4",
        "		}",
        "	}",
        "}"
    ].join( "\n" );

    return pathfinderActionString;
}




//shorter function name if you'd rather use that
//use any name that makes sense to you. custRoundRect.. whatever. It's yours to use
//in whatever way you feel improves your process.
function crr ( y, x, width, height, radii, parent )
{
    return customRoundedRectangle( y, x, width, height, radii, parent );
}


//sample function calls:
//parent as activeDocument
// customRoundedRectangle(0, 0, 200, 400, [20, 10, 25, 50],app.activeDocument);

//parent as specific groupItem inside specific layer
//you could also of course set a variable to the parent you want to use
//and then simply pass that variable as the argument.
// customRoundedRectangle(0, 0, 200, 400, [20, 10, 25, 50],app.activeDocument.layers[1].groupItems[0]);

//undefined parent. this will just default to activeDocument
//feel free to adjust the code on line 19 to use whatever default values you'd like
// customRoundedRectangle(0, 0, 200, 400, [20, 10, 25, 50]);

//in fact, all arguments are optional. the following will create a rounded rectangle
//at position [0,0] with a width/height of 100 and radii of 10 on each corner.
// customRoundedRectangle();




//test function to see if the script is working
function testRoundedRectangle ()
{
    Array.prototype.forEach = function ( callback, startPos, inc )
    {
        if ( !inc ) inc = 1;
        if ( !startPos ) startPos = 0;
        for ( var i = startPos; i < this.length; i += inc )
            callback( this[ i ], i, this );
    };
    var doc = app.activeDocument;
    var w = h = 400;
    var testData = {
        "no args": [ undefined, undefined, undefined, undefined, undefined, undefined ],
        "explicit to activeDocument": [ 450, 0, w, h, [ 20, 10, 25, 50 ], doc ],
        "explicit to groupItem": [ 900, 0, w, h, [ 100, 50, 0, 20 ], doc.layers[ 0 ].groupItems[ 0 ] ],
        "radii int": [ 2250, 200, w, h, 100, doc ],
    }



    var inputs;
    // var args;
    var rect;

    for ( var key in testData )
    {
        $.writeln( "testing: " + key );
        inputs = [];
        // args = testData[ key ];
        testData[ key ].forEach( function ( arg )
        {
            inputs.push( arg );
        } )
        rect = customRoundedRectangle( inputs[ 0 ], inputs[ 1 ], inputs[ 2 ], inputs[ 3 ], inputs[ 4 ], inputs[ 5 ] );
        if ( rect )
        {
            rect.name = key;
        }
    }
}

testRoundedRectangle();
