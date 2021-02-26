#target Illustrator

function exportLayersAsNewAiFiles()
{
	var docRef = app.activeDocument;
	var docPath = docRef.fullName;
	var layers = docRef.layers;



	//change this to whatever you want
	var savePath = "~/Desktop/";

	//or if you'd prefer a dialog to select a frolder
	//use this instead
	// var saveFolder = Folder.selectDialog("Select a folder to export your files.");
	// if(!saveFolder)
	// {
	// alert("User cancelled folder select dialog. Exiting.");
	// return;
	// }
	// var savePath = saveFolder.fullName;



	//make sure there actually is a folder to save into
	if (!Folder(savePath).exists)
	{
		Folder(savePath).create();
	}

	//process each layer.
	loopLayers(layers, saveLayerAsAi);



	function loopLayers(layers, func)
	{
		for (var x = 0; x < layers.length; x++)
		{
			func(layers[x]);
		}
	}

	function makeCopyGroup(layer)
	{
		var copyGroup = layer.groupItems.add();
		for (var x = layer.pageItems.length - 1; x >= 1; x--)
		{
			layer.pageItems[x].duplicate(copyGroup);
		}
		return copyGroup;
	}

	function ungroup(group)
	{
		for (var x = group.pageItems.length - 1; x >= 0; x--)
		{
			group.pageItems[x].moveToBeginning(group.parent);
		}

	}


	//assuming you want to maintain the same artboard dimensions for everything
	function centerArtworkOnArtboard(art,artboard)
	{
		var abRect = artboard.artboardRect;
		var abCenter = [(abRect[2]-abRect[0])/2,(abRect[3]+abRect[1])/2];

		art.left = abCenter[0] - art.width/2;
		art.top = abCenter[1] + art.height/2;
	}

	//or use this instead if you want to fit the artboard to the artwork instead
	function fitArtboardToArt(art)
	{
		app.selection = null;
		art.selected = true;
		app.activeDocument.fitArtboardToSelectedArt(0);
	}



	function saveLayerAsAi(layer)
	{
		layer.visible = true;
		layer.locked = false;

		var copyGroup = makeCopyGroup(layer);

		var newDoc = app.documents.add();
		copyGroup.moveToBeginning(newDoc);
		newDoc.layers[0].name = layer.name;

		
		//use this to center the artwork on the existing artboard
		centerArtworkOnArtboard(copyGroup,newDoc.artboards[0]);

		//or use this one instead if you want to resize the artboard
		//to fit the artwork instead
		// fitArtboardToArt(copyGroup);
		

		ungroup(copyGroup);

		// obj2move.position = new Array((actAbBds[2] - actAbBds[0]) / 2 - obj2move.width / 2, (actAbBds[3] - actAbBds[1]) / 2 + obj2move.height / 2);

		newDoc.saveAs(File(savePath + layer.name + ".ai"));
		newDoc.close();
		docRef.activate();

	}
}

if (app.documents.length)
	exportLayersAsNewAiFiles();
else
	alert("Please open a document first.");