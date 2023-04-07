import { Collection } from "discord.js";

export default async (client, message) => {
    if (message.author.bot) { return }
    const prefix = client.config.prefix

    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) { return message.channel.send(`Hi, I'm ${client.user.username}! In this server, my prefix is \`${prefix}\``) }
    if (!message.content.startsWith(prefix)) { return }
    console.log(message.content.split(" "))
    // const command = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
    const command = message.content.split(' ')[1]
    const args = message.content.split(' ').slice(2);
    let cmd;
    if (client.commands.has(command)) { cmd = client.commands.get(command) }
    else if (client.aliases.has(command)) { cmd = client.commandes.get(client.aliases.get(command)) }
    if (!cmd) return;
    const props = await import(`../command/${cmd.dir}/${cmd.name}.js`).then((settings) => settings.default);

    // COOLDOWNS & ERROR
    //@ts-ignore
    if (!client.cooldowns.has(props.name)) { client.cooldowns.set(props.name, new Collection()); }
    const now = Date.now();
    //@ts-ignore
    const timestamps = client.cooldowns.get(props.name);
    const cooldownAmount = (props.cooldown || 2) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Wait ${timeLeft.toFixed(1)} more second${Number(timeLeft.toFixed(1)) < 2 ? '' : 's'} to use **${props.name}**`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // PERMISSION CHECKER
    if (props.permissions) {
        if (!message.member.permissions.has(props.permissions)) {
            return message.reply(`You're missing permissions : ${props.permissions.map(p => `**${p}**`).join(', ')}`)
        }
    }

    //LOADING COMMANDS
    cmd.run(client, message, args).catch(err => client.emit("error", err, message))
};