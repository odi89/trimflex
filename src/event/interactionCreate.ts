import { Collection } from 'discord.js'

export default async (client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!interaction.guild) return;
        if (!client.slash.has(interaction.commandName)) return;

        const command = client.slash.get(interaction.commandName)
        try {
            if (!client.cooldowns.has(command.name)) { client.cooldowns.set(command.name, new Collection()); }

            const now = Date.now();
            // @ts-ignore
            const timestamps = client.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 2) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000
                    return interaction.reply({ content: `Wait ${Number(timeLeft.toFixed(1))} more second${Number(timeLeft.toFixed(1)) < 2 ? '' : 's'} to use **${command.name}**`, ephemeral: true });
                }
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            if (command.permissions) {
                if (!interaction.member.permissions.has(command.permissions)) {
                    return interaction.reply({ content: `You're missing permissions : ${command.permissions.map(p => `**${p}**`).join(', ')}`, ephemeral: true })
                }
            }
            command.run(client, interaction);

        } catch (e) {
            console.log(e);
            await interaction.reply({ content: 'An error has occured', ephemeral: true });
        }
    }
};