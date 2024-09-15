import { Express } from "express";
import multer from "multer";
import * as unzipper from "unzipper";
import { BookmarkItems } from "./migration/kotatsu/bookmarks";
import { BackupData } from "./model/backup";
import { Categories } from "./migration/kotatsu/categories";
import { Favourites } from "./migration/kotatsu/favourites";
import { Histories } from "./migration/kotatsu/histories";
import { Settings } from "./migration/kotatsu/settings";
import { Sources } from "./migration/kotatsu/sources";

const upload = multer({
    dest: 'uploads/',
});

export function registerEndpoints(app: Express): void {
    /**
     * @author Schnitzel5
     * @version 1.0.0
     * This endpoint migrates a kotatsu backup into a mangayomi backup.
     */
    app.post('/migrate/kotatsu', upload.single('backup'), async (req, res) => {
        try {
            if (!req.file) {
                res.status(400).json({});
                return;
            }
            const dir = await unzipper.Open.buffer(req.file.buffer);
            const backup: BackupData = {
                version: '1',
                categories: [],
                chapters: [],
                downloads: [],
                extensions: [],
                extensions_preferences: [],
                feeds: [],
                history: [],
                manga: [],
                settings: [],
                trackPreferences: [],
                tracks: [],
            };
            let bookmarks: BookmarkItems | undefined = undefined;
            let categories: Categories | undefined = undefined;
            let favourites: Favourites | undefined = undefined;
            let histories: Histories | undefined = undefined;
            let settings: Settings | undefined = undefined;
            let sources: Sources | undefined = undefined;
            await Promise.all(
                dir.files.map(async (file) => {
                    console.log(file);
                    const content = await file.buffer();
                    const data = JSON.parse(content.toString());
                    console.log(data);
                    switch (file.path) {
                        case "bookmark":
                            bookmarks = data as BookmarkItems;
                            break;
                        case "categories":
                            categories = data as Categories;
                            break;
                        case "favourites":
                            favourites = data as Favourites;
                            break;
                        case "history":
                            histories = data as Histories;
                            break;
                        case "settings":
                            settings = data as Settings;
                            break;
                        case "sources":
                            sources = data as Sources;
                            break;
                        default:
                            console.log("Ignored file in Kotatsu zip file:", file.path);
                    }
                })
            );
            if (settings) {
                processSettings(backup, settings);
            }
            if (bookmarks) {
                processBookmarks(backup, bookmarks);
            }
            res.status(200).json({});
        } catch (error: any) {
            console.log('Migration failed: ', error);
            res.status(500).json({ error: "Server error" });
        }
    });
}

function processBookmarks(backup: BackupData, bookmarks: BookmarkItems) {

}

function processCategories(backup: BackupData, categories: Categories) {

}

function processFavourites(backup: BackupData, favourites: Favourites) {

}

function processHistories(backup: BackupData, histories: Histories) {

}

function processSettings(backup: BackupData, settings: Settings) {

}

function processSources(backup: BackupData, sources: Sources) {

}