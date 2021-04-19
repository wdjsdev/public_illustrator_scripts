/*

	Script Name: Rasterize Selection
	Author: William Dowling
	Email: illustrator.dev.pro@gmail.com

	Do you find this script useful? Please consider
		buying me a cup of coffee to say thanks! =)
	Paypal: paypal.me/illustrator_dev

	Description: Rasterize each item of the selection
		individually (i.e. each item should be its own
		raster image, not one raster image including all
		the items together.)

	Requirements: 
		Illustrator CS6 or newer
		An open document with at least one item selected.

*/

#target Illustrator
function rasterizeSelection()
{
	var doc = app.activeDocument;
	var sel = doc.selection;
	if(!sel.length)
	{
		alert("Please make a selection and try again.");
		return;
	}

	//put all the selected items in an array
	//so that we can loop that array instead of
	//the selection. this will help avoid any
	//issues of indexes changing due to altering
	//the items
	var selArr = [];
	for(var x=0;x<sel.length;x++)
	{
		selArr.push(sel[x]);
	}


	//loop the array of selected items and rasterize
	//each one individually to ensure the end result
	//is one raster image for each selected item
	for(var x=0;x<selArr.length;x++)
	{
		doc.selection = null;
		selArr[x].selected = true;
		app.executeMenuCommand("Rasterize 8 menu item");
	}

}
rasterizeSelection();