## External Editors support

### Protocol
Current api supports, below endpoint which can be used to fetch 
and save notes without any additional functions.
`{host}/api/content/{collection}/{nodeId}`

### In App
Currently, external editors are opened in iframe with
below parameters in search url. 
- host 
- collection
- nodeId 
- token

### Configuration file

Configuration file is located at `/app/public/config.json`

```json
{
	"host": "HOST",
	"editors" :[
		{
			"label": "LABEL to be showed in the app",
			"url": "URL of the editor",
            "title": "true/false - shows the node title on top",
		},
		...
	]
}
```
