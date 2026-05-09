AUTOMATED GROUP JOIN REQUEST ACCEPTING SYSTEM

this program will help you approve member join requests for your roblox group
you can make it so the program can filter bad user's requests via blacklisted words in their profiles, RAP, current avatar price and account age in order to avoid malicious users
the program is fully asynchronous, with rate-limit rail guards!

to start running please do:

```sh
tsc
node dist/index.js
```

but this is preferably paired with nodemon for auto-retry if an error crash occurs

to edit the blacklisted words, please navigate to ./src/settings/blacklisted_words.txt

* IMPORTANT: the format must be like this
```txt
spam
exploit
bad
words
here
```

noted that the words must be seperated by a newline (\n)

* NOTICE!

before running the system, PLEASE check out config.ts to tweak settings as improper config MAY CRASH the program
*located in: ./src/configs.ts

FIRST, CHANGE GROUP ID TO YOUR GROUP OR IT WONT WORK!

SECONDLY, get your roblox cookie (preferably via an alternate account THAT MUST BE in the group, with request accepting permissions)

*steps to get your cookie:
1. press F12 on www.roblox.com website, must be logged in
2. navigate to Application -> Cookies -> https://www.roblox.com
3. locate the variable ".ROBLOSECURITY"
4. copy your cookie and paste in .env file

WITHOUT COOKIE, THE PROGRAM WONT WORK!

*WARNING: TREAT THE COOKIE AS YOUR PRIVATE PASSWORD, DO NOT SHARE IT AS IT MAY RESULT IN YOUR ACCOUNT BEING COMPROMISED
TO RESET COOKIE, JUST LOG OUT ALL DEVICES/SESSIONS


# this program is made by baozi (rblx: donoteatmyburger1, discord: bao2203.)