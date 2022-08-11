//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//Adobe Discussion Forum Post about this library: 

//*******//

//Did you find this useful? Would you like to buy me a cup (or a pot... or a bucket?) of coffee to say thanks?
//paypal.me/illustratordev
//<3

//*******//

//what's it do??
//returns a clean javascript array of child items matching the given criteria
	//children are typically stored as "collections" which behave like arrays, but have some differences
	//The ability to create an array of items allows you to safely process all of those items without
	//running into indexing issues that arise when creating/deleting items
	//if you loop a collection like Document.swatches, every time you add/delete a swatch, the indexes
	//are reassigned. So if you delete swatches[5], then the swatch that was at swatches[6] will be at
	//swatches[5]. A common mistake is to loop forwards through a collection and then wonder why
	//only half-ish of the items were processed. arrayFromContainer() fixes that and allows for the use
	//of array function polyfills which can seriously clean up the code and help keep variables out
	// of broader scopes. Using callback functions with array functions keeps any variables necessary
	//in the scope of the callback function so they won't interfere with the main code. This is helpful
	//particularly in extendscript/illustrator because it has been shown that declaring variables inside
	//loops is problematic. So a common workaround is to predeclare variables before a loop body and then
	//assign them inside the loop body. After years of doing this.. I hate it. And it's ugly. 

//how do i argue with it?
//container: container object that holds the child items.
	//viable "container" options: App, Layer, Doument, GroupItem, CompoundPathItem,SwatchGroup
//[childType] optional: string representing the type of collection to arrayify
	//viable "childType" options:   "pageItems", "layers", "pathItems", "compoundPathItems", 
	//                  "groupItems", "swatches", "textFonts", "textFrames", "placedItems",
	//                  "rasterItems", "symbolItems", "pluginItems", "artboards", "selection"
	//				"characterStyles", "paragraphStyles", "brushes"
	//if no childType is provided, the childType will be inferred from the container's typename
	//per the DEFAULTS object in the code;


function afc(container, childType) {
	var result = [];
	var ctn = container.typename;
	if (!ctn.match(/app|adobe|document|layer|group|compound|text/i)) {
		$.writeln("ERROR: afc(" + container.name + "," + childType + ");");
		$.writeln("Can't make array from this container. Invalid container type: " + container.typename);
		return [];
	}

	const DEFAULTS = {"app":"documents","SwatchGroup":"swatches", "Document":"layers", "GroupItem":"pageItems", "CompoundPathItem":"pathItems", "TextFrame":"textRanges", "Selection":"pageItems"};

	//if childType was provided, use it. Otherwise, check for a default and use that. Otherwise undefined.	
	childType = childType || DEFAULTS[ctn] || undefined;
	if (!childType.match(/layers|swatches|items|frames|artboards|selection|documents|contents|styles|fonts|brushes/i)) {
		$.writeln("ERROR: afc(" + container.name + "," + childType + ");");
		$.writeln("Can't make array from this container. Invalid child item type: " + childType);
		return [];
	}

	var items = container[childType];
	if(!items)
	{
		$.writeln("ERROR: afc(" + container.name + "," + childType + ");");
		$.writeln(container.typename + "." + childType + " is undefined");
		return [];
	}
	for (var x = 0; x < items.length; x++) {
		result.push(items[x])
	}
	return result;
}
//alternate more verbose function name for easier code reading maybe?
function arrayFromContainer(container, childType) {
	return afc(container, childType);
}