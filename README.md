# ScratchX
Scratch extensions for the use with REST, Eclipse SmartHome, openHAB and QIVICON. ScratchX is available at http://scratchx.org/.

Please note, your Smart Home installation needs to support CORS; For instance you find this option for Eclipse SmartHome in the smarthome.cfg-file (located at distribution\smarthome\conf\smarthome.cfg). There you finde the following two important settings for the REST endpoint's path and CORS: 

- com.eclipsesource.jaxrs.connector:root=/rest
- org.eclipse.smarthome.cors:enable=true

Starting works easiest with http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch (works in Google Chrome). The new blocks are available in the More Blocks section and offer the followin features:

- set endpoint to URL: allows to change URL, port, and path of the REST endpoint if it differs from standard Eclipse SmartHome
- get item ITEM: is just a helper block to retrieve and select items (unfortunately only initial available items of the given endpoint are visible)
- send command COMMAND to item ITEM: sends the command COMMAND to the given item
- set state of item ITEM to VALUE: sets the state of the ITEM to the given value
- get state from item ITEM: gets the current value of the given item
- when state of ITEM changed: is a hat block which executes its children once the ITEM's status has changed

Unfortunately the "when state of ITEM changed" is a little tricky due to the ScratchX extension handling. In case events will happen to fast or the execution of single blocks takes to long, events might be lost. The reason is explained here: https://github.com/LLK/scratchx/issues/40.  
