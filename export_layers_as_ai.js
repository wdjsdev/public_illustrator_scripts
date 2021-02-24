#target Illustrator
function exportLayersAsNewAiFiles()
{
	var docRef = app.activeDocument;
	var docPath = docRef.fullName;
	var layers = docRef.layers;



	//change this to whatever you want
	var savePath = "~/Desktop/";

	//or if you'd prefer a dialog to select a folder
	//use this instead
	// var saveFolder = Folder.selectDialog("Select a folder to export your files.");
	// if(!saveFolder)
	// {
	// 	alert("User cancelled folder select dialog. Exiting.");
	// 	return;
	// }
	// var savePath = saveFolder.fullName;




	//make sure there actually is a folder to save into
	if(!Folder(savePath).exists)
	{
		Folder(savePath).create();
	}

	//process each layer.
	loopLayers(layers,saveLayerAsAi);


	







	function loopLayers(layers,func)
	{
		for(var x=0;x<layers.length;x++)
		{
			func(layers[x]);
		}	
	}

	function makeCopyGroup(layer)
	{
		var copyGroup = layer.groupItems.add();
		for(var x = layer.pageItems.length-1;x>=1;x--)
		{
			layer.pageItems[x].duplicate(copyGroup);
		}
		return copyGroup;
	}

	function ungroup(group)
	{
		for(var x=group.pageItems.length-1;x>=0;x--)
		{
			group.pageItems[x].moveToBeginning(group.parent);
		}

	}



	function saveLayerAsAi(layer)
	{
		layer.visible = true;
		layer.locked = false;

		var copyGroup = makeCopyGroup(layer);

		var newDoc = app.documents.add();
		copyGroup.moveToBeginning(newDoc);
		newDoc.layers[0].name = layer.name;

		ungroup(copyGroup);
		
		newDoc.saveAs(File(savePath + layer.name + ".ai"));
		newDoc.close();
		docRef.activate();

	}
}

if(app.documents.length)
	exportLayersAsNewAiFiles();
else
	alert("Please open a document first.");