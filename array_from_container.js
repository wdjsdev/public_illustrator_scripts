// IDEA: implement some kind of "pseudo overload" to allow for 
//passing in a parent or an array of parents, as well as an array
//of child types. This would allow the user to get one array containing
//all the children of multiple specific types from multiple specific parents.
//say you wanted all textFrames and pathItems from the layers "myLayer" and "myOtherLayer"
//you could do:
//var myArray = afc(["myLayer","myOtherLayer"],["textFrames","pathItems"]);





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
//containers: container object (or array of container objects) that holds the child items.
//viable "container" options: App, Layer, Doument, GroupItem, CompoundPathItem,SwatchGroup
//[childTypes] optional: string (or array of strings) representing the type of collection to arrayify
//viable "childTypes" options:   	"pageItems", "layers", "pathItems", "compoundPathItems", 
//                  				"groupItems", "swatches", "textFonts", "textFrames", "placedItems",
//                 					"rasterItems", "symbolItems", "pluginItems", "artboards", "selection"
//									"characterStyles", "paragraphStyles", "brushes"
//if no childTypes is provided, the childTypes will be inferred from the container's typename
//per the DEFAULTS object in the code; 


function afc ( containers, childTypes )
{
	const CHILD_TYPE_OPTIONS = [ "pageItems", "layers", "pathItems", "compoundPathItems", "groupItems", "swatches", "textFonts", "textFrames", "placedItems", "rasterItems", "symbolItems", "pluginItems", "artboards", "selection", "characterStyles", "paragraphStyles", "brushes" ];
	const DEFAULTS = { "app": "documents", "SwatchGroup": "swatches", "Document": "layers", "GroupItem": "pageItems", "CompoundPathItem": "pathItems", "TextFrame": "textRanges", "Selection": "pageItems", "all": "all", undefined: "pageItems" };
	var result = [];

	if ( !containers.toString().match( /array/i ) )
	{
		containers = [ containers ];
	}
	if ( !childTypes.toString().match( /array/i ) )
	{
		childTypes = childTypes || DEFAULTS[ ctn ] || ( function () { $.writeln( "No childTypes given. Defaulting to pageItems" ); return "pageItems"; } )();
		childTypes = [ childTypes ];
	}


	function loopArray ( array, callback )
	{
		for ( var i = 0; i < array.length; i++ )
		{
			callback( array[ i ], i );
		}
	}

	loopArray( containers, function ( curContainer )
	{
		//validate containers
		var ctn = curContainer.typename;
		if ( !ctn.match( /app|adobe|document|layer|group|compound|text/i ) )
		{
			$.writeln( "ERROR: afc(" + containers.name + "," + childTypes + ");" );
			$.writeln( "Can't make array from this containers. Invalid containers type: " + containers.typename );
			return [];
		}

		loopArray( childTypes, function ( curChildType )
		{
			if ( !curContainer[ curChildType ] )
			{
				$.writeln( "ERROR: afc(" + containers.name + "," + childTypes + ");" );
				$.writeln( "Can't make array of " + curChildType + " from this container." );
				return;
			}

			for ( var i = 0; i < curContainer[ curChildType ].length; i++ )
			{
				result.push( curContainer[ curChildType ][ i ] );
			}

		} );
	} )

	return result;
}
//alternate more verbose function name for easier code reading maybe?
function arrayFromContainer ( containers, childTypes )
{
	return afc( containers, childTypes );
}

function test ()
{
	var doc = app.activeDocument;
	var layers = doc.layers;
	var parents = [ doc, layers[ "parentLayer" ], layers[ "groupItem" ].groupItems[ 0 ], layers[ "compoundPathItem" ].compoundPathItems[ 0 ], doc.swatchGroups[ 0 ], layers[ "textFrame" ].textFrames[ 0 ], app ];
	var children = [ "layers", "pageItems", "pathItems", "compoundPathItems", "groupItems", "swatches", "textFonts", "textFrames", "placedItems", "rasterItems", "symbolItems", "pluginItems", "artboards", "selection", "characterStyles", "paragraphStyles", "brushes" ];

	parents.forEach( function ( curParent )
	{
		$.writeln( "//////////////\nTesting Parent: " + curParent.toString() + "\ncurParent.name = " + curParent.name + "\n//////////////" );
		children.forEach( function ( curChild )
		{
			if ( curParent.toString().match( /document/i ) && curChild.match( /items/i ) ) return;
			$.writeln( "/////\nTesting Child: " + curChild + "\ncurChild.name = " + curChild.name + "\n/////" );
			var result = afc( curParent, curChild );
			$.writeln( curParent.name + " " + curChild + ": " + result.length );
			$.writeln( result.join( ", " ) );
		} );

		$.writeln( "\n\n\n" );
	} )

}
test();