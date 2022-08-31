# Advanced handler for Discord.js 

### Before using this! 

* Put your [bot token](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/index.js#:~:text=client.login(%22Your%20Token%22)%3B) in index.js and have a [channel for errors](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/index.js#:~:text=let%20errChannel%20%3D%20%22Your%20logs%20channel%20id%22%3B)
* put your mongo db string in [handler/index.js](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/handler/index.js#:~:text=await%20mongoose.connect(%22Your%20Mongo%20String%22).then(()%20%3D%3E%20console.log(%27Connected%20to%20mongodb%27))%3B)
* go to [emoji.js](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/emojis.js) and change them to yours
* update ready.js in [events/ready.js](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/events/ready.js) to your [logs channel](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/events/ready.js#:~:text=%27Your%20logs%20channel%20id%27)
* to change prefix go to [events/messageCreate.js](https://github.com/Shinpi-Tekita/advanced-handler/blob/main/events/messageCreate.js#:~:text=%7D%20if(!data)%20%7B-,const%20prefix%20%3D%20%22%24%22,-custom%20%3D%20prefix)

>This is an advanced handler that my bot gentleman uses 
>i didn't make the handler i just modified it to make it easy to use the original one is from [here](https://github.com/reconlx/djs-base-handler) 
>i hope yall enjoy using this handler as i enjoy using it for my bot

Join the [server]() for additional help
