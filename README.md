black(-conda) mirror
====================

Mirror of black for pre-commit with conda as a language.

For pre-commit: see https://github.com/pre-commit/pre-commit
For black: see https://github.com/psf/black

### Using black with pre-commit and conda:

Add this to your `.pre-commit-config.yaml`

```yaml
 - repo: https://github.com/Quantco/pre-commit-mirrors-black
   rev: ''  # Use the sha / tag you want to point at
   hooks:
     - id: black-conda
```

