
//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//github: https://github.com/wdjsdev
//Adobe Discussion Forum Post about this: https://community.adobe.com/t5/illustrator-discussions/script-for-adding-guides-in-the-centerpoint-of-an-object/td-p/13155180

//*******//

//Did you find this useful? Would you like to buy me a cup (or a pot?) of coffee to say thanks?
//paypal.me/illustratordev
//<3

//*******//



//Draw crosshairs at center of selected items
//
//given at least one selected item, this function will draw crosshairs at the center of each item.
//toggle the "MAKE_CROSSHAIRS_INTO_GUIDES" boolean to determine whether the crosshairs should be 
//drawn as guides or as simple stroked paths.

//arguments
//none. just select the items first and run the script.

//dependencies:
//alignment_functions.js: https://github.com/wdjsdev/public_illustrator_scripts/blob/master/alignment_functions.js
//object_bounds_data.js : https://github.com/wdjsdev/public_illustrator_scripts/blob/master/object_bounds_data.js

#include "object_bounds_data.js";
#include "alignment_functions.js"
function makeCenterGuide()
{
    //boolean to determine whether the crosshairs drawn should be
    //converted into true illustrator "guides" or not.
    //If false, crosshairs will be drawn as simple lines with a
    //stroke color of "crosshairColor" which can be customized below.
        //currently set to CMYK with 100% values for each. But you can choose
        //rgb, lab, etc. and set any values you want.
    const MAKE_CROSSHAIRS_INTO_GUIDES = true;

    const GUIDE_SIZE = 10; //number in points representing the width/height of the crosshair

    var doc = app.activeDocument;
    var layers = doc.layers;
    var sel = doc.selection;
    if(!sel.length)
    {
        alert("Please select at least one page item and try again.");
        return;
    }

    var crosshairColor = new CMYKColor();
    crosshairColor.cyan = 100;
    crosshairColor.magenta = 100;
    crosshairColor.yellow = 100;
    crosshairColor.black = 100;


    //since i don't know exactly what you want, i'm going to create a new layer
    //to plop all the crosshairs on. this helps avoid issues with trying to draw
    //or manipulate artwork on locked/hidden layers. If the items you're drawing
    //guides for are groupItems, you could simply put the crosshairs inside that groupItem.
    //entirely your call. Just update the "dest" argument in the "drawCrosshair" function call
    //to 

    //identify existing center guides layer, or create one
    var guidesLayer = (function()
    {
        for(var l=0;l<layers.length;l++)
        {
            if(layers[l].name === "Center Guides")
                return layers[l];
        }
    })() || layers.add();
    guidesLayer.name = "Center Guides";
    

    //loop through selected items and draw crosshairs on each item
    var curItem,curBounds,curGuideGroup,curLine;
    for(var x=0;x<sel.length;x++)
    {
        curItem = sel[x];
        curBounds = getBoundsData(curItem);
        
        //create a crosshair group on the guides layer
        //change the second argument to "curItem" if you want the crosshairs to be drawn on the item itself
        //currently, curItem would need to be a groupItem.. But if need be, we can add logic to create
        //the necessary group structure and place curItem inside along with the guide. Let me know.
        drawCrosshair(curItem,guidesLayer);
    }


    function drawCrosshair(itemToGuideify,guideDest)
    {
        //make a group to hold the crosshair lines
        //this makes it easier to move stuff around later.
        //potentially this group could be named to match whatever
        //item it's marking. But it depends on whether the items you're
        //marking centerpoints for are named and whether it would even be
        //helpful to have the crosshair groups named. Up to you.
        //let me know if you want to change this and need some help.
        var crosshairGroup = guideDest.groupItems.add();


        //draw the horizontal line
        var crosshairLine1 = crosshairGroup.pathItems.add()
        crosshairLine1.setEntirePath([[0,0],[GUIDE_SIZE,0]]);
        crosshairLine1.filled = false;
        crosshairLine1.stroked = false; 
        
        //draw the vertical line
        var crosshairLine2 = crosshairGroup.pathItems.add()
        crosshairLine2.setEntirePath([[GUIDE_SIZE/2,GUIDE_SIZE/2],[GUIDE_SIZE/2,-GUIDE_SIZE/2]]);
        crosshairLine2.filled = false;
        crosshairLine2.stroked = false;

        //align the crosshairGroup to the center of the desired object
        //hint: you could use this very same logic to add "trim marks" to the corners of the object.
            //simply change last argument from "center" to "topLeft", then duplicate the crosshairGroup
            //and use the "align" function to align the duplicate to the top right corner of the object.
            //repeat for bottom right and bottom left.
        align(itemToGuideify,[crosshairGroup],"center");
        
        //check whether to convert to guides or not
        MAKE_CROSSHAIRS_INTO_GUIDES ? crosshairLine1.guides = true : crosshairLine1.strokeColor = crosshairColor;
        MAKE_CROSSHAIRS_INTO_GUIDES ? crosshairLine2.guides = true : crosshairLine2.strokeColor = crosshairColor;

        
    }
    
}
makeCenterGuide();