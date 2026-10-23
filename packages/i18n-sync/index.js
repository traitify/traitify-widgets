import I18nSync from "./src/i18n-sync";

const args = process.argv.slice(2);
const options = {};

if(args.includes("--dev")) { options.environment = "staging"; }
if(args.includes("--dryRun")) { options.dryRun = true; }
if(args.includes("--quiet")) { options.quiet = true; }
if(args.includes("--verbose")) { options.verbose = true; }

I18nSync.run(options);
