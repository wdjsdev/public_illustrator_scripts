//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//Adobe Discussion Forum Post about this library: https://community.adobe.com/t5/illustrator/library-for-aligning-objects-via-script/m-p/11925954#M269613

//*******//

//Did you find this useful? Would you like to buy me a cup of coffee to say thanks?
//paypal.me/illustratordev
//<3

//*******//



//Alignment Functions
//
//given a key object and an an array of path items
//align all objects to the key object
//function also accounts for any invisible "clipped" artwork which normally
//messes up positioning because the invisible art is included in the bounds of the art.

//arguments
//key : any pageItem or artboard object
//otherObjects: Array of page items to align


//Dependencies
//
//object_bounds_data.js : https://github.com/wdjsdev/public_illustrator_scripts/blob/master/object_bounds_data.js

#include "object_bounds_data.js";


Array.prototype.forEach = function ( callback, startPos, inc )
{
	inc = inc || 1;
	startPos = startPos || 0;
	for ( var i = startPos; i < this.length; i += inc )
		callback( this[ i ], i, this );
};


//customize these "alignType" arguments to your hearts desire
//whatever tickles your brain just right.
function align ( key, otherObjects, alignType )
{
	switch ( alignType )
	{
		//center horizontally and vertically
		case "center":
			doTheAligning( key, otherObjects, "vc", "hc" );
			break;

		//center vertically by centerpoints
		case "vcenter":
			doTheAligning( key, otherObjects, "vc", undefined );
			break;

		//align top of objects to top of key
		case "vtop":
			doTheAligning( key, otherObjects, "t", undefined );
			break;

		//align bottom of objects to bottom of key
		case "vbottom":
			doTheAligning( key, otherObjects, "b", undefined );
			break;

		//center horizontally by centerpoints
		case "hcenter":
			doTheAligning( key, otherObjects, undefined, "hc" );
			break;

		//align left of objects to left of key
		case "hleft":
			doTheAligning( key, otherObjects, undefined, "l" );
			break;

		//align right of objects to right of key
		case "hright":
			doTheAligning( key, otherObjects, undefined, "r" );
			break;

		//align bottom left of objects bottom left of key
		case "botleft":
			doTheAligning( key, otherObjects, "b", "l" );
			break;

		//align bottom right of objects bottom right of key
		case "botright":
			doTheAligning( key, otherObjects, "b", "r" );
			break;

		//align top left of objects top left of key
		case "topleft":
			doTheAligning( key, otherObjects, "t", "l" );
			break;

		//align top right of objects top right of key
		case "topright":
			doTheAligning( key, otherObjects, "t", "r" );
			break;

		//align left of objects to left of key, and vertical center of object to verical center of key
		case "leftcenter":
			doTheAligning( key, otherObjects, "vc", "l" );
			break;

		//align right of objects to right of key, and vertical center of object to verical center of key
		case "rightcenter":
			doTheAligning( key, otherObjects, "vc", "r" );
			break;

		//align top of objects to top of key, and horizontal center of object to horizontal center of key
		case "topcenter":
			doTheAligning( key, otherObjects, "t", "hc" );
			break;

		//align bottom of objects to bottom of key, and horizontal center of object to horizontal center of key
		case "botcenter":
			doTheAligning( key, otherObjects, "b", "hc" );
			break;

	}
}


function doTheAligning ( key, otherObjects, va, ha )
{
	var destBounds = getBoundsData( key );
	if ( !destBounds )
	{
		$.writeln( "Error: No bounds data found for key object" );
		return undefined;
	}
	otherObjects.forEach( function ( item )
	{
		var itemBounds = getBoundsData( item );
		if ( !itemBounds.w ) return;
		if ( va ) //vertical alignment
		{
			switch ( va )
			{
				case "vc":
					item.top = destBounds.vc + itemBounds.hh; //vertical center point of key + half height of item
					break;
				case "t":
					item.top = destBounds.t; //top of key
					break;
				case "b":
					item.top = destBounds.b + itemBounds.h; //bottom of key + height of item
			}

		}
		if ( ha ) //horizontal alignment
		{
			switch ( ha )
			{
				case "hc":
					item.left = destBounds.hc - itemBounds.hw; //horizontal center point of key - half width of item
					break;
				case "l":
					item.left = destBounds.l; //left of key
					break;
				case "r":
					item.left = destBounds.r - itemBounds.w; //right of key - width of item
			}
		}
	} );
}


