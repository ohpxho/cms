import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	...compat.config({
		extends: ["prettier"],
		plugins: ["prettier"],
		rules: {
			"prettier/prettier": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-explicit-any": "warn",
			"react-hooks/exhaustive-deps": "warn",
			"react/jsx-uses-react": "off",
			"react/react-in-jsx-scope": "off",
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"prefer-const": "error",
			"no-var": "error",
		},
	}),
];

export default eslintConfig;
