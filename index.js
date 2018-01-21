const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "NDAzNzQ3MzY1OTI5ODc3NTA4.DULykA.CjMsliyucU9jdxa8v6sWbATt5hM";
const PREFIX = ">";

const bot = new Discord.Client();

function play(connection, message){
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]) player(connection, message);
        else connection.disconnect();
    });
}
var servers = {};

bot.on("ready", function(){
    console.log("Iridium Discord bot has been enabled.");
    bot.user.setGame(">help - Developed by Alfredo");
    bot.user.setStatus("dnd");
});

bot.on("message", function(message){

    if(message.content == "4216"){
        message.channel.sendMessage(message.author + ", you called me?");
        return;
    }

    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case "invite":
            message.channel.sendMessage(message.author + ", invite link for the Iridium bot, \nhttps://discordapp.com/api/oauth2/authorize?client_id=403747365929877508&permissions=8&scope=bot")
            break;
        case "help":
            var helpEmbed = new Discord.RichEmbed()
                .setTitle("Iridium Help Command")
                .setDescription("**>help** - Shows this \n**>invite** - Invite Iridium to your server \n**>kick** - Kicks specified player from the server \n**>ban** - Bans a specified player from the server \n**>ip** - IP Address for Server \n**>info** - Displays bot information \n**>guildinfo** - Displays guild information \n**>addrole** - Gives a player a role \n**>say** - Make the bot say a message \n**>owner** - Displays the owner of the bot \n**>dreq** - Division Request \n**>play** - Play a song (link) \n**>skip** - Skip current song \n**>stop** - Stop the song \n**>report** - Report a user \n**>suggest** - Suggest something for the server \n**>mute** - Mute a player \n**>unmute** - Unmute a player")
                .addField("Created By", "Alfredo - Java Dev & GFX#2704 using Node.js and Discord.js")
                .setColor("#2b1b91");
                message.channel.sendMessage(helpEmbed);
            break;
        case "info":
            var bicon = bot.user.displayAvatarURL;
            var infoEmbed = new Discord.RichEmbed()
                .setAuthor("Iridum Discord Bot")
                .setColor("#6f60b2")
                .setThumbnail(bicon)
                .setDescription("Iridium Bot Information")
                .addField("Bot Name", bot.user.username)
                .addField("Bot Users", bot.users.size)
                .addField("Bot Guilds", bot.guilds.size)
                .addField("Bot Created", bot.user.createdAt);
            message.channel.sendMessage(infoEmbed);
            break;
        case "guildinfo":
            let gicon = message.guild.displayAvatarURL;
            var guildinfoEmbed = new Discord.RichEmbed()
                .setThumbnail(gicon)
                .setAuthor("Iridium Discord Bot")
                .setColor("#540377")
                .setDescription("Guild Information for " + message.guild.name)
                .addField("Created On", message.guild.createdAt)
                .addField("Created by", message.guild.owner)
                .addField("Roles", message.guild.roles.size)
                .addField("You Joined", message.member.joinedAt)
                .addField("Total Members", message.guild.members.size)
            message.channel.sendMessage(guildinfoEmbed);
            break;
        case "ip":
            if(message.guild.name == "Mythryl Network"){
                message.channel.sendMessage(message.author + ", Mythryl Network \n_*IP:*_ mc.mythrylnetwork.xyz \n_*Website:*_ http://mythrylnetwork.xyz/ \n_*Shop:*_ http://store.mythrylnetwork.xyz/");
                return;
            }
            message.channel.sendMessage(message.author + ", what ip?");
            break;
        case "addrole":
            if(!message.guild.member(bot.user).hasPermission("MANAGE_ROLES")){
                message.channel.sendMessage(message.author + ", I'm lacking permissions (MANAGE_ROLES)");
                return;
            }
            if(!message.member.hasPermission("MANAGE_ROLES") || message.member.username == "Alfredo - Java Dev & GFX"){
                message.channel.sendMessage(message.author + ", you don't have enough permission to add roles to a player.")
                return;
            }
            if(!args[1]){
                message.channel.sendMessage(message.author + ", you must specify a player")
                return;
            }
            if(!args[2]){
                message.channel.sendMessage(message.author + ", you must specify a role")
                return;
            }
            var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
            if(!user){
                message.channel.sendMessage(message.author + ", " + user + " was not found in the guild.")
                return;
            }
            if(!message.guild.roles.find('name', args[2])){
                message.channel.sendMessage(message.author + ", could not find that role!");
                return;
            }
            var role = message.guild.roles.find('name', args[2]).id
            message.guild.members.get(user.id).addRole(role);
            message.channel.sendMessage(message.author + ", added role " + role + ", to player " + user);
            break;
        case "selfrole":
            if(message.member.username == "Alfredo - Java Dev & GFX"){

            if(!args[1]){
                message.channel.sendMessage(message.author + ", no roles specified");
                return;
            }
            if(!message.guild.roles.find('name', args[1])){
                message.channel.sendMessage(message.author + ", could not find that role!");
                return;
            }
            var role = message.guild.roles.find('name', args[1]).id
            message.guild.members.get(message.author.id).addRole(role);
            message.channel.sendMessage(message.author + ", addded role " + role + " to yourself.")
            return;
        }
            break;
        case "say":
            if(!args[1]){
                message.channel.sendMessage(message.author + ", you must provide a message for me to say.");
                return;
            }
            var msg = message.content.substring(4);
            message.delete(1);
            if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.sendMessage(message.author + ", you don't have enough permission to use say.");

            var sayEmbed = new Discord.RichEmbed()
                .setAuthor(bot.user.username)
                .setDescription(msg)
                .setColor("#93ff28");
            message.channel.sendMessage(sayEmbed)
            break;
        case "owner":
            if(message.author.username == "Alfredo - Java Dev & GFX"){
                message.channel.sendMessage(message.author + ", you're my owner Alfredo!");
                return;
            }
            message.channel.sendMessage(message.author + ", Alfredo - Java Dev & GFX#2704 is my owner");
            break;
        case "dreq":
            message.delete(1);
            if(!args[1]){
                var dreqEmbed1 = new Discord.RichEmbed()
                    .setTitle("Iridium Division Request")
                    .setColor("#ff285a")
                    .setDescription("Usage: >dreq Development")
                    .addField("Divisions", "Development, Art, Fortnite, Minecraft, Overwatch (Case Sense)");
                message.channel.sendMessage(dreqEmbed1);
                return;
            }
            switch(args[1]){
                case "Development":
                    message.channel.sendMessage(message.author + ", you have joined the Development Division");
                    var development = message.guild.roles.find('name', 'Development').id
                    message.guild.members.get(message.author.id).addRole(development);
                    break;
                case "Art":
                    message.channel.sendMessage(message.author + ", you joined the Art Division");
                    var art = message.guild.roles.find('name', 'Art').id
                    message.guild.members.get(message.author.id).addRole(art);
                    break;
                case "Minecraft":
                    message.channel.sendMessage(message.author + ", you joined the Minecraft Division");
                    var minecraft = message.guild.roles.find('name', 'Minecraft').id
                    message.guild.members.get(message.author.id).addRole(minecraft);
                    break;
                case "Fortnite":
                    message.channel.sendMessage(message.author + ", you joined the Fortnite Division");
                    var fortnite = message.guild.roles.find('name', 'Fortnite').id
                    message.guild.members.get(message.author.id).addRole(fortnite);
                    break;
                case "Overwatch":
                    message.channel.sendMessage(message.author + ", you joined the Overwatch Division");
                    var overwatch = message.guild.roles.find('name', 'Overwatch').id
                    message.guild.members.get(message.author.id).addRole(overwatch);
                    break;
                default:
                    message.channel.sendMessage(message.author + ", division not found! Remember case sensitive");
                    break;
            }
            break;
        case "mute":
            if(!args[1]){
                message.channel.sendMessage(message.author + ", please provide a player to mute")
                return;
            }
            if(!args[2]){
                message.channel.sendMessage(message.author + ", please provide a reason for the mute")
                return;
            }
            break;
        case "unmute":
            if(!args[1]){
                message.channel.sendMessage(message.author + ", please provide a user to unmute")
                return;
            }
            if(!args[2]){
                message.channel.sendMessage(message.author + ", please provide a reason for the unmute")
                return;
            }
            break;
        case "report":
            if(!args[1]){
                message.channel.sendMessage(message.author + ", please provide a user to report")
                return;
            }
            if(!args[2]){
                message.channel.sendMessage(message.author + ", please provide a reason for the report")
                return;
            }
            break;
        case "suggest":
            if(!args[1]){
                message.channel.sendMessage(message.author + ", please provide a thing to suggest")
            }
            break;
        case "play":
            if(!args[1]){
                message.channel.sendMessage(message.author + ", Please provide a link");
                return;
            }

            if(!message.member.voiceChannel){
                message.channel.sendMessage(message.author + ", you must be in a voice channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
        
            var server = servers[message.guild.id];

            server.queue.push(args[1]);
            message.channel.sendMessage(message.author + ", added " + args[1] + " to the queue");
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if(server.dispatcher){
                server.dispatcher.end();
                message.channel.sendMessage(message.author + " skipping current song.");
            }
            break;
        case "stop":
            var server = servers[message.guild.id];

            if(message.guild.voiceConnection){
                message.guild.voiceConnection.disconnect();
                message.channel.sendMessage(message.author + ", stopping the song.")
            }
            break;
        case "eval":
            message.channel.bulkDelete(1);
            const test = message.content.split(" ").slice(1);
            if(message.author.id !== "232622868591149057"){
                message.channel.sendMessage(message.author + ", please send me your authentication id to use eval");
                console.log(message.author.id + " | " + message.author.username + ", just tried using eval");
                return;
            }

            try {
                const code = test.join(" ");
                let evaled = eval(code);
          
                if (typeof evaled !== "string")
                  evaled = require("util").inspect(evaled);
          
                message.channel.send(clean(evaled), {code:"xl"});
              } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
              }
            break;
        case "kick":
            if(!args[1]){
                message.channel.sendMessage(message.author + ", you must specify a player to kick.");
                return;
            }
            if(!args[2]){
                message.channel.sendMessage(message.author + ", you must specify a reason to kick the player for.");
                return;
            }
            var user = message.guild.member(message.mentions.users.first());
            if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")){
                message.channel.sendMessage(message.author + ", I'm lacking permissions (KICK_MEMBERS)");
                return;
            }
            if(!message.member.hasPermission("KICK_MEMBERS")){
                message.channel.sendMessage(message.author + ", you're lacking permission to kick users");
                return;
            }
            if(!user){
                message.channel.sendMessage(message.author + ", user was not found");
                return;
            }
            var kReason = message.content.split(" ").slice(22);
            user.kick(kReason.join(" "));
            var kickEmbed = new Discord.RichEmbed()
                .setTitle("Player Kicked")
                .setDescription("A player has been kicked")
                .addField("Kicked Player", user.id.mentions)
                .addField("Kicked By", message.author)
                .addField("Kick Reason", "Not Specified (Currently Disabled)")
                .setColor("#ff9d00")
                .addField("Kicked At", message.createdAt)
                .addField("Kick Channel", message.channel);
            var administration = message.guild.channels.find('name', 'incidents')
            administration.sendMessage(kickEmbed);
            message.channel.sendMessage(message.author + ", user has been kicked. Punishment logs in " + message.guild.channels.find('name', 'incidents').id);
            break;
        case "clean":
            message.delete(10);
            message.channel.sendMessage("turtle");
            break;
        case "ban":
        if(!args[1]){
            message.channel.sendMessage(message.author + ", you must specify a player to ban.");
            return;
        }
        if(!args[2]){
            message.channel.sendMessage(message.author + ", you must specify a reason to ban the player for.");
            return;
        }
        var user = message.guild.member(message.mentions.users.first());
        if(!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")){
            message.channel.sendMessage(message.author + ", I'm lacking permissions (BAN_MEMBERS)");
            return;
        }
        if(!message.member.hasPermission("BAN_MEMBERS")){
            message.channel.sendMessage(message.author + ", you're lacking permission to ban users");
            return;
        }
        if(!user){
            message.channel.sendMessage(message.author + ", user was not found");
            return;
        }
            var bReason = message.content.split(" ").slice(22);
            user.ban(bReason.join(" "));
            var kickEmbed = new Discord.RichEmbed()
                .setTitle("Player Banned")
                .setDescription("A player has been banned")
                .addField("Banned Player", user.id.username + " with ID " + user.id.id)
                .addField("Banned By", message.author)
                .addField("Ban Reason", "Not Specified (Currently Disabled)")
                .setColor("#ff9d00")
                .addField("Banned At", message.createdAt)
                .addField("Ban Channel", message.channel);
            var administration = message.guild.channels.find('name', 'incidents')
            administration.sendMessage(kickEmbed);
            message.channel.sendMessage(message.author + ", user has been kicked. Punishment logs in " + message.guild.channels.find('name', 'incidents').id);
            break;
        case "setstatus":
            if(message.author.id !== "232622868591149057"){
                message.channel.sendMessage(message.author + ", you're lacking **BOT OWNER** to execute this.");
                return;
            }
            if(!args[1]){
                message.channel.sendMessage("I cannot set my status to null");
                return;
            }
            switch(args[1]){
                case "dnd":
                    bot.user.setStatus("dnd");
                    message.channel.sendMessage("Current Status Update: **DND**");
                    break;
                case "online":
                    bot.user.setStatus("online");
                    message.channel.sendMessage("Current Status Update: **ONLINE**");
                    break;
                case "offline":
                    bot.user.setStatus("idle");
                    message.channel.sendMessage("Current Status Update: **IDLE**");
                    break;
                case "invisible":
                    bot.user.setStatus("invisible");
                    message.channel.sendMessage("Current Status Update: **INVISIBLE**");
                    break;
                default:
                    message.channel.sendMessage("Status not found");
                    break;
            }
            break;
        case "setgame":
            if(message.author.id !== "232622868591149057"){
                message.channel.sendMessage(message.author + ", you're lacking **BOT OWNER** to execute this.");
                return;
            }
            if(!args[1]){
                message.channel.sendMessage("I can't set my game to nothing!");
                return;
            }
            var game = message.content.substring(8);
            bot.user.setGame(game);
            message.channel.sendMessage("Game was set to " + game);
            break;
        case "time":
            message.channel.sendMessage(message.author + ", it's currently " + message.createdAt);
            break;
    }
});

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

bot.login(process.env.BOT_TOKEN);

