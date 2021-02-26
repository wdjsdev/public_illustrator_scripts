/*
	User Request: 
		Hi Dilliam,

		I saw your generous contribution to the community on illustrator scripting.
		Could you help me with the following?

		I am trying to select the two sublayer group of all items in it to add into my
		Action automation. Here is a screenshot:
		https://www.screencast.com/t/0Qd2BCZqlZb

		Please take note my main group in this example call education-props is
		different all the time. But the "color" and "shadow" sublayer group are
		consistent and I just need to select those

	Script Info:
	------------
	Script Name: select specific sublayers
	
	Script description: loop the layers in the document. if any top-level sublayer names
		exist in the "subLayersToSelect" array, select all of the artwork on those layers

	Script requirements: Active illustrator document, any version

	Script notes:
		If there are no sublayers matching any of the items in the array, nothing will happen. no error, but nothing else either.
		The "case" of the layer names is irrelevant. Everything gets converted to lowercase while comparing. Always use lowercase words in the "subLayersToSelect" array.

*/



function selectSpecificSubLayers()
{
	var doc = app.activeDocument;
	var layers = doc.layers;

	//array.indexOf()
	Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;}

	//add as many things as you want to this list. any top level sublayer with a name
	//matching what's on this list will get selected
	var subLayersToSelect = ["shadow","color"]; 
	
	var curLay,subLay;
	for(var x=0;x<layers.length;x++)
	{
		curLay = layers[x];
		for(var y=0;y<curLay.layers.length;y++)
		{
			subLay = curLay.layers[y];
			if (subLayersToSelect.indexOf(subLay.name.toLowerCase())>-1)
			{
				subLay.hasSelectedArtwork = true;
			}
		}
	}
}