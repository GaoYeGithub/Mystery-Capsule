import { Client, GatewayIntentBits, EmbedBuilder, Collection, Events, SlashCommandBuilder, REST, Routes } from 'discord.js';
import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const pb = new PocketBase('https://discord-mystery.pockethost.io');

class MysteryBoxClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

        this.lastDailyClaims = new Map();
        this.userBoxes = new Map();
        this.commands = new Collection();
    }

    async registerCommands() {
        const commands = [
            new SlashCommandBuilder()
                .setName('send-mystery-box')
                .setDescription('Send a mystery box with a YouTube URL')
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('The YouTube URL to store')
                        .setRequired(true))
                .toJSON(),
            new SlashCommandBuilder()
                .setName('open_mystery_box')
                .setDescription('Open a random mystery box')
                .toJSON()
        ];

        try {
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    async start() {
        const sendMysteryBoxCommand = {
            name: 'send-mystery-box',
            execute: async (interaction) => {
                try {
                    const url = interaction.options.getString('url');
                    
                    const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                    if (!youtubeUrlPattern.test(url)) {
                        await interaction.reply({
                            content: 'Please provide a valid YouTube URL',
                            ephemeral: true
                        });
                        return;
                    }

                    const record = await pb.collection('boxes').create({
                        field: url
                    });

                    const timeCapsuleUrl = `https://time-capsule-kappa.vercel.app/${record.id}`;

                    const embed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('Mystery Box Created!')
                        .setDescription(`Successfully stored YouTube URL in the mystery box!`)
                        .addFields(
                            { name: 'Box Link', value: timeCapsuleUrl },
                            { name: 'Box ID', value: record.id }
                        )
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed] });

                } catch (error) {
                    console.error('Error creating mystery box:', error);
                    await interaction.reply({
                        content: 'There was an error while creating the mystery box. Please try again later.',
                        ephemeral: true
                    });
                }
            }
        };

        const openMysteryBoxCommand = {
            name: 'open_mystery_box',
            execute: async (interaction) => {
                try {
                    const records = await pb.collection('boxes').getList(1, 50);
                    
                    if (!records.items.length) {
                        await interaction.reply({
                            content: 'No mystery boxes available!',
                            ephemeral: true
                        });
                        return;
                    }

                    const randomBox = records.items[Math.floor(Math.random() * records.items.length)];
                    const timeCapsuleUrl = `https://time-capsule-kappa.vercel.app/${randomBox.id}`;

                    const embed = new EmbedBuilder()
                        .setColor('#FF00FF')
                        .setTitle('Mystery Box Opened! 🎁')
                        .setDescription(`Here's your random mystery box!`)
                        .addFields(
                            { name: 'Box Link', value: timeCapsuleUrl }
                        )
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed] });

                } catch (error) {
                    console.error('Error opening mystery box:', error);
                    await interaction.reply({
                        content: 'There was an error while opening the mystery box. Please try again later.',
                        ephemeral: true
                    });
                }
            }
        };

        this.commands.set(sendMysteryBoxCommand.name, sendMysteryBoxCommand);
        this.commands.set(openMysteryBoxCommand.name, openMysteryBoxCommand);

        this.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error executing this command!',
                    ephemeral: true
                });
            }
        });

        this.on(Events.ClientReady, async () => {
            console.log(`Logged in as ${this.user.tag}!`);
            await this.registerCommands();
        });

        await this.login(process.env.DISCORD_TOKEN);
    }
}

const client = new MysteryBoxClient();
client.start().catch(console.error);