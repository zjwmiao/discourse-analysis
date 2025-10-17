import DiscourseRecommendedTheme from "@discourse/lint-configs/eslint-theme";

export default [...DiscourseRecommendedTheme, {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      _oaReport: 'readonly',
    },
  }
}];
