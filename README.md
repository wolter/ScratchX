# ScratchX SmartHome Extension
With the [smarthome_extension.js](http://wolter.github.io/ScratchX/smarthome_extension.js "SmartHome extension for ScratchX") you get a ScratchX extension for the use with Eclipse SmartHome, openHAB 2 and QIVICON via REST. [ScratchX](http://scratchx.org/ "ScratchX") is an extensible sibling of Scratch which is a project of the Lifelong Kindergarten Group at the MIT Media Lab.

The **purpose** of this extension is to allow almost everybody to write programs for a SmartHome including kids with just little knowledge of computer science. Scratch is widely used to teach people of every age programming. Therefore, it might be a good fit. Furthermore, one is now able to connect Scratch programs with the physical world via a SmartHome installation. For example you can invent your own control panel or rules in Scratch using your Sonos audio device, light bulbs and interactive animations and games in Scratch.

## Quickstart
In case you already have a running REST endpoint, you gain immediate access to the new SmartHome related function blocks accessing the URL http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch. Once loaded the [blocks](#Blocks) are located in the 'More Blocks' section.

## Prerequisites and Configuration
Please note, your REST endpoint needs to support CORS (Cross-origin resource sharing). You find this option within Eclipse SmartHome in the smarthome.cfg-file (located at [distribution\smarthome\conf\smarthome.cfg](https://github.com/eclipse/smarthome/blob/master/distribution/smarthome/conf/smarthome.cfg#L15-L19 "Eclipse SmartHome configuration")), openHAB 2 stores this settings in the [services.cfg-file](https://github.com/openhab/openhab2/blob/master/distribution/openhabhome/runtime/etc/services.cfg#L26 "openHAB 2 configuration").
```
# Set the rest api to be under /rest 
com.eclipsesource.jaxrs.connector:root=/rest 
# Uncomment to enable rest api CORS requests 
org.eclipse.smarthome.cors:enable=true 
```
There you need to enabled CORS as shown above (for openHAB 2 you just need to add the missing `org.eclipse.smarthome.cors:enable=true`). Furthermore, you can configure the REST endpoint's path. In case you use a different path you can either set this with the `set endpoint` block in ScratchX or create your own branch of the extension with a custom endpoint (see https://github.com/wolter/ScratchX/blob/master/smarthome_extension.js#L9).

This extension is tested with Google Chrome 47.0.2526.80 and Adobe Flash Player 20.0.0.228 (Shockwave Flash 20.0) on Windows 10 64 Bit.

## <a name="Blocks"></a>Blocks

- `set endpoint to URL`: allows to change the URL of the REST endpoint including port, and path in case it differs from the standard Eclipse SmartHome;
- `get item ITEM`: is just a helper block to retrieve and select a single predefined ITEM;
- `send command COMMAND to item ITEM`: sends the command COMMAND to the given ITEM;
- `set state of item ITEM to VALUE`: sets the state of the ITEM to the given VALUE;
- `get state from item ITEM` gets the current value of the given ITEM;
- `when state of ITEM changed` is a hat block which executes its children once the ITEM's status has changed;

### Hints and Limitations
The `get item ITEM` block's purpose is to make ITEM selection easier. Unfortunately selection menus for blocks can only created and updated before registration of an extension. Thus, only initial available items of the given endpoint are visible. In other circumstance you have to firstly change the endpoint with `set endpoint to URL` and secondly you might need to figure out the items manully. The latter can be done with accessing the REST API directly using a HTTP GET similar to  http://127.0.0.1:8080/rest/items.

The `when state of ITEM changed` is a little tricky due to the ScratchX extension handling. In case events will happen to fast or the execution of single blocks takes to long, events might be lost and/or blocks not executed. The reason is explained at https://github.com/LLK/scratchx/issues/40.

## Branching and Extending

If you like to create your own branch of this extension, you find a documentation  of the ScratchX extensibility at https://github.com/LLK/scratchx/wiki. In any case you need to host your extension in a way, ScratchX can access it. For instance as a GitHub Page ([gh-pages branch](https://github.com/wolter/ScratchX/tree/gh-pages "GitHub Pages branch")) with this [crossdomain.xml-file](https://github.com/wolter/ScratchX/blob/gh-pages/crossdomain.xml "Gain crossdomain access").
