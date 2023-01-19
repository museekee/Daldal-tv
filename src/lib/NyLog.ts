import fs from "fs/promises"
import path from "path"
const color = {
    Reset: "\x1B[0m",
    Bright: "\x1B[1m",
    Dim: "\x1B[2m",
    Underscore: "\x1B[4m",
    Blink: "\x1B[5m",
    Reverse: "\x1B[7m",
    Hidden: "\x1B[8m",
    
    FgBlack: "\x1B[30m",
    FgRed: "\x1B[31m",
    FgGreen: "\x1B[32m",
    FgYellow: "\x1B[33m",
    FgBlue: "\x1B[34m",
    FgMagenta: "\x1B[35m",
    FgCyan: "\x1B[36m",
    FgWhite: "\x1B[37m",
    
    BgBlack: "\x1B[40m",
    BgRed: "\x1B[41m",
    BgGreen: "\x1B[42m",
    BgYellow: "\x1B[43m",
    BgBlue: "\x1B[44m",
    BgMagenta: "\x1B[45m",
    BgCyan: "\x1B[46m",
    BgWhite: "\x1B[47m"
}

const date = new Date()
const filepath = path.join(__dirname, "..", "logs", `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.log`)

;(async() => {
    try {
        await fs.readFile(filepath)
    }
    catch {
        await fs.writeFile(filepath, "", "utf8")
    }
})()
/**
 * 
 * @param { number } type 0: Log / 1: Success / 2: Error / #: Debug
 * @param { string | object } text message
 */
async function CallLog(type: number, text?: string | object) {
    if (type == null) return
    text ??= typeof text
    const message = []
    switch (type) {
        case 0:
            message.push(`${color.FgWhite}`)
            break
        case 1:
            message.push(`${color.FgGreen}`)
            break
        case 2:
            message.push(`${color.FgRed}`)
            break
        case 3:
            message.push(`${color.FgCyan}`)
            break
    }
    
    message.push(`[${new Intl.DateTimeFormat("ko", { dateStyle: 'medium', timeStyle: "medium" }).format(new Date())}] `)
    message.push(JSON.stringify(text))
    console.log(`${message.join("")}${color.Reset}`)
    await fs.writeFile(filepath, `${(await fs.readFile(filepath)).toString()}\n${message.join("").replaceAll("\\", "")}`, "utf8")
}
export function log(text: string | object) {
    CallLog(0, text)
}
export function success(text: string | object) {
    CallLog(1, text)
}
export function error(text: string | object, stack?: string) {
    CallLog(2, text)
    CallLog(2, stack)
}
export function debug(text: string | object) {
    CallLog(3, text)
}