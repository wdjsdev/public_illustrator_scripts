/*
	Script Name: copy layers to new doc
	Author: William Dowling
	Email: illustrator.dev.pro@gmail.com
	Forum Post: https://community.adobe.com/t5/illustrator/prepopulate-layers-with-simple-object-i-e-rectangle/td-p/11981726

	If you find this free script useful,
	please consider buying me a cup of coffee to say thanks. =)
	Paypal: paypal.me/illustratordev

	Description: Create a new document with a layer structure matching
		the current active document. Since layers cannot be directly copied
		the following "workaround" is used:

		create a rectangle in each layer and sublayer of
		document, then copy/paste all rectangles into new document
		with "pasteRemembersLayers" turned on to recreate layer
		structure in new document. Then remove all the temp rectangles
		so that the original file is unchanged, and the new file just
		has empty layers matching the original document.

		Alternatively you can define an array of layers if you only
		want to bring in certain top level layers. See comment in code below

		All child sublayers will come in along with any layer you copy.

*/


#target Illustrator
function copyLayersToNewDoc()
{
	var doc = app.activeDocument;
	var layers = doc.layers;


	//copy all layers and sublayers 
	var layersToCopy = layers;

	//alternatively, you could feed in a specific
	//set of layers if you only want to copy some of them.
	//you can get layers by index or by name
	// 
	// var layersToCopy = [layers[0], layers["My Layer"]];
	


	function addRects(layers)
	{
		for(var x=0;x<layers.length;x++)
		{
			rects.push(layers[x].pathItems.rectangle(0,0,50,50));
			if(layers[x].layers.length)
			{
				addRects(layers[x].layers);
			}
		}
	}

	function copyRects(rects)
	{
		doc.selection = null;
		for(var x=0;x<rects.length;x++)
		{
			rects[x].selected = true;
		}
		app.copy();
	}

	function removeRects(rects)
	{
		for(var x= rects.length-1;x>=0;x--)
		{
			rects[x].remove();
		}
	}

	var rects = [];
	addRects(layersToCopy);
	

	copyRects(rects);

	app.pasteRemembersLayers = true;
	var newDoc = app.documents.add();
	app.executeMenuCommand("pasteInPlace");
	app.pasteRemembersLayers = false;

	removeRects(newDoc.selection);
	removeRects(rects);
	

	
}
copyLayersToNewDoc();