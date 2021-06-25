function arrayFromContainer(container,crit)
{
	if(!container)return [];

	var result = [];
	var items;
	if(!crit || crit === "any")
	{
		items = container.pageItems;
	}
	else
	{
		items = container[crit];
	}
	for(var x=0;x<items.length;x++)
	{
		result.push(items[x])
	}
	return result;
}