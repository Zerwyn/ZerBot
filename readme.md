Twitch bot in Node.js
=====================

Implements tmi.js : https://tmijs.com/

- Play audio notification at message channel after inactivity
- Handle twitch tchat commands
- Connect to Twitch API and refresh Bearer

Use .env
--------

Create a ".env" file in root directory
```
USERNAME=<botName>
TOKEN=<oauthToken>  ( Get your own here : https://twitchapps.com/tmi/)
CHANNELS=<channel1,channel2>
```

If you want to use the Twitch API - register your app and add those tokens : https://dev.twitch.tv/console/apps/create

```
API=1
CLIENTSECRET=<>
ACCESSTOKEN=<>
```
Read this for more infos : https://dev.twitch.tv/docs/irc