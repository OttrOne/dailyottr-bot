# DailyOttr Bot

## How to use as a Discord Server Owner

The bot is in closed beta for now.
It **is and will remain completely free** :3

If you want to support me, I have a [Ko-Fi](https://ko-fi.com/alexottr) and I'm currently thinking about setting up a Patreon to cover the server costs etc. **This is completely voluntary tho**.

After you got an Invitation-Link you can check all necessary steps with the command: `do!health`

It will tell you, that there is no configured channel for the bot to post the Otts in.
You can fix that by sending `do!set` in the channel you want the pictures being sent to.

Then you can check the permissions by another `do!health`.
The Bot needs the `Embed links` permission for that specific channel, that's it.

The Bot will now ask DailyOtter.org for new pictures every couple hours.

Commands like `do!last` or `do!today` to send the last Picture again will follow soon and updated automatically.

## How to host the Bot yourself?
If you have your own infrastructure and want to modify the bot, that's absolutely fine. The code is Open Source under the MIT license and you can just fork the project (or download via zip lol) and host it yourself. I'll provide a **Docker image** soon.

[![Docker Image CI](https://github.com/OttrOne/dailyottr-bot/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/OttrOne/dailyottr-bot/actions/workflows/docker-image.yml)
