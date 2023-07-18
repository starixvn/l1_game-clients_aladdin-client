import { DevTools, Tolgee } from "@tolgee/web";
import fs from "fs";

function writeFile(fileName, content, extension = "ts") {
    fs.writeFileSync(`${fileName}.${extension}`, content, {
        encoding: "utf8",
        flag: "w",
    });
}

const languageFolder = "./src/assets/resources/i18n/";
const languageCodes = ["en", "id", "th", "vi", "zh_cn", "zh_tw"];
const namespaces = ["Common", "gameNames", "messages", "ui", "DragonTigerFight"];
const tg = Tolgee().use(DevTools()).init({
    defaultLanguage: "en",
    availableLanguages: languageCodes,
    apiKey: "tgpak_gvpw45brha2xg3btoztxeytunvudc5dbn5twqodtonztc",
    apiUrl: "https://tolgee.sabagame.com/",
    projectId: "5",
    defaultNs: "messages",
    ns: namespaces,
});

tg.run();

tg.on("initialLoad", () => {
    const languages = {};

    languageCodes.forEach(async (languageId) => {
        await tg.changeLanguage(languageId);
        languages[languageId] = {};
        namespaces.forEach((ns) => {
            tg.getAllRecords().forEach((record) => {
                if (record.namespace == ns) {
                    languages[languageId][ns] = {};
                    record.data.forEach((value, key) => {
                        languages[languageId][ns][key] = value;
                    });
                }
            });
        });

        const languageScript = `const win = window as any;
export const languages = {0};

if (!win.languages) {
    win.languages = {};
}
                          
win.languages.${languageId} = languages;`;

        writeFile(languageFolder + languageId, languageScript.replace("{0}", JSON.stringify(languages[languageId], null, 4)));
    });

    writeFile(
        languageFolder + "index",
        `export * as en from "./en";
    export * as id from "./id";
    export * as th from "./th";
    export * as vi from "./vi";
    export * as zh_cn from "./zh_cn";
    export * as zh_tw from "./zh_tw";`
    );

    console.log("Generated done!");
});
