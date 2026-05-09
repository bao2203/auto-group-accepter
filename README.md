# 🤖 Automated Roblox Group Join Request Accepting System

A fully asynchronous TypeScript-based system for automatically accepting Roblox group join requests while filtering potentially malicious users through configurable heuristics.

Designed with:

* ⚡ asynchronous processing
* 🛡️ rate-limit rail guards
* 🔍 profile filtering
* 🧠 configurable moderation logic

---

# ✨ Features

* Automatically accepts Roblox group join requests
* Filters suspicious users based on:

  * blacklisted profile words
  * account age
  * RAP (Recent Average Price)
  * current avatar value
* Fully asynchronous architecture
* Built-in rate-limit protection
* Easily configurable settings

---

# 📦 Installation

Clone the repository and install dependencies:

```sh
npm install
```

---

# 🚀 Running the Project

Compile the TypeScript source:

```sh
tsc
```

Start the program:

```sh
node dist/index.js
```

---

# 🔄 Recommended: Use Nodemon

For development or automatic recovery after crashes:

```sh
nodemon dist/index.js
```

---

# ⚙️ Configuration

Before running the system, configure the required settings inside:

```txt
./src/configs.ts
```

## IMPORTANT SETTINGS

### 1. Set your Group ID

You MUST replace the default group ID with your own Roblox group ID.

Otherwise, the system will not work properly.

---

### 2. Configure your Roblox Cookie

The system requires a valid `.ROBLOSECURITY` cookie from a Roblox account that:

* is inside the group
* has permissions to approve join requests

---

# 🔐 Getting Your Roblox Cookie

## Steps

1. Open Roblox while logged in
2. Press `F12`
3. Navigate to:

```txt
Application -> Cookies -> https://www.roblox.com
```

4. Locate:

```txt
.ROBLOSECURITY
```

5. Copy the cookie value
6. Paste it into your `.env` file

Example:

```env
ROBLOSECURITY=your_cookie_here
```

---

# ⚠️ Security Warning

Your `.ROBLOSECURITY` cookie is essentially your account password.

NEVER:

* share it
* upload it publicly
* commit it to GitHub

If your cookie is compromised:

> log out of all Roblox sessions/devices immediately to invalidate it.

---

# 🧹 Blacklisted Words Configuration

Blacklisted words are located at:

```txt
./src/settings/blacklisted_words.txt
```

## Format Example

```txt
spam
exploit
scam
malicious
```

Each word MUST be separated by a newline (`\n`).

Do NOT use commas or spaces.

---

# 🛠️ Tech Stack

* TypeScript
* Node.js
* Asynchronous processing architecture

---

# ⚠️ Disclaimer

This project is intended for moderation automation and quality-of-life purposes only.

Make sure your usage complies with:

* Roblox Terms of Service
* Roblox API rate limits
* community moderation guidelines

---

# 👨‍💻 Author

Made by **Baozi**
