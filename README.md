# ScratchX
Scratch extensions for the use with REST, Eclipse SmartHome, openHAB and QIVICON. ScratchX is available at http://scratchx.org/. Starting including this extension works easiest with http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch (works in Google Chrome). New blocks are available in the More Blocks section. The following blocks are available:

- set endpoint to URL: allows to change URL, port, and path of the REST endpoint if it differs from standard Eclipse SmartHome
- get all items: is just a helper block to retrieve all available items
- set state of item ITEM to VALUE: sets the state of the ITEM to the given value
- get state from item ITEM: gets the current value of the given item
- when state of ITEM changed: is a hat block which executes its children once the ITEM's status has changed