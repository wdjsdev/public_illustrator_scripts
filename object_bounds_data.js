
function getVisibleBounds ( object )
{
    //stolen from Josh B Duncan.
    //and "improved" (in my opinion) by me.
    //https://github.com/joshbduncan/adobe-scripts/blob/main/MatchObjects.jsx
    var bounds, clippedItem, sandboxItem, sandboxLayer;
    var curItem;
    if ( object.typename == "GroupItem" )
    {
        // if the object is clipped
        if ( object.clipped )
        {
            // check all sub objects to find the clipping path
            for ( var i = 0; i < object.pageItems.length; i++ )
            {
                curItem = object.pageItems[ i ];
                if ( curItem.clipping )
                {
                    clippedItem = curItem;
                    break;
                } else if ( curItem.typename == "CompoundPathItem" )
                {
                    if ( !curItem.pathItems.length )
                    {
                        // catch compound path items with no pathItems via william dowling @ github.com/wdjsdev
                        sandboxLayer = app.activeDocument.layers.add();
                        sandboxItem = curItem.duplicate( sandboxLayer );
                        app.activeDocument.selection = null;
                        sandboxItem.selected = true;
                        app.executeMenuCommand( "noCompoundPath" );
                        sandboxLayer.hasSelectedArtwork = true;
                        app.executeMenuCommand( "group" );
                        clippedItem = app.activeDocument.selection[ 0 ];
                        break;
                    } else if ( curItem.pathItems[ 0 ].clipping )
                    {
                        clippedItem = curItem;
                        break;
                    }
                } else
                {
                    clippedItem = curItem;
                    break;
                }
            }
            bounds = clippedItem.geometricBounds;
            if ( sandboxLayer )
            {
                // eliminate the sandbox layer since it's no longer needed
                sandboxLayer.remove();
                sandboxLayer = undefined;
            }
        } else
        {
            // if the object is not clipped
            var subObjectBounds;
            var allBoundPoints = [ [], [], [], [] ];
            // get the bounds of every object in the group
            for ( var i = 0; i < object.pageItems.length; i++ )
            {
                curItem = object.pageItems[ i ];
                subObjectBounds = getVisibleBounds( curItem );
                allBoundPoints[ 0 ].push( subObjectBounds[ 0 ] );
                allBoundPoints[ 1 ].push( subObjectBounds[ 1 ] );
                allBoundPoints[ 2 ].push( subObjectBounds[ 2 ] );
                allBoundPoints[ 3 ].push( subObjectBounds[ 3 ] );
            }
            // determine the groups bounds from it sub object bound points
            bounds = [
                Math.min.apply( Math, allBoundPoints[ 0 ] ),
                Math.max.apply( Math, allBoundPoints[ 1 ] ),
                Math.max.apply( Math, allBoundPoints[ 2 ] ),
                Math.min.apply( Math, allBoundPoints[ 3 ] ),
            ];
        }
    } else
    {
        bounds = object.geometricBounds;
    }
    return bounds;
}


//return an object with easy to use common properties
//including some that aren't available in the api, like "right" and "bottom"
//centerpoints, etc. 
function getBoundsData ( item )
{
    var bounds = getVisibleBounds( item );
    var result = {};

    result.l = result.left = bounds[ 0 ]; //left
    result.t = result.top = bounds[ 1 ]; //top
    result.r = result.right = bounds[ 2 ]; //right
    result.b = result.bottom = bounds[ 3 ]; //bottom
    result.w = result.width = result.r - result.l; //width
    result.h = result.height = result.t - result.b; //height
    result.hh = result.halfHeight = result.h / 2; //half of item height
    result.hw = result.halfWidth = result.w / 2; //half of item width
    result.hc = result.horizontalCenter = result.l + result.halfWidth; //horizontal center
    result.vc = result.verticalCenter = result.t - result.halfHeight; //vertical center
    result.maxDimProp = result.w > result.h ? "width" : "height"; // larger dimension of width and height
    result.maxDim = result.maxDimProp.match( /w/i ) ? result.w : result.h; // larger dimension of width and height

    result.clip = result.clippedArtwork = {}; //measurements of amount of artwork clipped/invisible
    result.clip.leftClipped = result.clip.l = result.l - item.left; // how much is clipped off the left side of the item
    result.clip.topClipped = result.clip.t = item.top - result.t; // how much is clipped off the top of the item
    result.clip.rightClipped = result.clip.r = item.right - result.r; // how much is clipped off the right side of the item
    result.clip.bottomClipped = result.clip.b = result.b - item.bottom; // how much is clipped off the bottom of the item

    return result;
}