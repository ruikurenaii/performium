import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

const banner =
`/*

  the content of this file has been bundled by ESBUILD.
  for the decompiled version of the code, please visit this link below:
  https://github.com/ruikurenaii/performium
  
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	// it's best to change this to where it should be placed. i use linux, so that's why the directory looks like this
	// recommended: "./"
	// outfile: "~/Documents/Obsidian/Arch Linux/.obsidian/plugins/performosu-beta/main.js",
	outfile: "build/main.js",
	minify: prod,
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}
