# Contributing to ParleQuest

Thank you for helping improve French-learning practice.

1. Open an issue describing the problem or proposed change.
2. Keep changes focused and explain their learning or user-experience value.
3. Run `npm ci`, `npm run build`, then `npm test` before opening a pull request.
4. Include screenshots for interface changes and explain what was checked.

## Learning content

- Edit the generator in `scripts/generate-content.mjs`, then regenerate the bank. Avoid hand-editing the generated JSON alone.
- Keep one clearly targeted error and a precise accepted correction per exercise.
- Include French and Arabic explanations. Preserve French accents.
- Label CEFR levels as indicative unless the content has been independently calibrated.
- Avoid generalizations about all French people; communication depends on the setting and people involved.
- Do not turn sensitive situations into medical, legal or financial advice.
- Do not copy or redistribute examination papers without the necessary rights. Link to their original provider.

## Privacy and credentials

Never commit credentials, learner exports, real personal records or local account metadata. Production deployment requires a repository secret configured by its owner. Do not place it in a pull request or issue.

## Commit and review

Describe the final behavior and its purpose. Include the checks actually performed and any known limits. Do not claim generative AI functionality, unlimited unique content or certified language assessment when those are not implemented.
