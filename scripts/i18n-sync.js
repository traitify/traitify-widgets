import I18nSync from "lib/i18n-sync";

const args = process.argv.slice(2);
const options = {};

if(args.includes("--dev")) { options.environment = "staging"; }

I18nSync.run(options);
