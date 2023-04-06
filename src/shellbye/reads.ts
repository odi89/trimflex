import fs from "fs"
import path from "path"
const read_path = path.resolve("./GOODREADS.md")
const GOOD_READS = await fs.readFileSync(read_path, "utf-8")


type categoryType = "Coding" | "Hacking" | "Cyber" | "Misc"
enum Category {
    Coding = "### 👨‍💻 Coding",
    Hacking = "### 💻 Hacking",
    Cyber = "### 🔒 Cyber security",
    Misc = "### 🦄 Misc"
}
const getIndexCategory = (cat: categoryType) => {
    if (cat === "Coding") return Category.Coding
    if (cat === "Hacking") return Category.Hacking
    if (cat === "Cyber") return Category.Cyber
    if (cat === "Misc") return Category.Misc
}

async function appendToMarkdown({ url, title, category }: { url: string, title: string, category: categoryType }) {
    // const CYBER_PATTERN = new RegExp(/(?:^|\n)### Cyber security\s[^\n]*\n(.*?)(?=\n### Hacking?\s|$)/)
    const index = GOOD_READS.split("\n").indexOf(getIndexCategory(category))
    const testArray = GOOD_READS.split("\n")
    testArray.splice(index + 2, 0, `* [${title}](${url})`)
    return await fs.writeFileSync("testdo.md", testArray.join("\n"))
}

// appendToMarkdown({ title: "Interesting podcast episode", url: "https://www.youtube.com/watch?v=FPMyZA1_vMY", category: "Misc" })