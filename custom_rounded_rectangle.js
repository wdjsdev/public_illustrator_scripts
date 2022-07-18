//Custom Rounded Rectangle Generator
//The built in roundedRectangle() method only allows for changing
//"verticalRadius" and "horizontalRadius".. But if you use different
//values for these, the corners are not truly rounded, and the values given
//will apply to both left and right sides or top and bottom.
//This customRoundedRectangle() function allows for each corner to have a separate
//corner radius that is truly rounded.

//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//github: https://www.github.com/wdjsdev
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//Adobe Discussion Forum Post about this library: https://community.adobe.com/t5/illustrator/library-for-aligning-objects-via-script/m-p/11925954#M269613

//*******//

//Did you find this useful? Would you like to buy me a cup (or a pot) of coffee to say thanks?
//paypal.me/illustratordev
//<3

//Do you have some work to do, but you have more money than time/skill?
//Send me an email or a dm! I'll see what I can do to help you out.

//*******//

//arguments:
//parent: the parent element inside which to create the rectangle
//y: y coordinate of the point
//x: x coordinate of the point
//w: width of the rectangle
//h: height of the rectangle
//r: array of radii clockwise from top left corner
function customRoundedRectangle(parent, y, x, w, h, r) {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    //function calls//
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    if (!app.documents.length) {
        alert("Please open a document and try again.");
        return;
    }


    var doc = app.activeDocument;
    var swatches = doc.swatches;
    var blackSwatch;
    try {
        blackSwatch = swatches["Black"];
    } catch (error) {
        blackSwatch = swatches.add();
        blackSwatch.name = "Black";
        blackSwatch.color = new CMYKColor();
        blackSwatch.color.black = 100;
    }

    //draw the base rectangle
    var rect = parent.pathItems.rectangle(y, x, w, h);
    rect.filled = true;
    rect.fillColor = blackSwatch.color;
    rect.stroked = false;
    var rectData = { w: rect.width, h: rect.height, l: rect.left, t: rect.top, r: rect.left + rect.width, b: rect.top - rect.height };
    var cp = parent.compoundPathItems.add();
    //create an ellipse for each radius
    r.forEach(function (radius, i) {
        var rad = radius * 2;
        var ellipse = cp.pathItems.ellipse(y, x, rad, rad);
        ellipse.filled = true;
        ellipse.fillColor = blackSwatch.color;
        ellipse.stroked = false;
        switch (i) {
            case 1:
                ellipse.left += rectData.w - rad;
                break;
            case 2:
                ellipse.left += rectData.w - rad;
                ellipse.top -= rectData.h - rad;
                break;
            case 3:
                ellipse.top -= rectData.h - rad;
        }
    });

    //load pathfinder actions into actions panel
    createAction("pathfinder", getActionString());

    doc.selection = null;
    cp.selected = rect.selected = true;
    app.doScript("divide", "pathfinder");

    //look for the "corner"s of the rectangle...
    //the part that's outside our desired radius
    afc(doc.selection[0], "pageItems").forEach(function (item) {
        var area = Math.abs(item.area);
        var calcArea = item.width * item.height;
        if (area < (calcArea * .6)) {
            item.remove();
        }
    });

    //all that's left should be the base rectangle and
    //the ellipses for the corner radii. unite them all
    //together into a single pathItem.
    app.doScript("unite", "pathfinder");

    //remove pathfinder actions from actions panel
    removeAction("pathfinder");

    //end of script








    


    ///////////////////////////////////////////////////////////////////////////
    //dependencies:
    ///////////////////////////////////////////////////////////////////////////



    //array from container
    //get all elements of the type "crit" inside the container
    //and return as a standard javascript array
    function afc(container, crit) {
        var result = [];
        var items;
        if (!crit || crit === "any") {
            items = container.pageItems;
        } else {
            items = container[crit];
        }
        for (var x = 0; x < items.length; x++) {
            result.push(items[x])
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
    Array.prototype.forEach = function (callback, startPos, inc) {
        if (!inc) inc = 1;
        if (!startPos) startPos = 0;
        for (var i = startPos; i < this.length; i += inc)
            callback(this[i], i, this);
    };


    //create and load a new action
    function createAction(name, actionString) {
        var documentsPath = "~/Documents/Adobe_Script_Helpers/";
        var dest = Folder(documentsPath);
        if (!dest.exists) {
            dest.create();
        }

        var actionFile = new File(decodeURI(dest + "/" + name + ".aia"));

        actionFile.open("w");
        actionFile.write(actionString);
        actionFile.close();

        //load the action
        app.loadAction(actionFile);
    }


    //remove all instances of an action with a given name
    function removeAction(actionName) {
        var localValid = true;

        while (localValid) {
            try {
                app.unloadAction(actionName, "");
            }
            catch (e) {
                localValid = false;
            }
        }
    }


    function getActionString() {
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
        ].join("\n");

        return pathfinderActionString;
    }
}

//sample function call:
// customRoundedRectangle(app.activeDocument, 0, 0, 200, 400, [20, 10, 25, 50]);