/*
	Script Name:
		Get Registration marks
	
	Script Description: 
		Select all items using the registration fill color. 
		Loop selected items to determine if they meet min/max size criteria
		Selected items that meet criteria are moved to registration layer
		Selected items that do not meet criteria can be deleted or ignored

	Author: 		 	
		William Dowling
		Email: 				illustrator.dev.pro@gmail.com
		Github:				github.com/wdjsdev
		Paypal:				paypal.me/illustratordev
	
	Forum Post: 
		https://community.adobe.com/t5/illustrator-discussions/script-to-select-multiple-objects-that-are-all-sized-the-same/td-p/12460743

	Github Repo:
		https://github.com/wdjsdev/public_illustrator_scripts/blob/master/get_registration_marks.js
	


*/


function getRegMarks()
{
	var searchSwatchName = "DIE";
	// set up the script and declare some variables
	var doc = app.activeDocument;
	var layers = doc.layers;
	var swatches = doc.swatches;
	var regSwatch = swatches[searchSwatchName];

	// deselect all and then select all items that are filled with [Registration] color
	doc.selection = null;
	doc.defaultFillColor = regSwatch.color;
	app.executeMenuCommand("Find Fill Color menu item");

	// check to see whether any items were selected.
	// if not, alert the user and exit.
	var sel = doc.selection;
	if (!sel.length)
	{
		alert("No registration marks found.");
		return;
	}

	// if we've gotten this far that means registration marks have been successfully
	// selected. now let's create a new layer to copy them to. 
	var myRegMarksLayer = layers.add();
	myRegMarksLayer = "Registration";
	// You can also target
	// an existing layer by name instead of creating a new one.
	// to use an existing layer, you can get it like this:
	// var myRegMarksLayer = layers["Registration"]; // just enter the name of the layer you want between the brackets



	// here we set a variable to determine whether a selected object is
	// the correct size. Let's say your registration circles are 50pt in
	// diameter and your other mark that you need to delete is 25pt wide/tall
	// if we set the minimum size variable to, say, 45pt, then we can check
	// the dimensions of each selected piece to see if it meets the minimum size
	// requirement. any pieces that do not meet the requirement can be deleted or ignored.

	var minimumSize = 45; // use this line if you only want items that are at least this big
	// var maximumSize = 50; // use this line if you only want items that are at MOST this big.


	for (var s = sel.length - 1; s >= 0; s--)
	{
		// now, let's check to see if the current selected item
		// meets the min/max criteria set above
		// i'm assuming we're just checking width here. but
		// you can change this to height if you want, or you could
		// get some information about the area of the object
		// if that is more useful.

		if (sel[s].width >= minimumSize)
		{
			sel[s].moveToBeginning(myRegMarksLayer);
		}
		else
		{
			// choose what to do here.. you can ignore it.. 
			// or you can delete it. if you want to ignore it,
			// just comment the next line.
			sel[s].remove();
		}
	}
}
getRegMarks();