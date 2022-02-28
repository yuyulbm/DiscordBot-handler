# Advanced Handler For Discord.js 

### Before Using This 

* put your [bot token](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/index.js#:~:text=client.login(%22Your%20Token%22)%3B) in index.js and have a [webhook link](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/index.js#:~:text=const%20errorhook%20%3D%20new%20WebhookClient(%7B%22Your%20webhook%20link%22%7D)) for errors
* put your mongo db string in [handler/index.js](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/handler/index.js#:~:text=await%20mongoose.connect(%22Your%20Mongo%20String%22).then(()%20%3D%3E%20console.log(%27Connected%20to%20mongodb%27))%3B)
* go to [emoji.js](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/emojis.js) and change them to yours
* update ready.js in [events/ready.js](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/events/ready.js) to your [logs channel](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/events/ready.js#:~:text=%27Your%20logs%20channel%20id%27)

>This is an advanced handler that my bot gentleman uses 
>i dint make the handler i just modified it to make it easy to use the original one is from [here](https://github.com/reconlx/djs-base-handler) 
>i hope yall enjoy using this handler as i enjoy using it for my bot

## How To Use
```js
const { MessageEmbed, Permissions } = require("discord.js");
const emo = require('../../emojis)//your emojis
module.exports = {
name: 'cmd',
aliases: ["command","test"],//other names for command
userPerms: ["KICK_MEMBERS"],//user permissions 
botPerms: ["MANAGE_CHANNELS"],//bot permissions 
msgLimit: [100],//message content limit, i use it for 8ball command so the bot does not get rate limited
usage: "<@user>",//how to use the command will in the help command
description: "just a normal command",//description for the command will display in the help command
run: async (client, message, args) => {
  message.reply({ content: [`${emo.emoji1} | Hello There`] })
  },
  };
  ```
